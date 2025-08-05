import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurrencyComponent } from './create-currency.component';

describe('CreateCurrencyComponent', () => {
  let component: CreateCurrencyComponent;
  let fixture: ComponentFixture<CreateCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
