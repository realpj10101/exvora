import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment.development';
import { CurrencyRes } from '../models/currency.model';
import { fromEventPattern, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private hub = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}hubs/prices`)
    .withAutomaticReconnect()
    .build();

  price$: Observable<CurrencyRes> = fromEventPattern(
    (h) => this.hub.on('price', h as any),
    (h) => this.hub.off('price', h as any)
  );

  async start() {
    if (this.hub.state === signalR.HubConnectionState.Disconnected) {
      await this.hub.start();
    }
  }

  async stop() { await this.hub.stop(); }
}
