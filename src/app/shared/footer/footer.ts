import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactService } from '../../core/services/contact.service';
import { NU_COMPANY, NU_PRODUCTS } from '../../core/data/nu-products.data';
import { NuConfigurationRequest } from '../../landing/product-showcase/product-showcase';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Footer with the contact / quote form.
 *
 * The whole storefront is one page, so this *is* the contact page: the header's
 * "Contact" link and every product CTA scroll here, and a CTA that came from a
 * product panel arrives with the visitor's 3D configuration prefilled.
 */
@Component({
  selector: 'app-footer',
  imports: [ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  /** Set when the visitor pressed "Configure & request quote" on a product. */
  readonly prefill = input<NuConfigurationRequest | null>(null);

  protected readonly company = NU_COMPANY;
  protected readonly products = NU_PRODUCTS;

  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);

  protected readonly state = signal<SubmitState>('idle');
  protected readonly reference = signal<string | null>(null);
  protected readonly delivered = signal(true);
  protected readonly year = new Date().getFullYear();

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    interest: ['nu-portable', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue],
  });

  constructor() {
    // A quote request from a product panel arrives with that device selected
    // and a message the visitor only has to add their details to.
    effect(() => {
      const request = this.prefill();
      if (!request) return;

      this.form.patchValue({
        interest: request.productId,
        message: `Please send me a quote for the ${request.productName}.`,
      });
      this.state.set('idle');
    });
  }

  protected invalid(control: keyof typeof this.form.controls): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.state.set('error');
      return;
    }

    const value = this.form.getRawValue();
    this.state.set('sending');

    this.contact
      .submit({
        name: value.name,
        company: value.company,
        email: value.email,
        phone: value.phone,
        interest: value.interest,
        message: value.message,
        product: this.prefill()?.productName,
      })
      .subscribe({
        next: (result) => {
          this.reference.set(result.reference);
          this.delivered.set(result.delivered);
          this.state.set('sent');
          this.form.reset({ interest: value.interest, consent: false });
        },
        error: () => this.state.set('error'),
      });
  }
}
