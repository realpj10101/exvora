import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ExchangeCurrencyReq, ExchangeCurrencyRes } from '../models/exchange-currency.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';
import { PaginationHandler } from '../extensions/paginationHandler';
import { ExchangeParams } from '../models/helpers/exchange-params.model';
import { PaginatedResult } from '../models/helpers/pagination-result.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeCurrencyService {
  private _http = inject(HttpClient);

  private readonly _baseApiUrl = environment.apiUrl + 'api/exchangecurrency/';
  private readonly _paginationHandler = new PaginationHandler();

  AddExchangeCurrency(request: ExchangeCurrencyReq, exchangeName: string): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(this._baseApiUrl + 'add-currency/' + exchangeName, request);
  }

  getAll(exchangeParams: ExchangeParams, exchangeName: string): Observable<PaginatedResult<ExchangeCurrencyRes[]>> {
    const params = this.getHttpParams(exchangeParams);

    return this._paginationHandler.getPaginatedResult<ExchangeCurrencyRes[]>(this._baseApiUrl + 'get-currency/' + exchangeName, params);
  }

  private getHttpParams(exchangeParams: ExchangeParams): HttpParams {
    let params = new HttpParams();

    if (exchangeParams) {
      if (exchangeParams.search)
        params = params.append('search', exchangeParams.search);
      
      params = params.append('pageSize', exchangeParams.pageSize);
      params = params.append('pageNumber', exchangeParams.pageNumber);
    }
    
    return params;
  }
}
