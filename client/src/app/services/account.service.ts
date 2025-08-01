import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInUser } from '../models/logged-in-user.model';
import { environment } from '../environments/environment.development';
import { Register } from '../models/register.model';
import { map, Observable, take } from 'rxjs';
import { Login } from '../models/login.model';
import { ApiResponse } from '../models/apiResponse.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  platformId = inject(PLATFORM_ID);
  loggedInUserSig = signal<LoggedInUser | null>(null);

  private readonly _baseApiUrl = environment.apiUrl + 'api/account/';

  register(userInput: Register): Observable<LoggedInUser | null> {
    return this._http.post<LoggedInUser>(this._baseApiUrl + 'register', userInput).pipe(
      map(res => {
        if (res) {
          this.setCurrentUser(res);

          this.navigateToReturnUrl();

          return res;
        }

        return null;
      })
    )
  }

  login(userInput: Login): Observable<LoggedInUser | null> {
    return this._http.post<LoggedInUser>(this._baseApiUrl + 'login', userInput).pipe(
      map(res => {
        if (res) {
          this.setCurrentUser(res);

          this.navigateToReturnUrl();

          return res;
        }

        return null;
      })
    )
  }

  externalLogin(provider: string, idToken: string): Observable<LoggedInUser | null> {
    const payload = { provider, idToken }
    return this._http.post<LoggedInUser>(this._baseApiUrl + 'external-login', payload).pipe(
      map(res => {
        if (res) {
          this.setCurrentUser(res);
          this.navigateToReturnUrl();
          return res;
        }

        return null;
      })
    )
  }

  authorizeLoggedInUser(): void {
    this._http.get<ApiResponse>(this._baseApiUrl).pipe(
      take(1)).subscribe({
        next: res => {
          if (res.message)
            console.log(res.message);
        },
        error: err => {
          console.log(err.error);
          this.logout()
        }
      })
  }

  setCurrentUser(loggedInUser: LoggedInUser): void {
    this.setLoggedInUserRoles(loggedInUser);

    this.loggedInUserSig.set(loggedInUser);

    if (isPlatformBrowser(this.platformId))
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

  setLoggedInUserRoles(loggedInUser: LoggedInUser): void {
    loggedInUser.roles = [];

    const roles: string | string[] = JSON.parse(atob(loggedInUser.token.split('.')[1])).role;

    Array.isArray(roles) ? loggedInUser.roles = roles : loggedInUser.roles.push(roles);
  }

  logout(): void {
    this.loggedInUserSig.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear(); // delete all browser's localStorage's items at once
    }

    this._router.navigateByUrl('/account/login');
  }

  private navigateToReturnUrl(): void {
    if (isPlatformBrowser(this.platformId)) {
      let loggedInUserStr: string | null = localStorage.getItem('loggedInUser');

      if (loggedInUserStr) {
        let loggedInUser: LoggedInUser = JSON.parse(loggedInUserStr);

        let roles: string[] = loggedInUser.roles;

        if (roles.includes('member')) {
          if (isPlatformBrowser(this.platformId)) {
            const returnUrl = localStorage.getItem('returnUrl');
            if (returnUrl)
              this._router.navigate([returnUrl]);
            else
              this._router.navigate(['user']);

            if (isPlatformBrowser(this.platformId)) // we make sure this code is ran on the browser and NOT server
              localStorage.removeItem('returnUrl');
          }
        }
        else {
          if (isPlatformBrowser(this.platformId)) {
            const returnUrl = localStorage.getItem('returnUrl');
            if (returnUrl)
              this._router.navigate([returnUrl]);
            else
              this._router.navigate(['admin']);

            if (isPlatformBrowser(this.platformId)) // we make sure this code is ran on the browser and NOT server
              localStorage.removeItem('returnUrl');
          }
        }
      }
    }
  }
}
