export const ExpensesQuestionList: Array<{ title: string; formControlName: string }> = [
  {
    title: `La compra de alimentos y bebidas (cereales, carnes, pescados y mariscos, leche, huevo, aceite, verduras, legumbres, frutas, azúcar, chocolate)`,
    formControlName: 'comida',
  },
  {
    title: `La compra o reparación de vestido o calzado`,
    formControlName: 'ropa',
  },
  {
    title: `La compra de artículos y servicios de educación (inscripción, colegiatura, útiles escolares, etc.)`,
    formControlName: 'educacion',
  },
  {
    title: `La compra de medicinas`,
    formControlName: 'medicina',
  },
  {
    title: `Consultas médicas`,
    formControlName: 'consultas',
  },
  {
    title: `Combustibles (gas, petróleo, gasolina, carbón, leña)`,
    formControlName: 'combustible',
  },
  {
    title: `Servicios básicos (luz eléctrica y agua)`,
    formControlName: 'serviciosBasicos',
  },
  {
    title: `Servicios de recreación (cines, teatros, espectáculos, museos, ferias, juegos mecánicos, etc.)`,
    formControlName: 'recreacion',
  },
];
