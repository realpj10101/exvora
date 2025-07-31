import { Component, EventEmitter, Inject, inject, Output } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { log } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExchangeRes } from '../../models/exchange.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exchange-details',
  imports: [
    CommonModule, MatButtonModule
  ],
  templateUrl: './exchange-details.component.html',
  styleUrl: './exchange-details.component.scss'
})
export class ExchangeDetailsComponent {
  @Output() created = new EventEmitter<void>();

  private _exchService = inject(ExchangeService);
  private _snack = inject(MatSnackBar);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExchangeRes,
    private dialogRef: MatDialogRef<ExchangeDetailsComponent>
  ) { }

  approveExchange(): void {
    const exchangeName = this.data.exchangeName;

    this._exchService.approveExchange(exchangeName).subscribe({
      next: (res) => {
        this._snack.open(res.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 7000
        });

        this.dialogRef.close('created');
      }
    })
  }

  rejectExchange(): void {
    const exchangeName = this.data.exchangeName;

    this._exchService.rejectExchange(exchangeName).subscribe({
      next: (res) => {
        this._snack.open(res.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 7000
        });

        this.dialogRef.close('created');
      }
    })
  }
}
