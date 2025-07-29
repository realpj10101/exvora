import { CurrencyRes } from "./currency.model";
import { ExchangeRes } from "./exchange.model";

export interface ExchangeCurrencyReq {
    symbol: string;
}

export interface ExchangeCurrencyRes {
    exchangeRes: ExchangeRes;
    currencyRes: CurrencyRes;
}

