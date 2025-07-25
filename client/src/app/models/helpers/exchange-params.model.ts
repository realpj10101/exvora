import { PaginationParams } from "./paginationParams.model";

export class ExchangeParams extends PaginationParams {
    search: string | undefined;
    orderBy = 'lastAcive';
}