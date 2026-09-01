/**
 * Domain types for the SPÜLBOY NU® landing page.
 *
 * The page renders exactly two products (PORTABLE and BUILT-IN). Everything a
 * business user is expected to edit — copy, specifications and pricing — lives
 * in `core/data/nu-products.data.ts` and is typed by the interfaces below, so
 * the UI never has to be touched for a content change.
 */

export type NuProductId = 'nu-portable' | 'nu-built-in';

/** Which procedural/GLTF body the 3D viewer builds for a product. */
export type NuViewerVariant = 'portable' | 'built-in';

export interface NuSpecItem {
  label: string;
  value: string;
  /** Optional clarification rendered under the value. */
  note?: string;
}

export interface NuSpecGroup {
  title: string;
  items: NuSpecItem[];
}

export interface NuPricing {
  currency: 'EUR';
  /**
   * Net list price. `null` renders the "price on request" treatment instead of
   * a number — set a value here once list prices are signed off.
   */
  amount: number | null;
  /** e.g. "per device, net" — shown next to the amount. */
  unit: string;
  note: string;
  /** Forces the quote CTA even when `amount` is set. */
  quoteOnly: boolean;
}

/** A labelled point in model space, projected to a DOM callout each frame. */
export interface NuHotspot {
  id: string;
  label: string;
  description: string;
  /** Position in model units (metres), y-up. */
  position: [number, number, number];
}

export interface NuViewerConfig {
  variant: NuViewerVariant;
  /**
   * Optional glTF/GLB asset served from `public/models/`. When set and
   * reachable it replaces the procedural geometry; when null (or the fetch
   * fails) the viewer falls back to the built-in parametric model, so the page
   * is never blank while CAD exports are still pending.
   */
  modelUrl: string | null;
  /** Still image used as the pre-hydration poster and no-WebGL fallback. */
  posterUrl: string | null;
  /** Vertical framing offset so the device sits on the studio floor. */
  cameraTargetY: number;
  hotspots: NuHotspot[];
}

export interface NuProduct {
  id: NuProductId;
  /** Anchor used by the header navigation, e.g. `#nu-portable`. */
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  /** Short selling points rendered as a bullet list beside the 3D stage. */
  highlights: string[];
  includedInBox: string[];
  specGroups: NuSpecGroup[];
  pricing: NuPricing;
  viewer: NuViewerConfig;
}
