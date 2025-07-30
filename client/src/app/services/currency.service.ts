import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyRes } from '../models/currency.model';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _http = inject(HttpClient);
  
  private readonly _baseApiUrl = environment.apiUrl + 'api/currency';

  getAll(): Observable<CurrencyRes[]> {
    return this._http.get<CurrencyRes[]>(this._baseApiUrl);
  }
}
