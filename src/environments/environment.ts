/**
 * Runtime configuration for the storefront.
 *
 * `contactEndpoint` is intentionally empty: no backend is wired up yet. Point it
 * at the platform API (for example `https://api.example.com/contact-requests`)
 * and the contact form posts there instead of resolving locally.
 */
export const environment = {
  production: false,
  contactEndpoint: '',
};
