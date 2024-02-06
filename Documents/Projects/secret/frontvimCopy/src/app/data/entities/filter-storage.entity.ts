import { LocalStorage } from "../constants/cookies";

export class FilterStorageEntity {
  constructor() { 
    this.apoyoSelect = this.apoyoSelect;
  }

  get apoyoSelect() {
    const apoyo = localStorage.getItem(LocalStorage.FILTERS_APOYO);
    return apoyo && apoyo != null && apoyo !== '' ? apoyo : '-';
  }

  set apoyoSelect(value: string) {
    localStorage.setItem(LocalStorage.FILTERS_APOYO, value);
  }

  public clearAll() {
    localStorage.removeItem(LocalStorage.FILTERS_APOYO);
    localStorage.clear();
  }
}
