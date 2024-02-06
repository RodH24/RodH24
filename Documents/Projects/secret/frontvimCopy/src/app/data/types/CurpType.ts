export interface CurpType {
  curp: string;
  entidadNacimiento: string;
  fechaNacimientoDate: string;
  fechaNacimientoTexto: string;
  genero: string;
  nacionalidad: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  anioRegistro: string;
  descripcion?: string;
  comentarioSolicitud?: string;
  costoAproximado?: number;
  fechaCaptura?: string;
}

export const NewCurp: CurpType = {
  curp: '',
  entidadNacimiento: '',
  fechaNacimientoDate: '',
  fechaNacimientoTexto: '',
  genero: '',
  nacionalidad: '',
  nombre: '',
  primerApellido: '',
  segundoApellido: '',
  anioRegistro: '',
  descripcion: '',
  comentarioSolicitud: '',
  costoAproximado: 0,
  fechaCaptura: ''
};
