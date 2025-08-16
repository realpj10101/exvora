export interface CurrencyReq {
    symbol: string;
    fullName: string;
    category: string;
    status: string;
    feedProvider?: string | null; // coingecko | null
    feedId?: string | null; // bitcoin | eth or ...
    quote?: string | null; //"usd" | "eur" or ...
}

export interface CurrencyRes {
    symbol: string;
    fullName: string;
    price: number;
    marketCap: number;
    category: string;
    status: string;
    feedProvider?: string | null;
    feedId: string | null;
    quote: string;
    updatedAtUtc: string | null;
}