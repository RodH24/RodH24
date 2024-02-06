/**
 * @typedef {Object} PaginationType
 * @property {number} startIndex paginations start index
 * @property {number} pageSize pagination page size
 * @property {boolean} order [optional] if paginations has sort. true === ascendant, false === descendant
 * @property {number} totalEntries [optional] total entries to be paginated
 */
export interface PaginationType {
  startIndex: number;
  pageSize: number;
  order?: boolean;
  totalEntries?: number;
}
