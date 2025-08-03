import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyReq, CurrencyRes } from '../models/currency.model';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _http = inject(HttpClient);
  
  private readonly _baseApiUrl = environment.apiUrl + 'api/currency';

  addCurrency(request: CurrencyReq): Observable<CurrencyRes> {
    return this._http.post<CurrencyRes>(this._baseApiUrl + 'add-currency', request);
  }

  getAll(): Observable<CurrencyRes[]> {
    return this._http.get<CurrencyRes[]>(this._baseApiUrl);
  }
}
