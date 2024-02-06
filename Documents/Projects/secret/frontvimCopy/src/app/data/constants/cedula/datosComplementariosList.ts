import { DynamicFieldType } from "@data/types";

export const DatosComplementariosList: Array<DynamicFieldType>
  = [
    {
      title: `Nombre del centro de estudios`,
      key: 'comida',
      type: "Text",
      placeholder: "Seleccionar",
      defaultValue: "",
      validators: [
        {
          type: 'min',
          value: 5,
        }
      ],
    },
    {
      title: `Nivel máximo de estudios`,
      key: 'ropa',
      type: "Text",
      placeholder: "Seleccionar",
      defaultValue: "",
      validators: [
        {
          type: 'maxLength',
          value: 8,
        },
        {
          type: 'minLength',
          value: 5,
        }
      ]
    },
    {
      title: `Clave del centro de trabajo`,
      key: 'Clave_del_centro_de_trabajo',
      type: "Text",
      placeholder: "Seleccionar",
      defaultValue: "",
      validators: [
        {
          type: 'pattern',
          value: '^[0-9]*$',
        }
      ]
    },
    {
      title: `Text`,
      key: 'comida',
      type: "Text",
      placeholder: "Seleccionar",
      defaultValue: "",
      validators: [
        {
          type: 'min',
          value: 5,
        }
      ],
    },
    {
      title: `Number`,
      key: 'numerito',
      type: "Number",
      placeholder: "Seleccionar",
      defaultValue: "",
      validators: [
        {
          type: 'min',
          value: 5,
        },
        {
          type: 'max',
          value: 7
        }
      ],
    },
    {
      title: `Switch`,
      key: 'apoyo',
      type: "Switch",
      placeholder: "Seleccionar",
      defaultValue: false,
      labels: ['No', 'Si'],
      validators: [
        {
          type: 'required',
          value: null,
        }
      ]
    },
    {
      title: `Select`,
      key: 'select',
      type: "Select",
      placeholder: "Seleccionar",
      defaultValue: 1,
      options: [
        {
          descripcion: 'Opcion 1',
          codigo: "Twitter"
        },
        {
          descripcion: 'Opcion 2',
          codigo: "Facebook"
        }
      ],
      validators: [
        {
          type: 'required',
          value: null,
        }
      ]
    },
    {
      title: `MultiSelect`,
      key: 'multiselect',
      type: "MultiSelect",
      placeholder: "Seleccionar",
      defaultValue: [],
      options: [
        {
          descripcion: 'Opcion 1',
          codigo: 1
        },
        {
          descripcion: 'Opcion 2',
          codigo: 2
        }
      ],
      maxOptionsSelected: 2,
      validators: [
        {
          type: 'required',
          value: null,
        }
      ]
    },
    {
      title: "Multi Input Satánico",
      key: "multi-input",
      type: "MultiInput",
      isFormArray: true,
      placeholder: "Escribe tu input",
      defaultValue: [],
      validators: [
        {
          type: 'required',
          value: null,
        },
        {
          type: 'minLength',
          value: 2
        }
      ],
      options: [
        {
          descripcion: 'Opcion 1',
          codigo: 1
        },
        {
          descripcion: 'Opcion 2',
          codigo: 2
        }
      ],
    }
  ];

