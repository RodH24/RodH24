import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { DocumentType, ElegibilidadType } from "@app/data/types";

@Component({
  selector: "app-document-admin",
  templateUrl: "./document-admin.component.html",
  styleUrls: ["./document-admin.component.scss"],
})
export class DocumentAdminComponent implements OnInit {
  @Input() type: "document" | "criteria" = "document";
  @Input() documents: Array<DocumentType> = [];
  @Input() criterios: Array<ElegibilidadType> = [];
  @Output() onChanges: EventEmitter<{
    type: "document" | "criteria";
    result: Array<DocumentType> | Array<ElegibilidadType>;
  }> = new EventEmitter<{
    type: "document" | "criteria";
    result: Array<DocumentType> | Array<ElegibilidadType>;
  }>();
  //
  public hasChanges: boolean = false;

  get list(): Array<DocumentType | ElegibilidadType> {
    return this.type === "document" ? this.documents : this.criterios;
  }

  getTypeList(item: DocumentType | ElegibilidadType): Array<string> {
    return "tiposDocumentos" in item ? item.tiposDocumentos : [];
  }

  public getItemName(item: DocumentType | ElegibilidadType): string {
    const aItem: any = item ?? {};
    return "nombre" in aItem
      ? aItem.nombre
      : "requisito" in item
      ? item.requisito
      : "";
  }

  constructor() {}

  ngOnInit(): void {
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /*****************************************/

  /**
   * Handle add event.
   * Add the data, dependant on type
   * @param {string} type Controls where push the new property
   */
  public onAdd(
    event: any,
    type: "document" | "type" | "criteria" = "document",
    index: number = -1
  ): void {
    const input: string = event.target.value ?? "";
    if (type === "type" && input !== "" && index != -1) {
      this.documents[index].tiposDocumentos.push(input);
      this.onChanges.emit({ type: "document", result: this.documents });
    } else if (type === "document" && input !== "") {
      if (this.type === "document") {
        this.documents.push({
          orden: this.documents.length + 1,
          nombre: input,
          alternativo: "",
          tiposDocumentos: [],
          habilitado: true,
        });
        this.onChanges.emit({ type: this.type, result: this.documents });
      } else if (this.type === "criteria") {
        this.criterios.push({
          orden: this.criterios.length + 1,
          condiciones: [],
          requisito: input,
        });
        this.onChanges.emit({ type: this.type, result: this.criterios });
      }
    }
    event.target.value = "";
  }

  public onRemove(
    type: string = "document",
    docIndex: number = -1,
    typeIndex: number = -1
  ): void {
    if (type === "type" && docIndex !== -1 && typeIndex !== -1) {
      this.documents[docIndex].tiposDocumentos.splice(typeIndex, 1);
      this.onChanges.emit({ type: this.type, result: this.documents });
    } else if (type === "document" && docIndex !== -1) {
      this.documents.splice(docIndex, 1);
      this.onChanges.emit({ type: this.type, result: this.documents });
      if (this.type === "document") {
      } else if (this.type === "criteria") {
        this.criterios.splice(docIndex, 1);
        this.onChanges.emit({ type: this.type, result: this.criterios });
      }
    }
  }
}
