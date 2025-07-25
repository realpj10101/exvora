import {AfterViewInit, Component, inject} from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../models/login.model';
import { LoggedInUser } from '../../../models/logged-in-user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule, MatFormFieldModule,
    MatButtonModule, MatInputModule, MatDividerModule, RouterModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit{
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);

  showPassword: boolean = false;

  ngAfterViewInit(): void {
    google.accounts.id.initialize
  }

  loginFg = this._fb.group({
    emailCtrl: ['', [Validators.required, Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,5})+)$/), Validators.maxLength(50)]],
    passwordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  get EmailCtrl(): FormControl {
    return this.loginFg.get('emailCtrl') as FormControl;
  }

  get PasswordCtrl(): FormControl {
    return this.loginFg.get('passwordCtrl') as FormControl;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    console.log('ok');

    let loginPlayer: Login = {
      email: this.EmailCtrl.value,
      password: this.PasswordCtrl.value
    }

    this._accountService.login(loginPlayer).subscribe({
      next: (loggedInPlayer: LoggedInUser | null) => {
        console.log(loggedInPlayer);
      },
      // show wrong username or password error.
    })
  }
}
