export interface CurrencyReq {
    symbol: string;
    fullName: string;
    currenctPrice: number;
    marketCap: number;
    category: string;
    status: string;
}

export interface CurrencyRes {
    symbol: string;
    fullName: string;
    price: number;
    marketCap: number;
    category: string;
    status: string;
}