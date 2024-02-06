import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SolicitudFunctions } from '@data/functions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-household-data',
  templateUrl: './step-household-data.component.html',
  styleUrls: ['./step-household-data.component.scss'],
})
export class StepHouseholdDataComponent implements OnInit {
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBackEvent: EventEmitter<any> = new EventEmitter<any>();
  //
  private readonly stepName: string = 'datosHogar';
  public formData: UntypedFormGroup;

  get isValidIntegrantes(): boolean {
    const mujeres = this.formData.get('integrantesMujer')?.value;
    const hombres = this.formData.get('integrantesHombre')?.value;
    return mujeres + hombres > 0;
  }

  constructor(private formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
    this.formData = this.formBuilder.group({
      numeroHogares: [1, [Validators.required, Validators.min(1)]],
      integrantesMujer: [0, [Validators.required, Validators.min(0)]],
      integrantesHombre: [0, [Validators.required, Validators.min(0)]],
      menores18: [false, [Validators.required]],
      mayores65: [false, [Validators.required]],
      hombreJefeFamilia: [false, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Restore data from local storage
    if (
      this.cedulaData &&
      this.cedulaData[this.stepName] &&
      Object.keys(this.cedulaData[this.stepName]).length > 0
    ) {
      this.formData.setValue(this.cedulaData[this.stepName]);
    }
  }

  public previousStep(): void {
    this.goBackEvent.emit(SolicitudFunctions.previousStep());
  }

  public nextStep(): void {
    if (!this.isValidIntegrantes) {
      return;
    }

    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.formData.value)
    );
  }
}
