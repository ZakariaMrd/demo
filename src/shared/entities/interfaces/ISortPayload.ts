import { SortDirection } from "../enums/sort-direction.enum";

export interface ISortPayload {
    primaryKey: string;
    sortDirection: SortDirection;
}