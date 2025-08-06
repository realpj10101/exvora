import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ExchangeCurrencyService } from '../../services/exchange-currency.service';
import { ExchangeCurrencyRes } from '../../models/exchange-currency.model';
import { Pagination } from '../../models/helpers/pagination.model';
import { ExchangeParams } from '../../models/helpers/exchange-params.model';
import { PaginatedResult } from '../../models/helpers/pagination-result.model';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyRes } from '../../models/currency.model';
import { MatDialog } from '@angular/material/dialog';
import { AddCurrencyComponent } from '../_modals/add-currency/add-currency.component';
import { ExchangeRes } from '../../models/exchange.model';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-currency',
  imports: [
    MatPaginatorModule, MatIconModule, MatButtonModule,
    CommonModule, MatTableModule, MatFormFieldModule, MatInputModule,
    RouterModule
  ],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent implements OnInit {
  private _exchangeCurrencyService = inject(ExchangeCurrencyService);
  private _exchangeService = inject(ExchangeService);
  private _route = inject(ActivatedRoute);
  private _platformId = inject(PLATFORM_ID);
  readonly dialog = inject(MatDialog);

  exchangeCurrencies: ExchangeCurrencyRes[] | undefined;
  pagination: Pagination | undefined;
  exchangeParams: ExchangeParams | undefined;
  pageSizeOption: Pagination | undefined;
  pageEvent: PageEvent | undefined;
  dataSource = new MatTableDataSource<{ currency: CurrencyRes }>();
  displayedColumns: string[] = ['position', 'symbol', 'fullName', 'price', 'category', 'status'];
  exchanges: ExchangeRes[] | undefined;
  pageSizeOptions = [3, 9, 12];
  exchangesPagination: Pagination | undefined;
  exchange: ExchangeRes | undefined;

  ngOnInit(): void {
    this.exchangeParams = new ExchangeParams();

    this.exchangeParams = {
      pageNumber: 1,
      pageSize: 3,
      search: '',
      orderBy: ''
      // ...other filters if needed
    };

    if (isPlatformBrowser(this._platformId)) {
      const userStr = localStorage.getItem('loggedInUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          this.getAllExchangeCurrencies();
          this.getAllUserExchanges();
          this.getByExchangeName();
        }
      }
    }
  }

  openDialog(exchangeName: string) {
    const dialogRef = this.dialog.open(AddCurrencyComponent, {
      data: { exchangeName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.getAllExchangeCurrencies();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllExchangeCurrencies(): void {
    const exchangeName: string | null = this._route.snapshot.paramMap.get('exchangeName');

    if (this.exchangeParams) {
      if (exchangeName)
        this._exchangeCurrencyService.getAll(this.exchangeParams, exchangeName).subscribe({
          next: (res: PaginatedResult<ExchangeCurrencyRes[]>) => {
            if (res.body && res.pagination) {
              this.exchangeCurrencies = res.body;
              this.pagination = res.pagination;

              const flattened = res.body.flatMap(item =>
                item.currencies.map(currency => ({ currency }))
              );

              console.log(this.exchange);

              this.dataSource = new MatTableDataSource(flattened);

              this.dataSource.filterPredicate = (data: { currency: CurrencyRes }, filter: string) => {
                const filterText = filter.trim().toLowerCase();
                return (
                  data.currency.symbol.toLowerCase().includes(filterText) ||
                  data.currency.fullName.toLowerCase().includes(filterText) ||
                  data.currency.category.toLowerCase().includes(filterText) ||
                  data.currency.status.toLowerCase().includes(filterText)
                );
              };
            }
          }
        })
    }
  }

  getAllUserExchanges(): void {
    if (this.exchangeParams) {
      this._exchangeService.getAllUserExchanges(this.exchangeParams).subscribe({
        next: (res: PaginatedResult<ExchangeRes[]>) => {
          if (res.body && res.pagination) {
            this.exchanges = res.body;
            this.exchangesPagination = res.pagination;
          }
        }
      })
    }
  }

  getByExchangeName(): void {
    const exchangeName: string | null = this._route.snapshot.paramMap.get('exchangeName');

    if (exchangeName)
      this._exchangeService.getByExchageName(exchangeName).subscribe({
        next: (res) => {
          this.exchange = res;
        }
      });
  }

  goToNextPage(): void {
    if (this.exchangeParams && this.exchangesPagination && this.exchangesPagination.currentPage < this.exchangesPagination.totalPages) {
      this.exchangeParams.pageNumber++;
      this.getAllUserExchanges();
    }
  }

  goToPreviousPage(): void {
    if (this.exchangeParams && this.exchangesPagination && this.exchangesPagination.currentPage > 1) {
      this.exchangeParams.pageNumber--;
      this.getAllUserExchanges();
    }
  }

  handlePageEvent(e: PageEvent) {
    if (this.exchangeParams) {
      if (e.pageSize !== this.exchangeParams.pageSize)
        e.pageIndex = 0;

      this.pageEvent = e;
      this.exchangeParams.pageSize = e.pageSize;
      this.exchangeParams.pageNumber = e.pageIndex + 1;

      this.getAllExchangeCurrencies();
    }
  }
}
