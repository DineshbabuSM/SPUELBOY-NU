import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import type {
  HotspotProjection,
  ProductViewer as ProductViewerEngine,
  ViewerSequence,
} from '../../core/three/product-viewer';
import { NuViewerConfig } from '../../core/models/product.model';

/**
 * Angular shell around the WebGL stage.
 *
 * The component owns DOM, accessibility and lifecycle; `ProductViewer` owns
 * WebGL. three.js is pulled in through a dynamic import inside
 * `afterNextRender`, which keeps it out of the SSR bundle *and* out of the
 * initial browser chunk — the page is interactive long before the renderer
 * lands.
 */
@Component({
  selector: 'app-product-viewer',
  templateUrl: './product-viewer.html',
  styleUrl: './product-viewer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductViewer3d {
  readonly config = input.required<NuViewerConfig>();
  readonly productName = input.required<string>();

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly stageRef = viewChild<ElementRef<HTMLElement>>('stage');

  private engine: ProductViewerEngine | null = null;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly hotspots = signal<HotspotProjection[]>([]);
  protected readonly activeHotspotId = signal<string | null>(null);
  protected readonly orientation = signal('Front view');
  protected readonly loaded = signal(false);
  protected readonly unavailable = signal<string | null>(null);
  protected readonly autoRotate = signal(true);
  protected readonly showHotspots = signal(false);
  /** Which showcase sequence is running, if any. Only one plays at a time. */
  protected readonly sequence = signal<ViewerSequence | null>(null);

  protected readonly activeHotspot = computed(() => {
    const id = this.activeHotspotId();
    return id ? (this.hotspots().find((spot) => spot.id === id) ?? null) : null;
  });

  constructor() {
    afterNextRender(() => void this.boot());
  }

  private async boot(): Promise<void> {
    const canvas = this.canvasRef()?.nativeElement;
    const stage = this.stageRef()?.nativeElement;
    if (!canvas || !stage) return;

    if (!this.supportsWebGl()) {
      this.unavailable.set('Your browser or device cannot display the interactive 3D view.');
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      const { ProductViewer } = await import('../../core/three/product-viewer');
      const engine = new ProductViewer({
        canvas,
        config: this.config(),
        reducedMotion,
        callbacks: {
          onHotspots: (projections) => this.hotspots.set(projections),
          onOrientationChange: (label) => this.orientation.set(label),
          onReady: () => this.loaded.set(true),
          onSequenceEnd: (ended) => this.advanceTour(ended),
          onUnavailable: (reason) => this.unavailable.set(reason),
        },
      });
      this.engine = engine;
      this.autoRotate.set(engine.isAutoRotating());

      const resizeObserver = new ResizeObserver(() => engine.resize());
      resizeObserver.observe(stage);

      // Only render while the product is actually on screen: two WebGL stages
      // idling in parallel is exactly the battery drain shoppers notice.
      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) engine.start();
            else engine.stop();
          }
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(stage);

      const onVisibilityChange = () => {
        if (document.hidden) engine.stop();
        else engine.start();
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        engine.dispose();
        this.engine = null;
      });
    } catch {
      this.unavailable.set('The interactive 3D view could not be started on this device.');
    }
  }

  private supportsWebGl(): boolean {
    try {
      const probe = document.createElement('canvas');
      return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    } catch {
      return false;
    }
  }

  // ------------------------------------------------------------------ toolbar

  /**
   * The whole demonstration from one press: the device fans apart to show the
   * parts inside and reassembles, and then a stained beer glass is scrubbed on
   * the brushes, clear-rinsed on the rinser and lifted out clean.
   */
  protected playTour(): void {
    if (this.sequence()) return;
    if (this.engine?.playExplodedView()) this.sequence.set('exploded');
  }

  /**
   * Called by the engine as each half finishes. `exploded` is only ever the first
   * half of the tour, so its end starts the cleaning run rather than releasing
   * the button — the toolbar stays locked until the whole thing has played.
   *
   * The engine clears its own sequence before it calls back, so starting the
   * second half from in here is not re-entrant.
   */
  private advanceTour(ended: ViewerSequence): void {
    if (ended === 'exploded' && this.engine?.playCleaningDemo()) {
      this.sequence.set('cleaning');
      return;
    }
    this.sequence.set(null);
  }

  protected zoom(direction: -1 | 1): void {
    this.engine?.zoomBy(direction === 1 ? 0.85 : 1.18);
    this.syncAutoRotate();
  }

  protected reset(): void {
    this.engine?.resetView();
    this.activeHotspotId.set(null);
    this.syncAutoRotate();
  }

  protected toggleAutoRotate(): void {
    const next = !this.autoRotate();
    this.engine?.setAutoRotate(next);
    this.autoRotate.set(next);
  }

  protected toggleHotspots(): void {
    this.showHotspots.update((value) => !value);
    if (!this.showHotspots()) this.activeHotspotId.set(null);
  }

  protected selectHotspot(projection: HotspotProjection): void {
    this.activeHotspotId.update((current) => (current === projection.id ? null : projection.id));
  }

  private syncAutoRotate(): void {
    if (this.engine) this.autoRotate.set(this.engine.isAutoRotating());
  }

  // ----------------------------------------------------------------- keyboard

  /**
   * Full keyboard parity with the mouse: arrows orbit, +/- zoom, Home resets,
   * so the 3D view is not a mouse-only island in the page.
   */
  protected onStageKeydown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 12 : 6;
    let handled = true;

    switch (event.key) {
      case 'ArrowLeft':
        this.engine?.rotateBy(-step, 0);
        break;
      case 'ArrowRight':
        this.engine?.rotateBy(step, 0);
        break;
      case 'ArrowUp':
        this.engine?.rotateBy(0, -step / 2);
        break;
      case 'ArrowDown':
        this.engine?.rotateBy(0, step / 2);
        break;
      case '+':
      case '=':
        this.engine?.zoomBy(0.9);
        break;
      case '-':
      case '_':
        this.engine?.zoomBy(1.12);
        break;
      case 'Home':
        this.reset();
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      this.syncAutoRotate();
    }
  }
}
