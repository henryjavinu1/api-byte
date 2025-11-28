// src/models/PaginationParams.ts
export type SortBy = "id" | "name";
export type SortOrder = "ASC" | "DESC";

export interface PaginationParams {
  page: number;
  limit: number;
  name?: string;
  sortBy?: SortBy;    
  sortOrder?: SortOrder;
}
