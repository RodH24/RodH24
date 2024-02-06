import * as moment from 'moment';

const DocumentTemplateStepList = [
  {
    // 0
    template: 'uploadFiles',
    title: '',
    stepName: 'uploadFiles',
    years: [2021, 2022, 2023, 2024]
  },
  {
    // 1
    template: 'uploadAcuse',
    title: '',
    stepName: 'uploadAcuse',
    years: [2021, 2022, 2023, 2024]
  },
];

export function generateDocumentTemplateStepList(
  this_: any,
  vigencia: { startDate: string | null, endDate: string | null } | string | number | null = null) {

  vigencia = vigencia ?? new Date().toString();

  if (typeof vigencia === 'string') {
    vigencia = moment(vigencia).utc().year().toString();
  } else if (typeof vigencia === 'number') {
    vigencia = moment(vigencia.toString()).utc().year().toString();
  } else if (vigencia.startDate) {
    vigencia = moment(vigencia.startDate).utc().year().toString();
  } else if (vigencia.endDate) {
    vigencia = moment(vigencia.endDate).utc().year().toString();
  }

  const mapp = DocumentTemplateStepList.reduce((previousValue: any, currentValue: any) => {
    if (currentValue.years.includes(parseInt(vigencia as string))) {
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