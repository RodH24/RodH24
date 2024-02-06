const CedulaTemplateStepList = [
  {
    // 1
    template: 'householdData',
    title: 'Datos del hogar',
  },
  {
    // 2
    template: 'healthServiceData',
    title: 'Salud',
  },
  {
    // 3
    template: 'healthIssues',
    title: 'Salud',
  },
  {
    // 4
    template: 'educationData',
    title: 'Educación',
  },
  {
    // 5
    template: 'incomeData',
    title: 'Ingresos',
  },
  {
    // 6
    template: 'expensesData',
    title: 'Gasto',
  },
  {
    // 7
    template: 'foodData',
    title: 'Alimentación',
  },
  {
    // 8
    template: 'housingData',
    title: 'Vivienda',
  },
  {
    // 9
    template: 'houseAppliances',
    title: 'Vivienda',
  },
  {
    // 10
    template: 'perceptionData',
    title: 'Percepción',
  },
  {
    // 11
    template: 'uploadStepper',
    title: 'Subir Archivos',
  },
  {
    // 12
    template: 'successRegister',
    title: 'Registro Exitoso',
  },
];

export function generateCedulaTemplateStepList(
  this_: any,
  isInternal: boolean = false
) {
  const externalSteps = isInternal ? ['uploadStepper', 'successRegister'] : [];
  return CedulaTemplateStepList.reduce((result: Array<any>, element: any) => {
    if (!externalSteps.includes(element.template)) {
      result.push({
        template: this_[element.template],
        title: element.title,
      });
    }
    return result;
  }, []);
}
