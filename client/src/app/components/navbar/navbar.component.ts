import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../services/account.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule, RouterModule, CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  accountService = inject(AccountService);


  logout(): void {
    this.accountService.logout();
  }
}
