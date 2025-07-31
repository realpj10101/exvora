import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { FormBuilder } from '@angular/forms';
import { ExchangeRes } from '../../models/exchange.model';
import { Pagination } from '../../models/helpers/pagination.model';
import { ExchangeParams } from '../../models/helpers/exchange-params.model';
import { PageEvent } from '@angular/material/paginator';
import { PaginatedResult } from '../../models/helpers/pagination-result.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExchangeDetailsComponent } from '../exchange-details/exchange-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-exchanges',
  imports: [
    MatButtonModule, MatIconModule, RouterModule, MatTableModule, CommonModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.scss'
})
export class ExchangesComponent implements OnInit {
  private _exchangeService = inject(ExchangeService);
  private _fb = inject(FormBuilder);
  private _platformId = inject(PLATFORM_ID);
  readonly dialog = inject(MatDialog);

  exchanes: ExchangeRes[] | undefined;
  pagnation: Pagination | undefined;
  exchangeParams: ExchangeParams | undefined;
  pageSizeOption = [5, 10, 25];
  pageEvent: PageEvent | undefined;
  dataSource = new MatTableDataSource<ExchangeRes>();
  displayedColumns: string[] = ['name', 'type', 'status', 'action'];

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(exchange: ExchangeRes) {
    const dialogRef = this.dialog.open(ExchangeDetailsComponent, {
      data: exchange
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.getAll();
      }
    });
  }

  getAll(): void {
    if (this.exchangeParams) {
      this._exchangeService.getAll(this.exchangeParams).subscribe({
        next: (res: PaginatedResult<ExchangeRes[]>) => {
          if (res.body && res.pagination) {
            this.exchanes = res.body;
            this.pagnation = res.pagination;

            this.dataSource = new MatTableDataSource(res.body);

            this.dataSource.filterPredicate = (data: ExchangeRes, filter: string) => {
              const filterText = filter.trim().toLowerCase();
              return (
                data.exchangeName.toLowerCase().includes(filterText) ||
                data.exchangeType.toLowerCase().includes(filterText) ||
                data.exchangeStatus.toLowerCase().includes(filterText)
              );
            };
          }
        },
      });
    }
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
