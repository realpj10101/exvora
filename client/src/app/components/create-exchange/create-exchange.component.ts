  import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
  import { ExchangeService } from '../../services/exchange.service';
  import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { CreateExchange, ExchangeRes } from '../../models/exchange.model';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatSelectModule } from '@angular/material/select';
  import { ExchangeParams } from '../../models/helpers/exchange-params.model';

  @Component({
    selector: 'app-create-exchange',
    imports: [
      MatFormFieldModule, MatInputModule, MatButtonModule,
      ReactiveFormsModule, FormsModule, MatSelectModule
    ],
    templateUrl: './create-exchange.component.html',
    styleUrl: './create-exchange.component.scss'
  })
  export class CreateExchangeComponent {
    @Input() isOpen = true;
    @Output() toggle = new EventEmitter<void>();
    @Output() created = new EventEmitter<void>();
    private _exchangeService = inject(ExchangeService);
    private _fB = inject(FormBuilder);
    private _snackBar = inject(MatSnackBar);

    typeOptions: string[] = ['SpotTrading', 'FuturesTrading', 'OptionsTrading'];
    typeOptionView: string[] = ['Spot Trading', 'Futures Trading', 'Options Trading'];
    exchangeParams: ExchangeParams | undefined;

    exchangeFg = this._fB.group({
      nameCtrl: ['', [Validators.required, Validators.maxLength(50)]],
      typeCtrl: ['', [Validators.required]],
      descriptionCtrl: ['', [Validators.required, Validators.maxLength(500)]]
    })

    get NameCtrl(): FormControl {
      return this.exchangeFg.get('nameCtrl') as FormControl;
    }

    get TypeCtrl(): FormControl {
      return this.exchangeFg.get('typeCtrl') as FormControl;
    }

    get DescriptionCtrl(): FormControl {
      return this.exchangeFg.get('descriptionCtrl') as FormControl;
    }


    createExchange(): void {
      let exInput: CreateExchange = {
        name: this.NameCtrl.value,
        type: this.TypeCtrl.value,
        description: this.DescriptionCtrl.value
      }

      this._exchangeService.createExchange(exInput).subscribe({
        next: () => {
          this._snackBar.open(`You create ${exInput.name} successfully`, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 7000
          });

          this.created.emit();
        }
      })
    }
  }
