import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormFunctions } from '@data/functions';
import { DatosComplementariosList } from '../../../../data/constants/cedula/index'
import { showFormErrors } from '@app/data/functions/forms';
import { NewProgram, ProgramType } from '@app/data/types';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-additional-data-modal',
  templateUrl: './additional-data-modal.component.html',
  styleUrls: ['./additional-data-modal.component.scss']
})
export class AdditionalDataModalComponent implements OnInit, OnDestroy {

  @Input() program: ProgramType = NewProgram;
  @Input() modalidadIndex: number = 0;
  @Input() apoyoIndex: number = 0;
  @Input() formDataApoyo!: any;
  public showProgramDetailsModal: boolean = false;
  public formData!: UntypedFormGroup;
  private subscribers: Array<Subscription> = [];
  public contadorForm: number = 0;
  public countSuscribers: any[] = []
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() arrayFormAdditionalModalHijo = 
    new EventEmitter<{arrayFormAdditional: any[], apoyoIndex: number}>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.suscripcionesEvent();
  }

  ngOnDestroy() {
    for (const element of this.subscribers) {
      if (element) element.unsubscribe();
    }
  } 

  //Se realizo esta accion por un problema para hacer un toggle de disabled en validators
  ngAfterContentChecked() {
    this.cdRef.detectChanges(); 
  }

  /*******************************
   ********** EVENTS **************
   ********************************/

  //Cierra el modal additional-data
  public onClose(): void {
    this.onCloseModal.emit(false);
  }

  //Guarda los datos del formulario Principal
  public onSaveDataDynamics(): void {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }
    const arrayFormAdditional = this.preSaveDataDynamics(this.arrayForm.value);
    const apoyoIndex = this.apoyoIndex;
    const parametros = { arrayFormAdditional, apoyoIndex };
    this.arrayFormAdditionalModalHijo.emit(parametros);
    swal.fire('Atención!', 
    'Debes guardar el formulario de apoyo para guardar los cambios de datos adicionales.', 'info');
    this.onClose();
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /*****************************************/

  //Devuelve un array de objetos del formulario principal donde solo va a retornar
  //los datos que si tienen valor
  public preSaveDataDynamics(array: any[]): any[] {
    var arrayNuevo: any[] = [];
    let i = 0;
    for(let element of array){
      arrayNuevo[i] = {};
      element.title !== "" ? arrayNuevo[i]['title'] = element.title : false;
      element.key !== "" ? arrayNuevo[i]['key'] = element.key : false;
      element.placeholder !== "" ? arrayNuevo[i]['placeholder'] = element.placeholder : false;
      element.isFormArray == true ? arrayNuevo[i]['isFormArray'] = element.isFormArray : false;
      element.defaultValue !== "" ? arrayNuevo[i]['defaultValue'] = element.defaultValue : false;
      element.labels !== "" ? arrayNuevo[i]['labels'] = element.labels : false;
      element.maxOptionsSelected !== "" ? arrayNuevo[i]['maxOptionsSelected'] = element.maxOptionsSelected : false;
      element.type !== "" ? arrayNuevo[i]['type'] = element.type.value : false;
      if(element.options.length !== 0 && (element.options[0].descripcion !== '' || element.options[0].codigo !== '')){
        let j=0
        arrayNuevo[i]['options'] = [];
        for(let item of element.options){
          arrayNuevo[i]['options'][j] = { descripcion: item.descripcion, codigo: item.codigo };
          j++;
        }
      }
      if(element.validators.length !== 0 && (element.validators[0].type !== '' && element.validators[0].value !== '')){
        let j=0
        arrayNuevo[i]['validators'] = [];
        for(let item of element.validators){
          arrayNuevo[i]['validators'][j] = { type: item.type, value: item.value };
          j++;
        }
      }
      i++;
    }
    return arrayNuevo;
  }

  //1.- Crea el formulario principal en un formArray
  public crearFormulario() {
    this.formData = this.formBuilder.group({
      arrayForm: new UntypedFormArray(this.setFormArray()),
    });
    //this.anadirFormulario();
  }

  //2.- Valida si tiene informacion para precargar o cargar datos vacios en el formulario Principal
  private setFormArray(): Array<UntypedFormGroup> {
    const arrayValue = [];
    if (
      this.formDataApoyo.value[this.apoyoIndex] &&
      "datosAdicionales" in this.formDataApoyo.value[this.apoyoIndex] && 
      this.formDataApoyo.value[this.apoyoIndex]?.datosAdicionales.length !== 0
    ) {
      for (const element of this.formDataApoyo.value[this.apoyoIndex]?.datosAdicionales) {
        arrayValue.push(this.anadirFormulario(element));
      }
    }else{
      arrayValue.push(this.datosDefault());
    }
    return arrayValue;
  }
  
  //3.- Preparga los datos existentes o en vacio si no existen todos
  public anadirFormulario(element: any = {},): UntypedFormGroup {
    const array = this.formBuilder.group({
      title: [element.title ?? '', [Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      key: [element.key ?? '', [Validators.required]],
      placeholder: [element.placeholder ?? '', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      isFormArray: [element.isFormArray ?? false, []],
      defaultValue: [element.defaultValue ?? '', [Validators.required,Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      labels: [element.labels ?? '', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      options: new UntypedFormArray(this.arrayoptions(element.options)),
      maxOptionsSelected: [element.maxOptionsSelected ?? '', []],
      type: this.formBuilder.group({
        value: [element.type ?? '', []],
        index: [this.contadorForm, []],
      }),
      validators: new UntypedFormArray(this.arrayValidators(element.validators)),
      index: [this.contadorForm, []],
    });
    this.countSuscribers.push(this.contadorForm);
    this.contadorForm++;
    return array;
  }

  //3.- Precarga datos vacios en el Formulario Principal
  public datosDefault() {
    const array = this.formBuilder.group({
      title: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      key: ['', [Validators.required]],
      placeholder: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      isFormArray: [false, []],
      defaultValue: ['', [Validators.required,Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      labels: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      options: new UntypedFormArray([this.formBuilder.group({
        descripcion: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
        codigo: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      })]),
      maxOptionsSelected: ['', []],
      type: this.formBuilder.group({
        value: ['', []],
        index: [this.contadorForm, []],
      }),
      validators: new UntypedFormArray([this.formBuilder.group({
        type: ['', []],
        value: ['', []],
      })]),
      index: [this.contadorForm, []],
    });
    this.countSuscribers.push(this.contadorForm);
    this.contadorForm++;
    return array;
  }

  //Precarga los datos de options en vacio
  public datosDefaultOptions(){
    return this.formBuilder.group({
      descripcion: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
      codigo: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
    });
  }

  //Precarga los datos de validators en vacio
  public datosDefaultvalidators(){
    return this.formBuilder.group({
      type: ['', []],
      value: ['', []],
    });
  }

  //Precarga los datos existentes de options y se utiliza en anadirFormulario
  public arrayoptions(element: any[]){
    let array = []
    if(element !== undefined){
      for(let i of element){
        array.push(this.formBuilder.group({
          descripcion: [i.descripcion ?? '', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]],
          codigo: [i.codigo ?? '', [Validators.pattern(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]*$/),Validators.maxLength(50)]]
        }));
      }
    }else{
      array.push(this.datosDefaultOptions());
    }
    return array;
  }

  //Precarga los datos existentes de validators y se utiliza en anadirFormulario
  public arrayValidators(element: any[]){
    let array = []
    if(element !== undefined){
      for(let i of element){
        array.push(this.formBuilder.group({
          type: [i.type ?? '', []],
          value: [i.value ?? '', []]
        }));
      }
    }else{
      array.push(this.datosDefaultvalidators());
    }
    return array;
  }

  //Indica como suscribirse al indice cuando se precarga o añade un formulario nuevo
  public suscripcionesEvent(){
    if(this.countSuscribers.length > 1){
      for(let i of this.countSuscribers){
        this.typeSuscribe(i);
      }
    }else{
      this.typeSuscribe(this.arrayForm.value.length-1);
    }
    this.countSuscribers = [];
  }

  //Obtiene los valores del Formulario principal formArray
  public get arrayForm(): UntypedFormArray {
    //return this.formData.get('arrayForm') as FormArray;
    const array = this.formData.get("arrayForm");
    return (array ?? []) as UntypedFormArray;
  }

  //Obtiene los valores del Formulario secundario de Options del formArray
  public getArrayForm(i: number): UntypedFormArray {
    //return this.formData.get('arrayForm') as FormArray;
    const array = this.formData.get(`arrayForm.${i}`);
    return (array ?? []) as UntypedFormArray;
  }

  //Obtiene los valores del Formulario secundario de Options del formArray
  public getArrayOptions(i: number): UntypedFormArray {
    //return this.formData.get('arrayForm') as FormArray;
    const array = this.formData.get(`arrayForm.${i}.options`);
    return (array ?? []) as UntypedFormArray;
  }

  //Obtiene los valores del Formulario secundario de Validators del formArray
  public getArrayValidators(i: number): UntypedFormArray {
    //return this.formData.get('arrayForm') as FormArray;
    const array = this.formData.get(`arrayForm.${i}.validators`);
    return (array ?? []) as UntypedFormArray;
  }

  //Agrega un nuevo formulario en el formulario Principal
  public onAdd(): void {
    this.arrayForm.push(this.datosDefault());
    this.suscripcionesEvent();
  }

  //Agrega un nuevo formulario en el formulario secundario options
  public onAddOptions(i: number): void {
    this.getArrayOptions(i).push(this.datosDefaultOptions());
  }

  //Agrega un nuevo formulario en el formulario secundario Validators
  public onAddValidators(i: number): void {
    this.getArrayValidators(i).push(this.datosDefaultvalidators());
  }

  //Suscripcion a los datos del Formulario Principal dependiendo el valor del Type
  public typeSuscribe(countArrayForm: number) {
    //const countArrayForm = this.arrayForm.value.length-1;
    this.subscribers.push(this.formData.get(`arrayForm.${countArrayForm}.type`)!.valueChanges.subscribe(itemType => {
      for(let item of this.arrayForm.value){
        if(item.index == itemType.index){
          const formIndex = this.arrayForm.controls.findIndex(form => form.get(`index`)?.value === itemType.index);
          if (formIndex !== -1) {
            const formGroup = this.arrayForm.controls[formIndex] as UntypedFormGroup;
            formGroup.setControl('options', this.formBuilder.array([
              this.formBuilder.group({
                descripcion: [null],
                codigo: [null]
              })
            ]));

            let isArray: boolean = false;
            itemType.value == "MultiSelect" || itemType.value == "MultiInput" ? isArray = true : isArray = false;
            
            formGroup?.patchValue({
              placeholder: '',
              labels: '',
              defaultValue: '',
              maxOptionsSelected: '',
              options: [{ descripcion: '', codigo: '' }],
              isFormArray: isArray,
            });
          }
        }
      }
    }));
    //this.subscribers.push(suscripcion);
  }

  //Cambio del valor "key" en base al atribibuto "Title"
  onChangeKey(indice: number){
    var indiceTitle = indice+'.title';
    var indiceKey = indice+'.key';
    var dato = this.arrayForm.get(indiceTitle)?.value;
    var tmp = (dato.replace(/\s+/g, '_')).toLowerCase();
    tmp = tmp.replace(/á/gi,"a");
    tmp = tmp.replace(/é/gi,"e");
    tmp = tmp.replace(/í/gi,"i");
    tmp = tmp.replace(/ó/gi,"o");
    tmp = tmp.replace(/ú/gi,"u");
    tmp = tmp.replace(/ñ/gi,"n");
    this.arrayForm.get(indiceKey)?.patchValue(tmp);
  }

  //Devuelve un Boolean para renderizar o no en el Template dependiendo del valor de "type"
  changeType(index: number, name: string){
    const typeInput = this.arrayForm.get(`${index}.type.value`)?.value;
    switch(name){
      case 'placeholder':
        return typeInput == 'Text' || typeInput == 'Select' || typeInput == 'MultiSelect';
      case 'maxOptionsSelected':
        return typeInput == 'MultiSelect';
      case 'isFormArray':
        return typeInput == 'MultiSelect' || typeInput == 'MultiInput';
      case 'labels':
        return typeInput == 'Switch';
      case 'options':
        return typeInput == 'Select' || typeInput == 'MultiSelect' || typeInput == 'MultiInput';
      default: return false;
      }
  }

  //Devuelve un boolean para ser o no requerido de arrayOptions, dependiendo del valor de validators.type
  changeOptions(i: number, j:number){
    const typeInput = this.arrayForm.get(`${i}.type.value`)?.value;
    return typeInput == 'Select' || typeInput == 'MultiSelect' || typeInput == 'MultiInput' ?  true : false;
  }

  //Devuelve un boolean para ser o no requerido de arrayValidators, dependiendo del valor de validators.type
  changeValidators(i?: number, j?:number){
    const typeValidators = this.arrayForm.get(`${i}.validators.${j}.type`)?.value;
    if(typeValidators == "required"){
      this.arrayForm.get(`${i}.validators.${j}.value`)?.disable();
    }else{
      this.arrayForm.get(`${i}.validators.${j}.value`)?.enable();
    }
    return typeValidators == "required" ?  false : true;
  }

  //Devuelve un boolean para cambiar el valor de isFormArray
  changeisFormArray(index: number){
    const countArrayForm = this.arrayForm.value.length-1;
    const typeInput = this.arrayForm.get(`${index}.type.value`)?.value;
    if(typeInput == 'MultiSelect' || typeInput == 'MultiInput'){
      this.arrayForm.get(`${countArrayForm}.isFormArray`)?.patchValue(true);
    }else{
      this.arrayForm.get(`${countArrayForm}.isFormArray`)?.patchValue(false);
    }
  }

  //Elimina un formulario del formulario principal del formArray
  deleteLesson(lessonIndex: number) {
    this.subscribers[lessonIndex].unsubscribe();
    this.subscribers.splice(lessonIndex, 1);
    this.arrayForm.removeAt(lessonIndex);
  }

  //Elimina un formulario del formulario secundario del formArrayOptions
  deleteOptions(i: number, j: number){
    this.getArrayOptions(i).removeAt(j);
  }

  //Elimina un formulario del formulario secundario del formArrayValidators
  deleteValidators(i: number, j: number){
    this.getArrayValidators(i).removeAt(j);
  }

}