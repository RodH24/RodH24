import { TrackingFlowService } from "@app/data/services";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SessionEntity } from "@app/data/entities";
import { FilterStorageEntity } from "@app/data/entities";

type Apoyo = {
  clave: string;
  name: string;
};

@Component({
  selector: "app-apoyos-select",
  templateUrl: "./apoyos-select.component.html",
  styleUrls: ["./apoyos-select.component.scss"],
})
export class ApoyosSelectComponent implements OnInit {
  @Output() emitSelected: EventEmitter<Array<any>> = new EventEmitter<
    Array<any>
  >();
  @Input() specialSelection: any;
  //
  private specialConfig = {
    clave: "-",
    name: "Todos los Apoyos",
  };
  private filterStorage: FilterStorageEntity = new FilterStorageEntity();
  private session: SessionEntity;
  //
  public selectedApoyo: string;
  public apoyosList: Array<Apoyo> = [];
  public showSelect: boolean = false;

  constructor(private trackingFlowService: TrackingFlowService) {
    this.session = new SessionEntity();
    this.selectedApoyo = this.filterStorage.apoyoSelect;
  }

  ngOnInit(): void {
    this.showSelect =
      "apoyos" in this.session.getActiveRole &&
      this.session.getActiveRole.apoyos.length;
    const hasApoyos = "apoyos" in this.session.getActiveRole;


    if (hasApoyos) {
      // this filter all types specially VIM
      let supportTypeNoPeu = this.session.getActiveRole.apoyos.filter(
        (item: any) => {
          return item.type === "VIM";
        }
      );

      this.apoyosList =
        this.specialSelection === true
          ? [this.specialConfig, ...supportTypeNoPeu]
          : [...supportTypeNoPeu];
      if (this.specialSelection === true) {
        this.trackingFlowService.getAllSupportTypeSelect((response: any) => {
          response.forEach((item: any) => {
            let tempItem = {
              clave: item.tipoApoyo.clave,
              name: item.tipoApoyo.nombre,
              type: item.tipoApoyo.tipo,
            };
            this.apoyosList.push(tempItem);
          });
          let emitedValue = [, response];
          this.emitSelected.emit(emitedValue);
        });
      } else {
        this.trackingFlowService.getSupportFlow(
          this.selectedApoyo,
          (response: any) => {
            // change 1rst value shown on the select
            // let firstItem:any = this.apoyosList[0];
            // emit this value to filter the first time
            let emitedValue = [this.selectedApoyo, response];
            this.emitSelected.emit(emitedValue);
          }
        );
      }
    } else {
      this.showSelect = true;
      // Admin / Enlace
      this.trackingFlowService.getAllSupportTypeSelect((response: any) => {
        response.forEach((item: any) => {
          let tempItem = {
            clave: item.tipoApoyo.clave,
            name: item.tipoApoyo.nombre,
            type: item.tipoApoyo.tipo,
          };
          this.apoyosList.push(tempItem);
        });

        this.trackingFlowService.getSupportFlow(
          // this.apoyosList[0]["clave"],
          this.selectedApoyo,
          (response: any) => {
            // change 1rst value shown on the select
            // let firstItem:any = this.apoyosList[0];
            // emit this value to filter the first time
            let emitedValue = [this.selectedApoyo, response];
            this.emitSelected.emit(emitedValue);
          }
        );
      });
    }
  }

  public updateSelected(apoyo: any) {
    if (apoyo == "-") {
      this.emitSelected.emit(["All", null]);
    } else if (
      this.session.getActiveRole.apoyos === undefined ||
      this.session.getActiveRole.apoyos.length == 0
    ) {
      this.trackingFlowService.getSupportFlow(apoyo, (response: any) => {
        this.selectedApoyo = apoyo;
        let emitedValue = [this.selectedApoyo, response];
        this.filterStorage.apoyoSelect = this.selectedApoyo;
        this.emitSelected.emit(emitedValue);
      });
    } else {
      // Get config of support type
      let item = this.session.getActiveRole.apoyos.filter((item: any) => {
        return item.clave == apoyo;
      });

      this.trackingFlowService.getSupportFlow(
        item[0]["clave"],
        (response: any) => {
          // let flow = item[0]["flujoSeguimiento"];
          this.filterStorage.apoyoSelect = item[0].clave;
          this.emitSelected.emit([item[0]["clave"], response]);
        }
      );
    }
  }
}
