export interface CreateExchange {
    name: string;
    type: string;
    description: string;
}

export interface ExchangeRes {
    exchangeName: string;
    description: string;
    exchangeType: string;
    exchangeStatus: string;
    createdAt: Date;
}

export interface UpadateExchange {
    name: string;
    description: string;
    type: string;
}