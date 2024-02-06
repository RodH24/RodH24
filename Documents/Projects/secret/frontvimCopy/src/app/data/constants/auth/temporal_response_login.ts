export const temporalResponseLogin = {
    "sub": "VIM",
    "uid": "6197eb799c1fce80af39a6d1",
    "name": "Daniela Isabel Hernandez Villafuerte",
    "email": "dihernandezv@guanajuato.gob.mx",
    "urlImage": "",
    "activeRole": "62bb5ba9e705955ad8f7c29e",
    "roles": [
          {
              "id": "62bc9176fd4d47d345165417",
              "name": "Administrador",
              "key": "ADMIN_ROL",
              "mainRoute":"admin/usuario"
          },
          {
              "id": "61ae64389c1fce80af5efb27",
              "name": "Enlace Dependencia",
              "key": "ENLACE_ROL",
              "dependencia": {
                  "id": "61b04af49c1fce80af627c9f",
                  "name": "Secretaría de Medio Ambiente y Ordenamiento Territorial",
                  "acronym": "SMAOT"
              }
          },
          {
              "id": "62bb5ba9e705955ad8f7c29e",
              "name": "Responsable General Programa",
              "key": "RESPONSABLE_GENERAL_Q_ROL",
              "mainRoute":"dependencia/panel/pendientes",
              "hasPeu": false,
              "dependencia": {
                  "id": "61b04af49c1fce80af627c9f",
                  "name": "Secretaría de Medio Ambiente y Ordenamiento Territorial",
                  "acronym": "SMAOT"
              },
              "clavesQ": [
                  {
                      "id": "61d716029c1fce80afbfd28c",
                      "q": "Q1417",
                      "name": "Calentadores Solares"
                  },
                  {
                      "clave": "Q1417-02",
                      "name": "Calentadores Solares 2"
                  }
              ]            
          },
          {
              "id": "62bb5c1ee705955ad8f7c29f",
              "name": "Responsable de Capturistas Programa",
              "key": "RESPONSABLE_CAPTURISTAS_Q_ROL",
              "hasPeu": false,
              "dependencia": {
                  "id": "61b04af49c1fce80af627c9f",
                  "name": "Secretaría de Medio Ambiente y Ordenamiento Territorial",
                  "acronym": "SMAOT"
              },
              "modalidades": [
                  {
                      "clave": "Q1417-01",
                      "name": "Calentadores Solares"
                  },
                  {
                      "clave": "Q0917-01",
                      "name": "Vales de Despensa"
                  }
              ]           
          },
          {
              "id": "62bb5c80e705955ad8f7c2a0",
              "name": "Responsable de Brigadas Programa",
              "key": "RESPONSABLE_Brigada_Q_ROL",
              "hasPeu": false,
              "regiones": [
                  {
                      "id": "qgyqgqgqgwddwdw",
                      "nombre": "Guanajuato",
                      "clave": 11
                  }
              ],
              "modalidades": [
                  {
                      "clave": "Q1417-01",
                      "name": "Calentadores Solares"
                  },
                  {
                      "clave": "Q0917-01",
                      "name": "Vales de Despensa"
                  }
              ]           
          },
          {
              "id": "62bb4d8ce705955ad8f7c298",
              "name": "capturista regional",
              "key": "OPERADOR_REGIONAL_ROL",
              "regiones": [
                  {
                      "id": "qgyqgqgqgwddwdw",
                      "nombre": "Guanajuato",
                      "clave": 11
                  }
              ],
              "modalidades": [
                  {
                      "clave": "Q1417-01",
                      "name": "Calentadores Solares"
                  },
                  {
                      "clave": "Q0917-01",
                      "name": "Vales de Despensa"
                  }
              ]           
          },
          {
              "id": "61ae66009c1fce80af5eff1f",
              "name": "capturista",
              "key": "OPERADOR_ROL",
              "modalidades": [
                  {
                      "clave": "Q1417-01",
                      "name": "Calentadores Solares"
                  },
                  {
                      "clave": "Q0917-01",
                      "name": "Vales de Despensa"
                  }
              ]       
          }
      ],
      "dependency": {
          "id": "61b04af49c1fce80af627c9f",
          "name": "Secretaría de Medio Ambiente y Ordenamiento Territorial",
          "acronym": "SMAOT"
      },
      "office": {
          "id": "6222643bdfa7370b023ef84b",
          "city": "IRAPUATO",
          "name": "Centro de Gobierno Irapuato",
          "address": "Vialidad interior sobre Av. Siglo XXI 412 Los Sauces 36823 Guanajuato",
          "georef": {
          "type": "Point",
          "coordinates": [
              20.7217938,
              -101.3403282
          ]
          }
    }
  }