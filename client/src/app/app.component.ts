import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { AccountService } from './services/account.service';
import { isPlatformBrowser } from '@angular/common';
import { LoggedInUser } from './models/logged-in-user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _accountService = inject(AccountService);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const loggedInUserStr = localStorage.getItem('loggedInUser');
      console.log(loggedInUserStr);

      if (loggedInUserStr) {
        this._accountService.authorizeLoggedInUser();

        const loggedInUser: LoggedInUser = JSON.parse(loggedInUserStr);

        this._accountService.setCurrentUser(loggedInUser)

      }
    }
  }
}
