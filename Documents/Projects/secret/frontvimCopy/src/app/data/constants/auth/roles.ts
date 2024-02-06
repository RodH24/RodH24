/**
 * Constants to manage roles name and values
 */
export const Roles: { [key: string]: { id: string, dbName: string; showName: string } } = {
  admin: {
    id: "62bc9176fd4d47d345165417",
    dbName: 'ADMIN_ROL',
    showName: 'Administrador',
  },
  enlace: {
    id: '62bc9197fd4d47d345165418',
    dbName: 'ENLACE_ROL',
    showName: 'Enlace Dependencia',
  },
  responsableQ: {
    id: '62bc91b1fd4d47d345165419',
    dbName: 'RESPONSABLE_Q_ROL',
    showName: 'Responsable Q'
  },
  responsableGeneral: {
    id: '62bc91bffd4d47d34516541a',
    dbName: 'RESPONSABLE_GENERAL_Q_ROL',
    showName: 'Responsable General'
  },
  responsableCapturista: {
    id: '62bc91d0fd4d47d34516541b',
    dbName: 'RESPONSABLE_CAPTURISTAS_Q_ROL',
    showName: 'Responsable Capturista'
  },
  responsableBrigada: {
    id: '62bc91f3fd4d47d34516541c',
    dbName: 'RESPONSABLE_BRIGADA_Q_ROL',
    showName: 'Responsable Regional'
  },
  capturista: {
    id: '62bc9222fd4d47d34516541d',
    dbName: 'OPERADOR_ROL',
    showName: 'Capturista'
  },
  capturistaRegional: {
    id: '62bc9222fd4d47d34516541e',
    dbName: 'OPERADOR_REGIONAL_ROL',
    showName: 'Capturista Regional'
  },
};
