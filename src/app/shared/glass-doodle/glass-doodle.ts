import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The single-line glassware drawing that fills the empty right half of the
 * hero.
 *
 * The artwork is a supplied raster, served from `public/`. That fixes its
 * orange into the file, so it no longer tracks `--color-nu-orange` the way the
 * vector version did: a change to that token has to be matched in the image.
 */
@Component({
  selector: 'app-glass-doodle',
  templateUrl: './glass-doodle.html',
  styleUrl: './glass-doodle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlassDoodle {}
