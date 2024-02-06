import { DynamicFieldType } from "./dynamicField.interface";

export interface DocumentType {
  orden: number;
  nombre: string;
  alternativo: string;
  tiposDocumentos: Array<string>;
  observaciones?: Array<{
    comentario: string;
    fecha: string;
    usuario: string;
  }>;
  habilitado: boolean;
}

export interface ModalidadType {
  _id: string;
  clave: string;
  nombre: string;
  objetivoEspecifico: string;
  cedula: boolean;
  etapaVIM: number;
  tipo: "VIM" | "PEU";
  habilitado: boolean;
  status?: "Enabled" | "Disabled";
  metas: Array<any>;
  tipoApoyo: Array<any>;
  elegibilidad: {
    sustentoLegal: any;
    criterios: Array<ElegibilidadType>;
  };
  etiquetas: Array<string>;
  pasos: Array<{ orden: number; descripcion: string }>;
  anexos: Array<DocumentType>;
  ur: any;
  slas: any;
  raci: any;
  estatusInicial?: {
    codigo: number;
    descripcion: string;
  };
}

export interface ElegibilidadType {
  orden: number;
  requisito: string;
  condiciones: Array<{
    inciso: string;
    descripcion: string;
    caracteristicas: Array<any> | null;
  }>;
}

export interface ApoyoType {
  _id: string;
  clave: string;
  nombre: string;
  vigencia:
    | { startDate: string | null; endDate: string | null }
    | string
    | null;
  flujoSeguimiento: SeguimientoType;
  tipo: "VIM" | "PEU";
  isMultiple: boolean;
}

export interface SeguimientoType {
  codigo: number;
  descripcion: string;
  flujo: Array<{ codigo: number; descripcion: string }>;
}

export interface ProgramType {
  _id: string;
  documentos: Array<any>; // details
  dependencia: {
    clave?: string; // only on details
    nombre: string;
    siglas: string;
    eje?: {
      // only on details
      descripcion: string;
      codigo: string;
    };
  };
  modalidades: Array<ModalidadType>;
  modalidad?: ModalidadType;
  programa: {
    _id: string;
    clave: string;
    nombre: string;
    habilitado: boolean;
    escogeFecha?: boolean;
  };
  apoyo: {
    _id: string;
    clave: string;
    nombre: string;
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null;
    flujoSeguimiento: SeguimientoType;
    tipo: "VIM" | "PEU";
    datosAdicionales?: Array<{ titulo: string; campos: DynamicFieldType[] }>;
  } | any; 
  aviso?:any;
}

export const NewProgram: ProgramType = {
 _id: '',
 documentos: [], // details
 dependencia: {
   clave: '', // only on details
   nombre: '',
   siglas: '',
   eje: {
     // only on details
     descripcion: '',
     codigo: '0'
   },
 },
 modalidades: [],
 programa: { 
   _id: '',
   clave: '',
   nombre: '',
   habilitado: false,
 },
 apoyo: {
   _id: '',
   clave: '',
   nombre: '',
   vigencia:null,
   flujoSeguimiento: {
    codigo: 0,
    descripcion: '',
    flujo: []
   },
   tipo: "VIM"
 }
}
