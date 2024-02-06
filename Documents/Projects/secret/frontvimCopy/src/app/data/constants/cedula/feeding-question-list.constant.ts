export const FeedingQuestionList: Array<{
  title: string;
  formControlName: string;
}> = [
  {
    title: `Tuvo una alimentación basada en muy poca variedad de alimentos`,
    formControlName: 'pocaVariedadAlimento',
  },
  {
    title: `Comió menos de lo que debía`,
    formControlName: 'comioMenos',
  },
  {
    title: `Tuvieron que disminuirle la cantidad servida en las comidas`,
    formControlName: 'disminuyoCantidad',
  },
  {
    title: `Sintió hambre pero no comió`,
    formControlName: 'tuvoHambreNoComio',
  },
  {
    title: `Se acostó con hambre`,
    formControlName: 'durmioConHambre',
  },
  {
    title: `Sólo comió una vez al día o dejó de comer todo un día`,
    formControlName: 'comioUnaVezoNo',
  },
];
