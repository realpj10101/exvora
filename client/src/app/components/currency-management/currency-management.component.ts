import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
import { CreateCurrencyComponent } from '../create-currency/create-currency.component';
import { PriceService } from '../../services/price.service';
import { Subscription } from 'rxjs';
import { IntlModule } from 'angular-ecmascript-intl';

@Component({
  selector: 'app-currency-management',
  imports: [
    MatIconModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, CommonModule, RouterModule, IntlModule
  ],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.scss'
})
export class CurrencyManagementComponent implements OnInit, OnDestroy {
  private _currencyService = inject(CurrencyService);
  private _platformId = inject(PLATFORM_ID);
  readonly dialog = inject(MatDialog);
  private _priceService = inject(PriceService);
  private _map: Record<string, CurrencyRes> = {};
  private _priceHub?: Subscription;

  currrencies: CurrencyRes[] | undefined;
  dataSource = new MatTableDataSource<CurrencyRes>();
  displayColumns: string[] = ['symbol', 'fullName', 'price', 'category', 'status', 'updatedAtUtc'];

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      const userStr = localStorage.getItem('loggedInUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          this.getAll();

          this.startRealTime();
        }
      }
    }
  }

  ngOnDestroy(): void {
      this._priceHub?.unsubscribe();

      this._priceService.stop();
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateCurrencyComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        console.log(result);
        this.getAll();
      } 
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(): void {
    this._currencyService.getAll().subscribe({
      next: (res) => {
        this.currrencies = res;

        this._map = {};

        for(const currency of res) this._map[this.key(currency)] = currency;

        this.refreshTable();

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

  private key(currency: CurrencyRes): string {
    return `${currency.symbol}:${currency.quote ?? 'usd'}`;
  }

  private refreshTable(): void {
    const rows = Object.values(this._map);

    rows.sort((a, b) => a.symbol.localeCompare(b.symbol));

    this.dataSource.data = rows;
  }

  private async startRealTime() {
    await this._priceService.start();

    this._priceHub = this._priceService.price$.subscribe(update => {
      this._map[this.key(update)] = update;
      this.refreshTable();
    })
  }
}
