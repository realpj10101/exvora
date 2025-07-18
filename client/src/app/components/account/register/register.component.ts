import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _fb = inject(FormBuilder);

  step: number = 1;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  acceptTerms: boolean = false;
  acceptMarketing: boolean = false;
  passwordStrengthValue: number = 0;

  registerFg = this._fb.group({
    firstNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    emailCtrl: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    phoneNumberCtrl: ['', [Validators.required]],
    countryCtrl: ['', [Validators.required]],
    passwordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    confirmPasswordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
  });

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
    return this.registerFg.get('passwordCtrl') as FormControl;
  }

  get ConfirmPasswordCtrl(): FormControl {
    return this.registerFg.get('confirmPasswordCtrl') as FormControl;
  }

  nextStep() {
    if (this.registerFg.valid) 
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
    return strength;
  }
}
