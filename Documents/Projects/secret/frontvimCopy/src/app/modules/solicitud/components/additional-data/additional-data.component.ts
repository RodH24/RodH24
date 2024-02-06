import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input, ViewContainerRef } from '@angular/core';
import { ControlStepperRequestEventType } from '@data/types/ControlStepperRequestEventType';
import { SolicitudFunctions } from '@app/data/functions';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormFunctions } from '@data/functions';
import { DynamicFieldType, NewProgram, ProgramType } from '@app/data/types';
import { CatalogService } from '@app/data/services';
import { ApplicationStorageEntity } from '@app/data/entities';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {
  @ViewChild('Text', { read: TemplateRef }) Text!: TemplateRef<any>;
  @ViewChild('Switch') Switch!: TemplateRef<any>;
  @ViewChild('Select') Select!: TemplateRef<any>;
  @ViewChild('MultiSelect') MultiSelect!: TemplateRef<any>;
  @ViewChild('MultiInput') MultiInput!: TemplateRef<any>;
  @ViewChild('Number') Number!: TemplateRef<any>;
  @ViewChild('QuestionContainer', { read: ViewContainerRef }) QuestionContainer!: ViewContainerRef;
  //
  @Input() programData: ProgramType = NewProgram;
  @Output() changeContent: EventEmitter<ControlStepperRequestEventType> = new EventEmitter<ControlStepperRequestEventType>();
  //
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  private stepName: string = 'datosAdicionales';
  //
  public datosComplementariosList: Array<any> = [];
  public formData: UntypedFormGroup = this.formBuilder.group({});
  public municipioList: Array<any> = [];
  public estadoList: Array<string> = [];
  public estadosFullList: Array<any> = [];
  public selectAuxiliar: any = {};

  set multiInputArray(newInput: any) {
    const multiArray = this.formData.get(newInput.name) as UntypedFormArray;
    multiArray.push(
      this.formBuilder.group({
        descripcion: [newInput.descripcion, [Validators.required]],
        tipo: [newInput.tipo, [Validators.required]],
      })
    )
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private catalogService: CatalogService,
  ) {
    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getEstadoList();
    this.setSelectAuxiliar();


    // this.formData = this.formBuilder.group(
    //   FormFunctions.formGroupFields(
    //     this.formBuilder,
    //     (this.getDatosAdicionalesArray()),
    //     this.formData
    //   )
    // );

    
    
  }

  public setInitData(): void {
    this.formData = this.formBuilder.group(
      FormFunctions.formGroupFields(
        this.formBuilder,
        (this.getDatosAdicionalesArray()),
        this.applicationStorage.solicitud?.[this.stepName] ?? {}
      )
    );

    this.datosComplementariosList = FormFunctions.getTemplateInputList(this.programData.apoyo?.datosAdicionales ?? [], this, { Municipio: this.municipioList });
    this.formData.get('Municipio')?.patchValue(this.applicationStorage.solicitud[this.stepName]?.Municipio ?? '');
  }

  public setSelectAuxiliar(): void {
    for (const element of this.getDatosAdicionalesArray()) {
      if (element.type === 'Select') {
        if (this.applicationStorage.solicitud[this.stepName]) {
          this.selectAuxiliar[element.key] = this.applicationStorage.solicitud[this.stepName][element.key]?.codigo ?? 0;
        } else {
          this.selectAuxiliar[element.key] = 0;
        }
      }
    }
  }

  // public setMultiSelectAuxiliar(): void {
  //   for (const element of this.getDatosAdicionalesArray()) {
  //     if (element.type === 'MultiInput') {
  //       if (this.applicationStorage.solicitud[this.stepName][element.key]) {
  //         const aux = [];
  //         let i = 0;
  //         for (const item of this.applicationStorage.solicitud[this.stepName][element.key]) {
  //           if (i !== 0) {
  //             aux = element;
  //           }
  //           i++;
  //         }
  //       }
  //     }
  //   }
  // }

  public getEstadoList(): void {
    this.catalogService.getMunicipioList(null, (list: any) => {
      this.estadoList = list.map((element: any) => element.estado);
      this.estadosFullList = list;
      this.getMunicipioList();
    });
  }

  public getMunicipioList(): void {
    const estado: string = 'GUANAJUATO';
    this.municipioList = this.estadosFullList.filter((element: any) =>
      element.estado.toUpperCase() === estado.toUpperCase())[0]?.municipios.map((element: any) => ({
        descripcion: element.nombre_municipio,
        codigo: element.id_municipio
      }));

    this.setInitData()
  }

  public getControlValue(key: string): any {
    return this.formData.controls[key].value;
  }

  public getNumberInLimits(item: DynamicFieldType): boolean {
    const value = this.getControlValue(item.key);
    let min = 0;
    let max = 999999999999;
    for (const validator of item.validators) {
      if (validator.type === 'min') {
        min = validator.value as number ?? 0
      } else if (validator.type === 'max') {
        max = validator.value as number ?? 0
      }
    }
    return value >= min && value <= max;
  }

  public getMultiInputArray(fieldName: string): UntypedFormArray {
    const array = this.formData.get(fieldName);
    return (array ?? []) as UntypedFormArray;
  }

  /******************************************/
  /*************** EVENT ********************/
  /******************************************/

  public onPreviousStepClick() {
    this.changeContent.emit(SolicitudFunctions.previousStep(-1));
  }

  public onNextStepClick() {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }
    this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
  }

  public onRemoveMultiInput(fieldName: string, i: number, e: MouseEvent): void {
    e.preventDefault();
    const array = this.formData.get(fieldName) as UntypedFormArray;
    array.removeAt(i);
  }

  public getDatosAdicionalesArray(): Array<DynamicFieldType> {
    let fields: Array<DynamicFieldType> = [];
    for (const section of this.programData.apoyo?.datosAdicionales ?? []) {
      fields = [...fields, ...section.campos]
    }
    return fields;
  }

  public onAddMultiInputOption(formArrayName: string): void {
    this.multiInputArray = { name: formArrayName, descripcion: "", tipo: "" };
  }

  public onUpdateCount(count: number, key: string): void {
    this.formData.controls[key].setValue(count);
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /******************************************/

  public compareFn = (o1: any, o2: any): boolean => (o1 && o2 ? o1.codigo === o2.codigo : o1 === o2);

  public updateSelectAuxiliar(value: number, item: DynamicFieldType) {
    const selectedOpt = item.options?.filter(element => element.codigo === value)[0];
    this.formData.patchValue({
      [item.key]: selectedOpt
    });
  }
}
