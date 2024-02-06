import { DynamicFieldType } from '@app/data/types';
import * as moment from 'moment';

const TemplateStepList = [
  {
    // 0
    template: 'curpInput',
    title: 'Elige el método para ingresar la solicitud',
    stepName: '',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 1
    template: 'validateCurpData',
    title: 'Validación de Datos',
    stepName: 'datosCurp',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 2
    template: 'tutorData',
    title: 'Datos de padre, madre o tutor(a)',
    stepName: 'tutor',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 3
    template: 'curpSecondData',
    title: 'Datos Generales Complementarios',
    stepName: 'datosComplementarios',
    years: [2022]
  },
  {
    // 4
    template: 'contactData',
    title: '',
    stepName: 'datosContacto',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 5
    template: 'additionalData',
    title: 'Datos Complementarios',
    stepName: 'datosAdicionales',
    years: [2023, 2024]
  },
  {
    // 5
    template: 'cedula',
    title: 'cedula',
    stepName: '',
    years: [2022]
  },
  {
    // 6
    template: 'uploadStepper',
    title: 'Subir Documentos',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 7
    template: 'successRegister',
    title: 'Registro Exitoso',
    years: [2021, 2022, 2023, 2024]
  },
];

export function generateTemplateStepList(
  this_: any,
  vigencia: number,
  datosAdicionales: Array<DynamicFieldType> | null = null) {
  const mapp = TemplateStepList.reduce((previousValue: any, currentValue: any) => {
    if (currentValue.years.includes(vigencia)) {
      if (currentValue.template === "additionalData" && !datosAdicionales) {
        return previousValue;
      }
      previousValue.push({
        template: this_[currentValue.template],
        title: currentValue.title,
        stepName: currentValue.stepName
      });
    }
    return previousValue;
  }, []);

  return mapp;
}
