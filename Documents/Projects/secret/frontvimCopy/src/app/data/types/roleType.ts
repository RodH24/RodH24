export interface roleType {
    id: string;
    name: string;
    key: string;
    mainRoute: string;
    dependencia:any;
    regiones:any;
    modalidades:any;
    clavesQ:any;
    apoyos:any;
    active:boolean;
    [x: string | number | symbol]: unknown;
}