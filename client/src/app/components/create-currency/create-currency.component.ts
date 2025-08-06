import { Component, EventEmitter, Inject, inject, Output } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyReq } from '../../models/currency.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-currency',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './create-currency.component.html',
  styleUrl: './create-currency.component.scss'
})
export class CreateCurrencyComponent {
  @Output() created = new EventEmitter<void>();

  private _currencyService = inject(CurrencyService);
  private _fB = inject(FormBuilder);
  private _snackbar = inject(MatSnackBar);
  private _dialogRef = inject(MatDialogRef<CreateCurrencyComponent>);

  categoryOptions: string[] = ['Major', 'AltCoin', 'Defi', 'NFT', 'Meme'];
  statusOptions: string[] = ['Active', 'Paused', 'Delisted'];

  currencyFg = this._fB.group({
    symbolCtrl: ['', [Validators.required, Validators.maxLength(50)]],
    fullNameCtrl: ['', [Validators.required, Validators.maxLength(50)]],
    currencyPriceCtrl: [0, [Validators.required]],
    marketCapCtrl: [0, [Validators.required]],
    categoryCtrl: ['', [Validators.required, Validators.maxLength(50)]],
    statusCtrl: ['', [Validators.required, Validators.maxLength(50)]]
  })

  get SymbolCtrl(): FormControl {
    return this.currencyFg.get('symbolCtrl') as FormControl;
  }

  get FullNameCtrl(): FormControl {
    return this.currencyFg.get('fullNameCtrl') as FormControl;
  }

  get CurrencyPriceCtrl(): FormControl {
    return this.currencyFg.get('currencyPriceCtrl') as FormControl;
  }

  get MarketCapCtrl(): FormControl {
    return this.currencyFg.get('marketCapCtrl') as FormControl;
  }

  get CategoryCtrl(): FormControl {
    return this.currencyFg.get('categoryCtrl') as FormControl;
  }

  get StatusCtrl(): FormControl {
    return this.currencyFg.get('statusCtrl') as FormControl;
  }

  createCurrency(): void {
    let curencyInput: CurrencyReq = {
      symbol: this.SymbolCtrl.value,
      fullName: this.FullNameCtrl.value,
      currencyPrice: this.CurrencyPriceCtrl.value,
      marketCap: this.MarketCapCtrl.value,
      category: this.CategoryCtrl.value,
      status: this.StatusCtrl.value,
    }

    this._currencyService.addCurrency(curencyInput).subscribe({
      next: () => {
        this._snackbar.open('You add currency successfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 7000
        });

        this._dialogRef.close('created');
      }
    })
  }
}
