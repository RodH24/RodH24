export interface Ventanilla {
  _id: string;
  clave: string;
  descripcion: string;
  dependencia: string;
  habilitado: boolean;
  contacto: {
    telefono: string;
  };
  horarios: Array<any>;
  domicilio: {
    entidadFederativa: string;
    municipio: string;
    localidad: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    colonia: string;
    codigoPostal: string;
    georeferencia: Array<number>;
    completo: string;
  };
}

export const newVentanilla = {
  _id: '',
  clave: '',
  descripcion: '',
  dependencia: '',
  habilitado: false,
  contacto: {
    telefono: '',
  },
  horarios: [],
  domicilio: {
    entidadFederativa: '',
    municipio: '',
    localidad: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    codigoPostal: '',
    georeferencia: [0, 0],
    completo: '',
  },
};

export function getCleanVentanilla(ventanilla: Ventanilla) {
  return {
    calle: ventanilla.domicilio.calle,
    codigoPostal: ventanilla.domicilio.codigoPostal,
    colonia: ventanilla.domicilio.colonia,
    completo: ventanilla.domicilio.completo,
    nombreMunicipio: ventanilla.domicilio.municipio,
    numeroExt: ventanilla.domicilio.numeroExterior,
    numeroInt: ventanilla.domicilio.numeroInterior,
  };
}
