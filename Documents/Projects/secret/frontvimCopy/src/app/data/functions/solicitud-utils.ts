import * as moment from "moment";
import { ProgramType } from "../types";
import { diff } from "deep-diff";
import { merge } from "rxjs-compat/operator/merge";
var _ = require("lodash");

export function meetsAgeCondition(
  birthDate: string,
  rules: Array<{
    orden: number;
    requisito: string;
    condiciones: Array<any>;
  }>
): boolean {
  let rule = rules.filter(
    (element) => element.requisito === "Ser mayor de edad"
  )[0];
  if (rule) {
    return isAdult(birthDate);
  }

  rule = rules.filter(
    (element) => element.requisito === "Ser menor de edad"
  )[0];
  if (rule) {
    return !isAdult(birthDate);
  }

  return true;
}

export function meetsGenderCondition(
  gender: string,
  rules: Array<{
    orden: number;
    requisito: string;
    condiciones: Array<any>;
  }>
): boolean {
  const rule = rules.filter((element) => element.requisito === "Ser mujer")[0];
  /** CONDICION CON CURP DATA: HOMBRE O MUJER */
  if (gender.toLocaleLowerCase() === "hombre") {
    gender = "masculino";
  } else if (gender.toLocaleLowerCase() === "mujer") {
    gender = "femenino";
  }

  if (rule) {
    return gender === "femenino";
  } else {
    return true;
  }
}

export function isAdult(birthDate: string): boolean {
  return getAge(birthDate) >= 18;
}

export function getAge(birthDate: string): number {
  const newDate = moment(birthDate, "DD/MM/YYYY");
  return moment().diff(newDate, "years", true);
}

export function getCleanProgram(program: ProgramType) {
  return {
    dependencia: {
      sociedad: "",
      codigo: program.dependencia?.clave,
      nombre: program.dependencia?.nombre,
      siglas: program.dependencia?.siglas,
      eje: program.dependencia?.eje,
    },
    programa: {
      q: program.programa.clave,
      nombre: program.programa.nombre,
      modalidad: {
        nombre: program.modalidad?.nombre,
        clave: program.modalidad?.clave,
      },
      tipoApoyo: {
        clave: program.apoyo?.clave ? program.apoyo?.clave : "",
        nombre: program.apoyo?.nombre ? program.apoyo?.nombre : "",
      },
      estatusInicial: {
        codigo: program.modalidad?.estatusInicial?.codigo,
        descripcion: program.modalidad?.estatusInicial?.descripcion,
      },
      vigencia: program.apoyo.vigencia,
    },
  };
}

export function getCleanCedula(cedulaData: any) {
  if (!cedulaData) {
    cedulaData = {
      cedulaImpulso: false,
    };
  }
  return cedulaData;
}

export function getCleanDocument(document: any) {
  return {
    fileList: document.fileList,
    habilitado: document.habilitado,
    nombre: document.nombre,
    uid: document.uid,
    vigencia: document.vigencia,
  };
}

export function previousStep(step: number = -1): any {
  return {
    isNext: false,
    step_action: step,
    data: {
      name: "",
      value: {},
    },
  };
}

export function nexStep(stepName: string, value: any, step: number = 1): any {
  return {
    isNext: true,
    step_action: step,
    data: {
      name: stepName,
      value: value,
    },
  };
}

export function getDifferences(original: any, edited: any): any {
  const differences = diff(original, edited);
  const diffArray = [];
  let merged2: any = {};
  
  if (!differences) return {};

  differences.forEach((element: any) => {
    if (element.kind !== "D" && !element.path.includes("detalleSolicitud")) {
      const obj = subMap(element.path, element.rhs);
      diffArray.push(obj);
      merged2 = _.merge(merged2, obj);
    }
  });

  if (merged2?.datosContacto?.poblacionVulnerable) {
    const formatedPoblacion: any = {};
    for (let key in merged2.datosContacto.poblacionVulnerable) {
      formatedPoblacion[key] =
        edited.datosContacto.poblacionVulnerable[parseInt(key)];
    }
    merged2.datosContacto.poblacionVulnerable = formatedPoblacion;
  }

  if (
    original.datosContacto.telefonos &&
    original.datosContacto.telefonos != null
  ) {
    merged2.datosContacto.telefonos = edited.datosContacto.telefonos;
  }
  if (
    original.datosContacto.correos &&
    original.datosContacto.correos != null
  ) {
    merged2.datosContacto.correos = edited.datosContacto.correos;
  }
  if (original.datosCurp.curp) {
    merged2.datosCurp.curp = original.datosCurp.curp;
  }
  if (original.datosCurp.folioImpulso) {
    merged2.datosCurp.folioImpulso = original.datosCurp.folioImpulso;
  }
  if (edited.tutor.respuesta) {
    merged2.tutor = edited.tutor;
  }
  if (
    edited.datosAdicionales != null &&
    edited.datosAdicionales.Redes_sociales != null
  ) {
    const datosAdicionales = merged2.datosAdicionales ?? {};
    merged2 = {
      ...merged2,
      datosAdicionales: {
        ...datosAdicionales,
        Redes_sociales: edited.datosAdicionales.Redes_sociales,
      },
    };
    // merged2.datosAdicionales.Redes_sociales = edited.datosAdicionales.Redes_sociales
  }
  return merged2;
}

function subMap(pathArray: Array<any>, value: any = {}) {
  const originalPathArray = pathArray.slice();
  if (!pathArray.length) {
    return value;
  }
  const obj: any = {}; // Acumulador
  pathArray.shift();
  const submap = subMap(pathArray, value);
  obj[originalPathArray[0]] = submap;
  return obj;
}
