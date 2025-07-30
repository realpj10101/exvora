import { CurrencyRes } from "./currency.model";
import { ExchangeRes } from "./exchange.model";

export interface ExchangeCurrencyReq {
    symbol: string;
}

export interface ExchangeCurrencyRes {
    exchange: ExchangeRes;
    currencies: CurrencyRes[];
}