import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateExchange, ExchangeRes, UpadateExchange } from '../models/exchange.model';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { ExchangeParams } from '../models/helpers/exchange-params.model';
import { PaginatedResult } from '../models/helpers/pagination-result.model';
import { PaginationHandler } from '../extensions/paginationHandler';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private _http = inject(HttpClient);

  private readonly _baseApiUrl = environment.apiUrl + 'api/exchange/';
  private _paginationHandler = new PaginationHandler();

  createExchange(request: CreateExchange): Observable<ExchangeRes> {
    return this._http.post<ExchangeRes>(this._baseApiUrl + 'create-exchange', request);
  }

  getAll(exchangeParams: ExchangeParams): Observable<PaginatedResult<ExchangeRes[]>> {
    const params = this.getHttpParams(exchangeParams);

    return this._paginationHandler.getPaginatedResult<ExchangeRes[]>(this._baseApiUrl, params);
  }

  getAllUserExchanges(exchangeParams: ExchangeParams): Observable<PaginatedResult<ExchangeRes[]>> {
    const params = this.getHttpParams(exchangeParams);

    return this._paginationHandler.getPaginatedResult<ExchangeRes[]>(this._baseApiUrl + 'get-user-exchanges', params);
  }

  getByExchageName(exchangeName: string): Observable<ExchangeRes> {
    return this._http.get<ExchangeRes>(this._baseApiUrl + 'get-by-exchange-name' + exchangeName);
  }

  approveExchange(exchangeName: string): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(this._baseApiUrl + 'approve-exchange' + exchangeName, null);
  }

  rejectExchange(exchangeName: string): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(this._baseApiUrl + 'reject-exchange' + exchangeName, null);
  }

  updateExchange(req: UpadateExchange, exchangeName: string): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(this._baseApiUrl + 'update-exchange' + exchangeName, req);
  }

  private getHttpParams(exchangeParams: ExchangeParams): HttpParams {
    let params = new HttpParams();

    if (exchangeParams) {
      if (exchangeParams.search)
        params = params.append('seatch', exchangeParams.search);

      params = params.append('pageSize', exchangeParams.pageNumber);
      params = params.append('pageNumber', exchangeParams.pageNumber);
      params = params.append('orderBy', exchangeParams.orderBy);
    }

  return params;
  }
}
