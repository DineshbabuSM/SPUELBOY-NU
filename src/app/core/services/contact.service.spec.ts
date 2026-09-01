import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { ContactService, NuContactRequest } from './contact.service';

const request: NuContactRequest = {
  name: 'Sam Wirt',
  company: 'Zum Anker',
  email: 'sam@example.com',
  phone: '',
  interest: 'nu-portable',
  message: 'Please send a quote for two portable devices.',
};

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('accepts the enquiry locally while no endpoint is configured', async () => {
    const service = TestBed.inject(ContactService);
    const http = TestBed.inject(HttpTestingController);

    const result = await firstValueFrom(service.submit(request));

    // Nothing is posted anywhere, and the result says so rather than claiming
    // the message reached the sales team.
    http.expectNone(() => true);
    expect(result.delivered).toBe(false);
    expect(result.reference).toMatch(/^NU-\d{6}-[A-Z0-9]{4}$/);
  });
});
