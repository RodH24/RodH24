export type UserRole = {
  uid: string,
  arrId: string,
  dependencias?: Array<string>,
  clavesQ?: Array<string>,
  modalidades?: Array<string>,
  regiones?: Array<string>,
  apoyos?: Array<string>,
  isDeleted: boolean,
  isEnabled: boolean,
  isPending: boolean,
  vigencia:{inicio:string,fin:string }
}
export type User = {
  _id: string;
  email: string;
  fullName: string;
  status?:string;
  roles: Array<UserRole>;
  oficina: string;
  ventanilla: string;
  urlImage: string;
  dependencia: {
    _id: string;
    siglas: string,
    nombre: string;
  }
}

export interface UserToCreate {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  oficina: string;
  ventanilla?: string;
  urlImage?: string;
  dependencia?: string;
  progama?: string;
  clavesQ?: Array<string>;
  dependenciaSiglas?: string;
}

export const newUser: User = {
  _id: '',
  email: '',
  fullName: '',
  roles: [],
  oficina: '',
  ventanilla:'',
  urlImage: '',
  dependencia: {
    _id: '',
    siglas: '',
    nombre: '',
  }
}

