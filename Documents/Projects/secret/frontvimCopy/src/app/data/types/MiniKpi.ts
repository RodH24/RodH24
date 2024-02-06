export interface MiniKpiClassType {
  count?: number;
  title?: string;
  class?: string;
  isActive?: boolean;
  type?: string;
  color?: string;
}

export interface SortedStepsType {
  codigo: number;
  descripcion: string;
  flujo?:Array<any>;
}