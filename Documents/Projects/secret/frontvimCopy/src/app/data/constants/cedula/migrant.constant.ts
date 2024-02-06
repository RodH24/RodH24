import { SelectOptionType } from '@app/data/types';

export const Migrant: Array<SelectOptionType> = [
  {
    respuesta: false,
    codigo: 0,
    descripcion: 'Ninguna de las anteriores',
  },
  {
    respuesta: true,
    codigo: 1,
    descripcion: 'Migrante',
  },
  {
    respuesta: true,
    codigo: 2,
    descripcion: 'Familiar de Migrante',
  },
  {
    respuesta: true,
    codigo: 3,
    descripcion: 'Migrante en Retorno',
  },
  {
    respuesta: true,
    codigo: 4,
    descripcion: 'Migrante en Tránsito',
  },
];
