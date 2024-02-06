import { SelectOptionType } from '@app/data/types';

export const HousingQuestionList: Array<{
  title: string;
  formControlName: string;
  options: Array<SelectOptionType>;
}> = [
  {
    title: `¿La vivienda que habita es…?`,
    formControlName: 'estatusVivienda',
    options: [
      {
        codigo: 1,
        descripcion: 'Propia y totalmente pagada con escrituras',
      },
      {
        codigo: 2,
        descripcion: 'Propia y totalmente pagada sin escrituras',
      },
      {
        codigo: 3,
        descripcion: 'Propia y la está pagando',
      },
      {
        codigo: 4,
        descripcion: 'Propia y está hipotecada',
      },
      {
        codigo: 5,
        descripcion: 'Rentada o alquilada',
      },
      {
        codigo: 6,
        descripcion: 'Prestada o la está cuidando',
      },
      {
        codigo: 7,
        descripcion: 'Intestada o está en litigio',
      },
    ],
  },
  {
    title: `¿De qué material es la mayor parte del piso de su vivienda?`,
    formControlName: 'materialPiso',
    options: [
      {
        codigo: 1,
        descripcion: 'Cemento o firme',
      },
      {
        codigo: 2,
        descripcion: 'Madera, mosaico u otro recubrimiento',
      },
      {
        codigo: 3,
        descripcion: 'Tierra',
      },
    ],
  },
  {
    title: `¿De qué material es la mayor parte de las paredes o muros de su vivienda?`,
    formControlName: 'materialPared',
    options: [
      {
        codigo: 1,
        descripcion: 'Tabique, ladrillo, cantera, cemento, concreto, block o piedra',
      },
      {
        codigo: 2,
        descripcion: 'Adobe',
      },
      {
        codigo: 3,
        descripcion: 'Lámina de asbesto o metálica',
      },
      {
        codigo: 4,
        descripcion: 'Lámina de cartón',
      },
      {
        codigo: 5,
        descripcion: 'Embarro o bajareque',
      },
      {
        codigo: 6,
        descripcion: 'Material de desecho (cartón, hule, tela, llantas, etc)',
      },
      {
        codigo: 7,
        descripcion: 'Madera',
      },
      {
        codigo: 8,
        descripcion: 'Carrizo, bambú o palma',
      },
    ],
  },
  {
    title: `¿De qué material es la mayor parte del techo de su vivienda?`,
    formControlName: 'materialTecho',
    options: [
      {
        codigo: 1,
        descripcion: 'Losa de concreto o vigueta con bovedilla',
      },
      {
        codigo: 2,
        descripcion: 'Lámina de asbesto',
      },
      {
        codigo: 3,
        descripcion: 'Lámina metálica',
      },
      {
        codigo: 4,
        descripcion: 'Teja',
      },
      {
        codigo: 5,
        descripcion: 'Lámina de cartón',
      },
      {
        codigo: 6,
        descripcion: 'Terrado con viguería',
      },
      {
        codigo: 7,
        descripcion: 'Madera o tejamanil',
      },
      {
        codigo: 8,
        descripcion: 'Material de desecho (cartón, hule, tela, llantas, etc)',
      },
      {
        codigo: 9,
        descripcion: 'Palma o paja',
      },
      {
        codigo: 10,
        descripcion: 'Lámina de fibrocemento',
      },
    ],
  },
  {
    title: `¿En su vivienda tienen…?`,
    formControlName: 'fuenteAgua',
    options: [
      {
        codigo: 1,
        descripcion: 'Agua entubada dentro de la vivienda',
      },
      {
        codigo: 2,
        descripcion: 'Agua entubada fuera de la vivienda, pero dentro del terreno',
      },
      {
        codigo: 3,
        descripcion: 'Agua entubada de llave pública (o hidrante)',
      },
      {
        codigo: 4,
        descripcion: 'Agua entubada que acarrean de otra vivienda',
      },
      {
        codigo: 5,
        descripcion: 'Agua de pipa',
      },
      {
        codigo: 6,
        descripcion: 'Agua de un pozo, río, lago, arroyo u otra',
      },
      {
        codigo: 7,
        descripcion: 'Agua captada de lluvia u otro medio',
      },
      {
        codigo: 8,
        descripcion: 'De otro lugar',
      },
    ],
  },
  {
    title: `¿Esta vivienda tiene drenaje o desagüe conectado a...?`,
    formControlName: 'drenaje',
    options: [
      {
        codigo: 1,
        descripcion: 'La red pública',
      },
      {
        codigo: 2,
        descripcion: 'Una fosa séptica',
      },
      {
        codigo: 3,
        descripcion: 'No tiene drenaje ni desagüe',
      },
      {
        codigo: 4,
        descripcion: 'Una tubería que va a dar a una barranca o grieta',
      },
      {
        codigo: 5,
        descripcion: 'Una tubería que va a dar a un río, lago o mar',
      },
      {
        codigo: 6,
        descripcion: 'Biodigestor',
      },
    ],
  },
  {
    title: `En su vivienda ¿La luz eléctrica la obtienen…?`,
    formControlName: 'fuenteLuzElectrica',
    options: [
      {
        codigo: 1,
        descripcion: 'Del servicio público',
      },
      {
        codigo: 2,
        descripcion: 'No tienen luz eléctrica',
      },
      {
        codigo: 3,
        descripcion: 'De otra fuente',
      },
      {
        codigo: 4,
        descripcion: 'De una planta particular',
      },
      {
        codigo: 5,
        descripcion: 'De panel solar',
      },
    ],
  },
  {
    title: `¿El combustible que más usan para cocinar es...?`,
    formControlName: 'combustibleCocina',
    options: [
      {
        codigo: 1,
        descripcion: 'Gas de cilindro o tanque (estacionario)',
      },
      {
        codigo: 2,
        descripcion: 'Leña o carbón con chimenea',
      },
      {
        codigo: 3,
        descripcion: 'Leña o carbón sin chimenea',
      },
      {
        codigo: 4,
        descripcion: 'Gas natural o de tubería',
      },
      {
        codigo: 5,
        descripcion: 'Electricidad',
      },
      {
        codigo: 6,
        descripcion: 'Otro combustible',
      },
    ],
  },
];
