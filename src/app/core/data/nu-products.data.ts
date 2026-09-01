import { NuProduct, NuSpecGroup } from '../models/product.model';

/**
 * Content source of truth for the landing page.
 *
 * Copy, highlights, certifications and the cleaning promises are taken from the
 * official "SPÜLBOY NU® image brochure (EN)".
 *
 * Outer dimensions, the counter cut-out and the brush pot diameter come from the
 * manufacturer dimension drawing and are mirrored by the 3D model in
 * `core/three/nu-model.factory.ts` — change them in both places together.
 *
 * DATA TODO — the brochure does not publish figures for the following, so they
 * are marked "On request" / null until Schäfer Produkte GmbH confirms them:
 *   - list prices (`pricing.amount`)
 *   - weight, water volumes, article numbers
 * Replace the placeholders below; no component code has to change when you do.
 */

const ON_REQUEST = 'On request';

/** Specification groups shared by both devices (all brochure-verified). */
const sharedSpecs = (): NuSpecGroup[] => [
  {
    title: 'Cleaning principle',
    items: [
      { label: 'Method', value: 'Manual brush cleaning with cold fresh water — no electricity required' },
      {
        label: 'Rinsing mechanism',
        value: 'Double rinsing power with flexible telescope rinser',
        note: 'Cleans the bowl, the stem and the base — ideal for glasses with a handle and for jugs.',
      },
      {
        label: 'Head valve',
        value: 'Fresh-water circulation through the inside of the glass',
        note: 'The glass stays wet and cools down before it goes under the next tap.',
      },
      { label: 'Automatic refill', value: 'Every rinse triggers a fresh-water refill of the pre-rinse pot' },
      { label: 'Fresh-water button', value: 'Push the button — rapid first filling and top-up during service' },
      { label: 'Fine sieve', value: 'Optimal filtering of the incoming fresh water' },
      { label: 'Back-flow preventer', value: 'Hybrid back-flow preventer for guaranteed water separation' },
      { label: 'Glass types', value: 'Cleans all types of glasses' },
    ],
  },
  {
    title: 'Design & build',
    items: [
      { label: 'Construction', value: 'Sealed hygienic design with no corners, edges or indentations' },
      { label: 'Origin', value: '100% made in Germany' },
      {
        label: 'Maintenance',
        value: 'Dispenses with many individual and spare parts',
        note: 'In need, just change the brushes.',
      },
      { label: 'Connection', value: 'Quick connection — EASY CLIX® compatible' },
      {
        label: 'Outer dimensions (W × D × H)',
        value: '397 × 270 × 337 mm',
        note: 'Body 369 × 240 mm at the top, 222 mm across the base; 44 mm top cover.',
      },
      { label: 'Brush pot', value: 'Ø 167 mm, alongside the pre-rinse basin' },
      { label: 'Weight', value: ON_REQUEST, note: 'DATA TODO' },
      { label: 'Article number', value: ON_REQUEST, note: 'DATA TODO' },
    ],
  },
  {
    title: 'Certification & hygiene',
    items: [
      { label: 'Company certification', value: 'DIN EN ISO 9001:2015' },
      { label: 'Device certification', value: 'DIN 6653-3' },
      { label: 'Hygiene', value: '100% hygiene — tested by independent institutes' },
      {
        label: 'Antimicrobial protection',
        value: 'NU® pro Iceblue finish: highly effective against viruses, fungi and bacteria',
      },
      { label: 'Consumables', value: 'Original SPÜLBOY® tabs — highly effective and biodegradable' },
    ],
  },
  {
    title: 'Sustainability & economy',
    items: [
      { label: 'Cost saving', value: 'Up to 80% saving compared with an electric glasswasher' },
      { label: 'Energy', value: 'Cleaning without electricity' },
      { label: 'Water', value: '100% cleanliness with a minimum use of fresh water' },
      { label: 'Care', value: 'Gentle on glasses and decor, low detergent consumption' },
    ],
  },
];

export const NU_PRODUCTS: NuProduct[] = [
  {
    id: 'nu-portable',
    slug: 'nu-portable',
    name: 'SPÜLBOY NU® PORTABLE',
    eyebrow: 'The NU® generation',
    tagline: 'All over ready for use — without a sink.',
    summary:
      'Place the drain hose at the water outlet and wash independently, anywhere. The robust, easy-care all-rounder: no event without NU®.',
    highlights: [
      'Works without a sink — connect, drain, wash',
      'Robust construction, quick connection, perfect performance',
      'Transportable and space-saving — short distances at any location',
      'Push the button for extra fresh water at any moment',
      'Simplest maintenance: in need, just change the brushes',
    ],
    includedInBox: [
      'NU® PORTABLE device with Sanitized® brush set',
      'Drain hose and quick connection',
      'Fine sieve and hybrid back-flow preventer',
      'Original SPÜLBOY® glass washing tabs (starter bundle)',
    ],
    specGroups: [
      ...sharedSpecs(),
      {
        title: 'Installation',
        items: [
          { label: 'Setup', value: 'Free-standing — no sink and no cut-out required' },
          { label: 'Drainage', value: 'Drain hose placed at the water outlet' },
          {
            label: 'Mobility',
            value: 'Transportable; pairs with the NU on Tour® glass washing table with foldable legs',
          },
          { label: 'Fresh-water supply', value: ON_REQUEST, note: 'DATA TODO — hose length and connector thread.' },
        ],
      },
    ],
    pricing: {
      currency: 'EUR',
      // DATA TODO — set the net list price to switch off the "price on request" treatment.
      amount: null,
      unit: 'per device, net',
      note: 'Includes the brush set, the supply hose and the quick connection.',
      quoteOnly: true,
    },
    viewer: {
      variant: 'portable',
      // Drop a CAD export at `public/models/nu-portable.glb` and point this at it.
      modelUrl: null,
      posterUrl: null,
      // Positions are in metres on the model, whose deck sits at y = 0.35.
      cameraTargetY: 0.19,
      hotspots: [
        {
          id: 'brushes',
          label: 'Sanitized® brush set',
          description: 'Move the glass over the brushes 3–5 times with rapid up-and-down movements. Don’t turn.',
          position: [0.094, 0.362, 0],
        },
        {
          id: 'rinser',
          label: 'Telescope rinser',
          description: 'Double rinsing power — cleans bowl, stem and base, then cools the glass.',
          position: [-0.093, 0.345, 0],
        },
        {
          id: 'button',
          label: 'Fresh-water button',
          description: 'Push the button for the first filling in the morning and for a rapid top-up during service.',
          position: [0.004, 0.362, -0.064],
        },
        {
          id: 'hose',
          label: 'Supply hose & tap',
          description: 'No sink needed: connect the hose, place the drain at any water outlet and wash independently.',
          position: [-0.19, 0.055, 0.09],
        },
      ],
    },
  },
  {
    id: 'nu-built-in',
    slug: 'nu-built-in',
    name: 'SPÜLBOY NU® BUILT-IN',
    eyebrow: 'The NU® generation',
    tagline: 'Less space? One sink only? NU® builds straight in.',
    summary:
      'Create a cut-out with the help of our template and hang in the NU®. The same hygienic cleaning performance, flush with your counter.',
    highlights: [
      'Drops into an existing counter or sink run',
      'Cut-out template supplied — no custom fabrication needed',
      'Flush, sealed rim with no corners, edges or indentations',
      'Frees the second sink for service while glasses are washed',
      'Available in the antimicrobial NU® pro Iceblue finish',
    ],
    includedInBox: [
      'NU® BUILT-IN device with Sanitized® brush set',
      'Cut-out template for the counter',
      'Fine sieve and hybrid back-flow preventer',
      'Original SPÜLBOY® glass washing tabs (starter bundle)',
    ],
    specGroups: [
      ...sharedSpecs(),
      {
        title: 'Installation',
        items: [
          { label: 'Mounting', value: 'Hangs into a counter cut-out made with the supplied template' },
          {
            label: 'Counter cut-out (W × D)',
            value: 'approx. 379 × 250 mm',
            note: 'Body 369 × 240 mm plus fitting clearance — always cut with the supplied template.',
          },
          {
            label: 'Rim on the worktop (W × D)',
            value: '397 × 270 mm',
            note: 'The sealed top cover overlaps the cut-out on every side.',
          },
          { label: 'Required depth below counter', value: 'at least 293 mm' },
          { label: 'Drainage', value: 'Connects to the existing sink drainage' },
          { label: 'Custom fabrication', value: 'Custom-made built-in versions available on request' },
        ],
      },
    ],
    pricing: {
      currency: 'EUR',
      // DATA TODO — set the net list price to switch off the "price on request" treatment.
      amount: null,
      unit: 'per device, net',
      note: 'Built-in versions are custom made; the quote includes the cut-out template and the fitting notes.',
      quoteOnly: true,
    },
    viewer: {
      variant: 'built-in',
      // Drop a CAD export at `public/models/nu-built-in.glb` and point this at it.
      modelUrl: null,
      posterUrl: null,
      // The worktop sits at y = 0.34; the device deck rises to y = 0.38.
      cameraTargetY: 0.26,
      hotspots: [
        {
          id: 'rim',
          label: 'Flush counter rim',
          description: 'The sealed rim sits on the worktop — no corners, edges or indentations to trap soil.',
          position: [0.2, 0.355, 0.11],
        },
        {
          id: 'cutout',
          label: 'Template cut-out',
          description: 'Create the opening with our template, then simply hang in the NU®.',
          position: [-0.27, 0.348, 0.17],
        },
        {
          id: 'brushes',
          label: 'Sanitized® brush set',
          description: 'The same brush generation as the portable device — change periodically for best hygiene.',
          position: [0.094, 0.393, 0],
        },
        {
          id: 'rinser',
          label: 'Telescope rinser',
          description: 'Clear-rinsing from the in- and outside for 2–3 seconds, then draining over the pot.',
          position: [-0.093, 0.376, 0],
        },
      ],
    },
  },
];

/** The four-step cleaning routine, straight from the brochure. */
export const NU_CLEANING_STEPS = [
  { step: 1, phase: 'Pre-washing', text: 'Place one original SPÜLBOY® washing tablet in the brush pot.' },
  {
    step: 2,
    phase: 'Pre-washing',
    text: 'Move the glass completely over the brush at least 3–5 times with rapid up-and-down movements. Don’t turn!',
  },
  {
    step: 3,
    phase: 'Clear-rinsing',
    text: 'Rinse thoroughly from the in- and outside for 2–3 seconds, then allow draining over the pre-wash pot.',
  },
  {
    step: 4,
    phase: 'Daily care',
    text: 'Cleanse the brushes and the device itself daily — that guarantees hygienic cleaning of your glasses.',
  },
];

/** Manufacturer contact details from the brochure back page. */
export const NU_COMPANY = {
  name: 'Schäfer Produkte GmbH',
  street: 'Simonshöfchen 53',
  city: '42327 Wuppertal / Germany',
  phone: '+49 (0) 202 695 32-0',
  phoneHref: '+4920269532',
  email: 'info@spuelboy.de',
  website: 'www.spuelboy.de',
  websiteHref: 'https://www.spuelboy.de',
  claim: 'Save the Taste!',
};
