const TemplateList = [
  {
    template: 'firmaAcuse',
    route: 'firma-y-acuse',
    title: 'Formato de Firma y Acuse',
    years: [2022]
  },
  {
    template: 'reimpresionFirmaAcuse',
    route: 'firma-y-acuse-reimpresion',
    title: 'Reimpresión de Formato de Firma y Acuse',
    years: [2022]
  },
  {
    template: 'solicitudCedulaBlanco',
    route: 'en-blanco',
    title: 'Formato de Solicitud y Cédula en Blanco',
    years: [2022]
  },
  {
    template: 'solicitudBlanco',
    route: 'en-blanco',
    title: 'Formato de Solicitud en Blanco',
    years: [2021, 2023,2024]
  }
];

export function generateTemplateList(this_: any, vigencia: number) {
  const result: any = {};

  for (const element of TemplateList) {
    if (element.years.includes(vigencia)) {
      result[element.route] = {
        template: this_[element.template],
        title: element.title,
      };
    }
  }
  return result;
}
