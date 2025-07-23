import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {
  private _el = inject(ElementRef);
  private _control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    const input = this._el.nativeElement;
    const rawValue = input.value.replace(/\D/g, '');

    let formatted = this.formatPhone(rawValue);
    input.value = formatted;

    // set value back to the FormControl
    if (this._control?.control) {
      this._control.control.setValue(rawValue);
    }
  }

  private formatPhone(value: string): string {
    if (!value) return '';

    // Iran mobile (starts with 98 or 0) → +98 912 123 4567 or 0912 123 4567
    if (value.startsWith('98')) {
      return `+98 ${value.substring(2, 5)} ${value.substring(5, 8)} ${value.substring(8, 12)}`.trim();
    }

    if (value.startsWith('0') && value.length >= 11) {
      return `${value.substring(0, 4)} ${value.substring(4, 7)} ${value.substring(7, 11)}`.trim();
    }

    // US format → +1 (123) 456-7890 or 123-456-7890
    if (value.startsWith('1') && value.length >= 11) {
      return `+1 (${value.substring(1, 4)}) ${value.substring(4, 7)}-${value.substring(7, 11)}`.trim();
    }

    if (value.length === 10) {
      return `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
    }

    return value;
  }
}
