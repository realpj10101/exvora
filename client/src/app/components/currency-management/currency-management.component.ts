import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyRes } from '../../models/currency.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-currency-management',
  imports: [
    MatIconModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, CommonModule, RouterModule
  ],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.scss'
})
export class CurrencyManagementComponent implements OnInit {
  private _currencyService = inject(CurrencyService);
  private _platformId = inject(PLATFORM_ID);
  readonly dailog = inject(MatDialog);

  currrencies: CurrencyRes[] | undefined;
  dataSource = new MatTableDataSource<CurrencyRes>();
  displayColumns: string[] = ['symbol', 'fullName', 'price', 'category', 'status'];

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      const userStr = localStorage.getItem('loggedInUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          this.getAll();
        }
      }
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(): void {
    this._currencyService.getAll().subscribe({
      next: (res) => {
        this.currrencies = res;

        this.dataSource = new MatTableDataSource(res);

        this.dataSource.filterPredicate = (data: CurrencyRes, filter: string) => {
          const filterText = filter.trim().toLowerCase();
          return (
            data.symbol.toLowerCase().includes(filterText) ||
            data.fullName.toLowerCase().includes(filterText)
          );
        }
      }
    })
  }
}
