import { Validators } from '@angular/forms';
import { RfcValidator } from '@app/data/directives';

const stepConfiguration: any = {
  datosCurp: {
    template: 'validateCurpData',
    content: [
      {
        rfc: {
          initValue: '',
          validators: [RfcValidator()]
        },
        needTutor: {
          initValue: false,
          validators: []
        },
        descripcion: {
          initValue: '',
          validators: [Validators.required]
        },
        comentarioSolicitud: {
          initValue: '',
          validators: []
        },
        type: 'form',
        vigencia: 2021,
      },
      {
        rfc: {
          hidden: false, // optional
          initValue: '',
          validators: [RfcValidator()]
        },
        needTutor: {
          initValue: false,
          validators: []
        },
        descripcion: {
          initValue: '',
          validators: [Validators.required]
        },
        costoAproximado: {
          initValue: '',
          validators: [Validators.required]
        },
        comentarioSolicitud: {
          initValue: '',
          validators: []
        },
        type: 'form',
        vigencia: 2022
      },
      {
        rfc: {
          hidden: true, // optional
          initValue: '',
          validators: [RfcValidator()]
        },
        needTutor: {
          initValue: false,
          validators: []
        },
        descripcion: {
          initValue: '',
          validators: [Validators.required]
        },
        costoAproximado: {
          hidden: true,
          initValue: '',
          validators: [Validators.required]
        },
        comentarioSolicitud: {
          initValue: '',
          validators: []
        },
        type: 'form',
        vigencia: 2023
      }
    ]
  },
  datosContacto: {
    template: 'contactData',
    content: [
      {
        localidadInput: true,
        estadoSelect: true,
        vigencia: 2023,
        type: 'show',
      },
      {
        isAddressByCoordinates: true,
        validateCp: true,
        vigencia: 2022,
        type: 'show',
      },
      {
        estadoSelect: true,
        vigencia: 2023,
        type: 'show',
      }

    ]
  },
  acuse: {
    template: 'uploadAcuse',
    content: [
      {
        solicitud: {
          title: 'Subir Solicitud',
          btnText: 'Generar Formato de Solicitud en Blanco',
          dropzoneText: 'Solicitud Escaneada',
          uploadBtn: 'Subir Solicitud'
        },
        vigencia: 2021,
        type: 'value',
      },
      {
        acuse: {
          title: 'Subir Acuse',
          btnText: 'Generar Acuse',
          dropzoneText: 'Acuse Firmado',
          uploadBtn: 'Subir Acuse'
        },
        vigencia: 2022,
        type: 'value',
      },
      {
        solicitud: {
          title: 'Subir Solicitud Escaneada',
          btnText: 'Generar Solicitud',
          dropzoneText: 'Solicitud Escaneada',
          uploadBtn: 'Subir Solicitud'
        },
        vigencia: 2023,
        type: 'value',
      },
    ]
  }
}

export function getStepConfiguration(
  name: string,
  vigencia: number) {
  const actualStep = stepConfiguration[name].content.filter((element: any) => element.vigencia === vigencia || element.vigencia + 1 === vigencia)[0];

  if (actualStep) {
    const cleanStep = { ...actualStep };
    const type = cleanStep.type;
    delete cleanStep.vigencia;
    delete cleanStep.type

    switch (type) {
      case 'form':
        return { ...getFormConfig(cleanStep), vigencia };
      case 'show':
        return { ...getShowElementsConfig(cleanStep), vigencia };
      case 'value':
        return { ...getShowValueConfig(cleanStep), vigencia };
      default: {
        return { form: {}, show: {} };
      }
    }
  }
}

function getFormConfig(actualStep2: any): any {
  const elements: any = {};
  for (const key of Object.keys(actualStep2)) {
    if (Object(actualStep2[key]).hasOwnProperty('hidden')) {
      delete actualStep2[key];
    } else {
      actualStep2[key] = [actualStep2[key].initValue, actualStep2[key].validators]
      elements[key] = true;
    }
  }

  const result = { form: actualStep2, show: elements };
  return result;
}

function getShowElementsConfig(actualStep3: any): any {
  const elements: any = {};
  for (const key of Object.keys(actualStep3)) {
    if (Object(actualStep3[key]).hasOwnProperty('hidden')) {
      delete actualStep3[key];
    } else {
      elements[key] = true;
    }
  }
  return { show: elements };
}

function getShowValueConfig(actualStep4: any): any {
  const elements: any = {};
  for (const key of Object.keys(actualStep4)) {
    if (Object(actualStep4[key]).hasOwnProperty('hidden')) {
      delete actualStep4[key];
    } else {
      elements[key] = actualStep4[key];
    }
  }

  return { show: elements };
}
