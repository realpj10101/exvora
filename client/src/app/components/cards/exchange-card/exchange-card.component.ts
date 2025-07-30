import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRes } from '../../../models/exchange.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exchange-card',
  imports: [
    MatIconModule, CommonModule, RouterModule
  ],
  templateUrl: './exchange-card.component.html',
  styleUrl: './exchange-card.component.scss'
})
export class ExchangeCardComponent {
  @Input('exchangeInput') exchangeIn: ExchangeRes | undefined;
}
