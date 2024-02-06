export class PaginatorEntity {
  private _pageSize: number = 9; //El numero de elementos a mostrar
  private _pageIndex: number = 1; // Pagina en el paginator
  private _totalRecords: number = 9; // Total de record en la base de datos

  /**
   * @constructor
   * @param {number} pageSize El numero de elementos a mostrar
   * @param {number} pageIndex Pagina en el paginator
   * @param {number} totalRecords Total de record en la base de datos
   */
  constructor(
    pageSize: number = 9,
    pageIndex: number = 1,
    totalRecords: number = 9
  ) {
    this._pageSize = pageSize;
    this._pageIndex = pageIndex;
    this._totalRecords = totalRecords;
  }

  /** Get full paginator */
  get pagination() {
    return {
      pageSize: this._pageSize,
      pageIndex: this._pageIndex,
      totalRecords: this._totalRecords,
    };
  }

  get page(): { pageSize: number, pageIndex: number } {
    return {
      pageSize: this._pageSize,
      pageIndex: this._pageIndex - 1,  // Se toma como base el 0, por eso se resta uno
    }
  }

  /** Change page size */
  set pageSize(newPageSize: number) {
    this._pageSize = newPageSize;
  }

  /**
   * @param {boolean} isNext Es la proxima pagina
   * Change page size
   */
  set pageIndex(newIndex: number) {
    this._pageIndex = newIndex;
  }

  /**
   * @param {number} newTotal Nuevo totalRecords del paginador
   */
  set total(newTotal: number) {
    this._totalRecords = newTotal;
  }
}
