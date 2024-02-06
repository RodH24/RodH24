export interface DynamicFieldType {
  title: string;
  key: string;
  placeholder: string;
  isFormArray?: boolean;
  defaultValue: string | number | boolean | [];
  labels?: Array<string>;
  options?: Array<{ descripcion: string, codigo: string | number }>,
  maxOptionsSelected?: number,
  type: "Text" | "Number" | "Switch" | "Select" | "MultiSelect" | "MultiInput";
  validators: Array<{ type: "min" | "max" | "minLength" | "maxLength" | "pattern" | "required", value: string | number | null }>
}