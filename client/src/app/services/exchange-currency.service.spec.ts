import { TestBed } from '@angular/core/testing';

import { ExchangeCurrencyService } from './exchange-currency.service';

describe('ExchangeCurrencyService', () => {
  let service: ExchangeCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
