import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { AccountService } from './services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _accountService = inject(AccountService);
  private _platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const loggedInUserStr = localStorage.getItem('loggedInUser');
      console.log(loggedInUserStr);

      if (loggedInUserStr) {
        this._accountService.authorizeLoggedInUser();

        this._accountService.setCurrentUser(JSON.parse(loggedInUserStr))
      }
    }
  }
}
