import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlStepperRequestEventType } from '@data/types/ControlStepperRequestEventType';
import { generateCedulaTemplateStepList } from '@app/data/constants/cedula';
import { ProgramType } from '@app/data/types';
import { ApplicationStorageEntity } from '@app/data/entities';

@Component({
  selector: 'app-shared-cedula',
  templateUrl: './cedula.component.html',
  styleUrls: ['./cedula.component.scss'],
})
export class CedulaComponent implements OnInit {
  @ViewChild('householdData') householdData!: TemplateRef<any>;
  @ViewChild('healthServiceData') healthServiceData!: TemplateRef<any>;
  @ViewChild('healthIssues') healthIssues!: TemplateRef<any>;
  @ViewChild('educationData') educationData!: TemplateRef<any>;
  @ViewChild('incomeData') incomeData!: TemplateRef<any>;
  @ViewChild('expensesData') expensesData!: TemplateRef<any>;
  @ViewChild('foodData') foodData!: TemplateRef<any>;
  @ViewChild('housingData') housingData!: TemplateRef<any>;
  @ViewChild('houseAppliances') houseAppliances!: TemplateRef<any>;
  @ViewChild('perceptionData') perceptionData!: TemplateRef<any>;
  @ViewChild('uploadStepper') uploadStepper!: TemplateRef<any>;
  @ViewChild('successRegister') successRegister!: TemplateRef<any>;
  //
  @Input() isInternal: boolean = false;
  @Input() needCedula: boolean = true;
  @Input() lastStepOfSharedCedula: string = '';

  @Output() emitData: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBackEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  //
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  public templateStepList: Array<any> = generateCedulaTemplateStepList(
    this,
    this.isInternal
  );
  public folio = '';
  public currentStep: number = 0;
  public programData: ProgramType;
  public cedulaData: any = {
    solicitudImpulso: true,
    cedulaImpulso: true,
  };

  constructor() {
    this.programData = this.applicationStorage.program;
  }

  get stepperStep(): Array<number> {
    if (this.needCedula) {
      return [].constructor(this.templateStepList.length);
    }
    return [10, 11, 12];
  }

  ngOnInit(): void {
    this.cedulaData = this.applicationStorage.cedula;
    if (!this.needCedula) {
      this.emitData.emit(this.cedulaData);
      return;
    }
    this.currentStep = this.needCedula ? 0 : 10;
    
  }
  
  ngAfterViewInit() {
      this.templateStepList = generateCedulaTemplateStepList(
      this,
      this.isInternal
      );
    if(this.lastStepOfSharedCedula == 'last'){
      this.currentStep = 9;
    }
  }

  changeStepEvent(event: ControlStepperRequestEventType): void {
    this.goBack.emit(event);
  }

  /*************************
   ********* EVENTS ********
   ***************************/

  onChangeContent(event: ControlStepperRequestEventType): void {
    if (event.isNext === true) {
      this.cedulaData[event.data.name] = event.data.value;
      this.applicationStorage.cedula = this.cedulaData;
      if (event.step_action === -1) {
        this.endCedulaQuestions();
        return;
      }

    }
    this.changeStep(event.step_action);
  }

  public onApplicationCreate(folio: string): void {
    if (folio !== '') {
      this.folio = folio;
      this.changeStep();
    }
  }

  /*************************
   ******** AUXILIAR *******
   ***************************/
  private changeStep(goToStep: number = 1): void {
    window.scroll(0, 200);
    this.currentStep += goToStep;
  }

  private endCedulaQuestions() {
    if (this.isInternal) {
      this.emitData.emit(this.cedulaData);
    } else {
      this.changeStep(); // show upload files step
    }
  }
}
