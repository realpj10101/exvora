import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../../services/account.service';
import { Register } from '../../../models/register.model';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule,
    MatIconModule, MatSelectModule, MatInputModule,
     MatFormFieldModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);

  step: number = 1;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  acceptTerms: boolean = false;
  acceptMarketing: boolean = false;
  passwordStrengthValue: number = 0;
  passwrodsNotMatch: boolean | undefined;
  countryOptions: string[] = ['United States', 'Unites Kingdom', 'Canada', 'Australia', 'Germanay', 'France', 'Japan', 'Iran', 'Other']

  registerFg = this._fb.group({
    firstNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    emailCtrl: ['', [Validators.required, Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,5})+)$/), Validators.maxLength(50)]],
    phoneNumberCtrl: ['', [Validators.required,  Validators.pattern(/^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}$/)]],
    countryCtrl: ['United States', [Validators.required]],
  });

  securityFg = this._fb.group({
    passwordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    confirmPasswordCtrl: ['', [Validators.required]]
  })

  get FirstNameCtrl(): FormControl {
    return this.registerFg.get('firstNameCtrl') as FormControl;
  }

  get LastNameCtrl(): FormControl {
    return this.registerFg.get('lastNameCtrl') as FormControl;
  }

  get EmailCtrl(): FormControl {
    return this.registerFg.get('emailCtrl') as FormControl;
  }

  get PhoneNumberCtrl(): FormControl {
    return this.registerFg.get('phoneNumberCtrl') as FormControl;
  }

  get CountryCtrl(): FormControl {
    return this.registerFg.get('countryCtrl') as FormControl;
  }

  get PasswordCtrl(): FormControl {
    return this.securityFg.get('passwordCtrl') as FormControl;
  }

  get ConfirmPasswordCtrl(): FormControl {
    return this.securityFg.get('confirmPasswordCtrl') as FormControl;
  }

  get Password(): string {
    return this.PasswordCtrl.value || '';
  }

  get IsLongEnough(): boolean {
    return this.Password.length >= 8;
  }

  get HasUppercase(): boolean {
    return /[A-Z]/.test(this.Password);
  }

  get HasNumber(): boolean {
    return /[0-9]/.test(this.Password);
  }

  get HasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.Password);
  }

  nextStep() {
    if (this.registerFg.valid)
      console.log('ok');
    this.step = 2
  }

  prevStep() {
    this.step = 1
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (!this.acceptTerms || this.registerFg.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Account created!');
    }, 1500)
  }

  passwordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  }

  getStrengthColor(strength: number): string {
    switch (strength) {
      case 0:
      case 1:
        return 'weak';
      case 2:
      case 3:
        return 'medium';
      case 4:
        return 'strong';
      default:
        return 'none';
    }
  }

  getStrengthText(strength: number): string {
    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  register(): void {
    if (this.PasswordCtrl.value === this.ConfirmPasswordCtrl.value) {
      this.passwrodsNotMatch = false;

      let userInput: Register = {
        firstName: this.FirstNameCtrl.value,
        lastName: this.LastNameCtrl.value,
        email: this.EmailCtrl.value,
        phoneNumber: this.PhoneNumberCtrl.value,
        country: this.CountryCtrl.value,
        password: this.PasswordCtrl.value,
        confirmPassword: this.ConfirmPasswordCtrl.value
      }

      this._accountService.register(userInput).subscribe();
    }
    else {
      this.passwrodsNotMatch = true;
    }
  }
}
