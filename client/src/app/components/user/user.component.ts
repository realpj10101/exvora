import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { ExchangeRes } from '../../models/exchange.model';
import { Pagination } from '../../models/helpers/pagination.model';
import { ExchangeParams } from '../../models/helpers/exchange-params.model';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaginatedResult } from '../../models/helpers/pagination-result.model';
import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { ExchangeCardComponent } from "../cards/exchange-card/exchange-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateExchangeComponent } from "../create-exchange/create-exchange.component";

@Component({
  selector: 'app-user',
  imports: [
    MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    ExchangeCardComponent, MatIconModule, ReactiveFormsModule, FormsModule,
    CreateExchangeComponent
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
  pendingExchangesCount: number | undefined;
  isFormOpen = false;

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
          this.getAllUserExchanges();
        }
      }
    }
  }

  onExchangeCreated(): void {
    this.getAllUserExchanges();
  }

  toggleForm() {
    this.isFormOpen = !this.isFormOpen;
  }

  getPendingExchangesCount(): number | undefined {
    return this.exchanges?.filter(e => e.exchangeStatus === 'Pending').length;
  }

  getAllUserExchanges(): void {
    if (this.exchangeParams) {
      this.subscribed = this._exchangeService.getAllUserExchanges(this.exchangeParams).subscribe({
        next: (res: PaginatedResult<ExchangeRes[]>) => {
          if (res.body && res.pagination) {
            this.exchanges = res.body;
            this.pagination = res.pagination;
          }

          this.pendingExchangesCount = this.getPendingExchangesCount();
        }
      })
    }
  }

  handlePageEvent(e: PageEvent) {
    if (this.exchangeParams) {
      if (e.pageSize !== this.exchangeParams.pageSize)
        e.pageIndex = 0;

      this.pageEvent = e;
      this.exchangeParams.pageSize = e.pageSize;
      this.exchangeParams.pageNumber = e.pageIndex + 1;

      this.getAllUserExchanges();
    }
  }

  updateExchangeParams(): void {
    if (this.exchangeParams) {
      this.exchangeParams.search = this.SearchCtrl.value;
    }
  }
}
