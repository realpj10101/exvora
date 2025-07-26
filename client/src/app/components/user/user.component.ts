import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { ExchangeRes } from '../../models/exchange.model';
import { Pagination } from '../../models/helpers/pagination.model';
import { ExchangeParams } from '../../models/helpers/exchange-params.model';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaginatedResult } from '../../models/helpers/pagination-result.model';
import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [
    MatPaginatorModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _exchangeService = inject(ExchangeService);
  private _fB = inject(FormBuilder);
  private _platformId = inject(PLATFORM_ID);

  exchanges: ExchangeRes[] | undefined;
  pagination: Pagination | undefined;
  exchangeParams: ExchangeParams | undefined;
  pageSizeOptions = [5, 10, 25];
  pageEvent: PageEvent | undefined;
  subscribed: Subscription | undefined;

  filterFg = this._fB.group({
    searchCtrl: ['']
  })

  get SearchCtrl(): FormControl {
    return this.filterFg.get('searchCtrl') as FormControl;
  }

  ngOnInit(): void {
    this.exchangeParams = new ExchangeParams();

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

  getAll(): void {
    if (this.exchangeParams)
      this.subscribed = this._exchangeService.getAll(this.exchangeParams).subscribe({
        next: (res: PaginatedResult<ExchangeRes[]>) => {
          if (res.body && res.pagination) {
            this.exchanges = res.body;
            this.pagination = res.pagination;
          }
        }
      })
  }

  handlePageEvent(e: PageEvent) {
    if (this.exchangeParams) {
      if (e.pageSize !== this.exchangeParams.pageSize)
        e.pageIndex = 0;

      this.pageEvent = e;
      this.exchangeParams.pageSize = e.pageSize;
      this.exchangeParams.pageNumber = e.pageIndex + 1;

      this.getAll();
    }
  }
}
