# SPÜLBOY NU® — 3D landing page

A single-page storefront for the two SPÜLBOY NU® glass washers, built with the same stack as the
Chantai platform: **Angular 21 (standalone, signals, SSR) + Tailwind CSS 4**, with **three.js** for the
interactive product view.

Content is taken from the official *SPÜLBOY NU® image brochure (EN)*.

The palette follows the printed product catalogue: white paper, the SPÜLBOY signal orange for every
heading and call to action, charcoal type, plus the catalogue's soft blue and green as secondary
accents. All of it lives as tokens in [`src/styles.css`](src/styles.css) — change a colour there and
the whole page follows, because no component hard-codes one.

## What the page does

| Area | Behaviour |
| --- | --- |
| Header | SPÜLBOY® lock-up, Home, the two products, Contact, quote CTA |
| Hero | Positioning copy plus the brochure's headline numbers |
| Products | Exactly two: **NU® PORTABLE** and **NU® BUILT-IN**, each on its own 3D stage |
| 3D stage | Drag to spin a full 360°, scroll/pinch to zoom, auto-turntable, feature markers |
| Showcase | Two play buttons: the exploded view (~2.6 s) and the glass-cleaning demo (5 s) |
| Dropdowns | Specification and Delivery contents per product |
| Price | Driven by data; renders "Price on request" until list prices are entered |
| Footer | The contact page: quote form prefilled with the product the visitor was viewing |

## Run it

```bash
npm install
npm start                 # dev server on http://localhost:4200
npm run build             # production build (browser + SSR)
npm test                  # unit tests (vitest)
npm run serve:ssr:spuelboy-nu   # serve the SSR build from dist/
```

`angular.json → build.options.security.allowedHosts` lists the hostnames the SSR server accepts.
`localhost` and `127.0.0.1` are allowed; **add the production hostname before deploying**, otherwise
Angular falls back to client-side rendering.

## Where to edit things

Everything a business user changes lives in one file:
[`src/app/core/data/nu-products.data.ts`](src/app/core/data/nu-products.data.ts).

- **Prices** — `pricing.amount` is `null` and `quoteOnly` is `true`, which renders the
  "Price on request" treatment. Set an amount and `quoteOnly: false` and the page formats and shows
  it automatically.
- **Specifications** — grouped `label`/`value` pairs. Anything the brochure does not publish
  (weight, article numbers, water volumes) is marked `On request` and tagged `DATA TODO` in a note.
  The outer dimensions, the counter cut-out and the brush-pot diameter come from the manufacturer
  dimension drawing and are mirrored by the constants at the top of
  [`core/three/nu-model.factory.ts`](src/app/core/three/nu-model.factory.ts) — change both together.
- **Hotspots** — the labelled markers on the 3D model; `position` is in metres, y-up, in model space.
  The device stands with its deck at y ≈ 0.35 (portable) / y ≈ 0.38 (built-in).

## The 3D viewer

Two layers, deliberately separated:

- [`core/three/product-viewer.ts`](src/app/core/three/product-viewer.ts) — framework-free WebGL stage:
  renderer, IBL lighting from `RoomEnvironment`, `OrbitControls`, hotspot projection with an
  occlusion test, and the orientation announcements.
- [`landing/product-viewer/`](src/app/landing/product-viewer/) — the Angular component: DOM,
  accessibility, lifecycle. It imports three.js through a **dynamic import inside
  `afterNextRender`**, so the library never runs during SSR and lands in its own lazy chunk
  (~600 kB, loaded after the page is interactive).

Performance: rendering is paused by an `IntersectionObserver` when a stage scrolls out of view and by
`visibilitychange` when the tab is hidden, device pixel ratio is capped at 2, and hotspots are
re-projected every third frame.

Accessibility: the canvas is focusable and fully keyboard-operable (arrows orbit, ↑/↓ change camera
height, `+`/`-` zoom, `Home` resets, `Shift` for bigger steps), the current viewing angle is announced
in a live region, every marker is a real button with a text description, auto-rotation and animation
respect `prefers-reduced-motion`, and if WebGL is missing the stage explains that the same details are
in the specification panel below.

### Swapping in real CAD models

The devices are currently **procedural geometry** (`core/three/nu-model.factory.ts`) — built to the
product photography and the dimension drawing (397 × 270 × 337 mm, Ø167 mm brush pot, grey housing
with orange sealing details), but not a CAD-accurate model. To use real exports:

1. Put the file in `public/models/`, e.g. `public/models/nu-portable.glb`.
2. Set `viewer.modelUrl: '/models/nu-portable.glb'` in the data file.
3. Keep the material names used by the procedural model (`NU_Housing`, `NU_Deck`, `NU_Accent`,
   `NU_Brush`, …) so the two stay interchangeable.

The GLB is loaded lazily and normalised (centred, dropped on the floor, scaled to ~0.75 m). If it
fails to load, the procedural model stays on screen — the page never goes blank.

## Contact form

`core/services/contact.service.ts` posts to `environment.contactEndpoint`. That is empty, so the form
currently records the enquiry locally, returns a reference number and tells the visitor plainly that
the delivery route is not connected yet. Point `contactEndpoint` at the platform API (a NestJS
endpoint on the Chantai API, for example) and the same form starts posting for real.

## Project layout

```
src/app/
  core/
    data/nu-products.data.ts      # ← all content, prices, specifications, hotspots
    models/product.model.ts       # typed contract for the above
    services/contact.service.ts   # quote / contact submissions
    three/                        # WebGL stage + procedural device geometry
  landing/
    landing.*                     # the single page: hero, products, cleaning process
    product-showcase/             # one product: 3D stage + copy + dropdown panels
    product-viewer/               # Angular wrapper around the WebGL stage
  shared/
    header/                       # logo, nav, quote CTA
    footer/                       # contact form + manufacturer details
```
