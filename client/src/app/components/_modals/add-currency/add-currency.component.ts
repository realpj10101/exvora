import { Component, EventEmitter, inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExchangeCurrencyService } from '../../../services/exchange-currency.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExchangeCurrencyReq } from '../../../models/exchange-currency.model';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyService } from '../../../services/currency.service';
import { isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyRes } from '../../../models/currency.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-currency',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './add-currency.component.html',
  styleUrl: './add-currency.component.scss'
})
export class AddCurrencyComponent implements OnInit {
  @Output() created = new EventEmitter<void>();

  private _exchanCurrencyService = inject(ExchangeCurrencyService);
  private _currencyService = inject(CurrencyService);
  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _snack = inject(MatSnackBar);
  private _platformId = inject(PLATFORM_ID);

  curencies: CurrencyRes[] | undefined;

  curFg = this._fb.group({
    symbolCtrl: ['', [Validators.required]]
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { exchangeName: string },
    private dialogRef: MatDialogRef<AddCurrencyComponent>
  ) { }

  get SymbolCtrl(): FormControl {
    return this.curFg.get('symbolCtrl') as FormControl;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      const userStr = localStorage.getItem('loggedInUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          this.getAllCurrency();
        }
      }
    }
  }

  getAllCurrency(): void {
    this._currencyService.getAll().subscribe({
      next: (res) => {
        this.curencies = res;
        console.log(this.curencies);

      }
    });
  }

  addExCurrency(): void {
    let request: ExchangeCurrencyReq = {
      symbol: this.SymbolCtrl.value
    }

    const exchangeName = this.data.exchangeName;

    console.log(exchangeName);

    if (exchangeName)
      this._exchanCurrencyService.AddExchangeCurrency(request, exchangeName).subscribe({
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
