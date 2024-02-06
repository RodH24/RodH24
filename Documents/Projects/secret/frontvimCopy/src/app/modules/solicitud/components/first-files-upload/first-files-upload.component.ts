import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SolicitudFunctions } from '@app/data/functions';

@Component({
  selector: 'first-files-upload',
  templateUrl: './first-files-upload.component.html',
  styleUrls: ['./first-files-upload.component.scss'],
})
export class FirstFilesUploadComponent implements OnInit {
  @Input() inputData!: any;
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  public files: { [key1: string]: File } = {};

  constructor() {}

  ngOnInit(): void {}

  /**
   * Dropzone on file select event handler
   * @param {any} e Dropzone event, has te added files
   * @param type
   */
  public onSelect(e: any, type: string = 'curp'): void {
    this.files[type] = e.addedFiles[0];
  }

  /**
   * Dropzone on remove file event handler
   * @param {string} type Control the file type (CURP or ADDRESS)
   */
  public onRemove(type: string = 'curp'): void {
    delete this.files[type];
  }

  /**
   * Controls the "next button" disabled property.
   * Is disabled when not all the files are uploaded
   * @returns {boolean}
   */
  public isDisabled(): boolean {
    return Object.keys(this.files).length < 2;
  }

  previousStep(): void {
    this.changeContent.emit({
      isNext: false,
      step_action: -1,
      data: {
        name: '',
        value: {},
      },
    });
  }

  nextStep(): void {
    let next_step = SolicitudFunctions.isAdult(
      this.inputData.datosCurp.fechaNacimientoTexto
    )
      ? 2
      : 1;

    this.changeContent.emit({
      isNext: true,
      step_action: next_step,
      data: {
        name: 'standar', // cannot change, control name
        value: [
          { name: 'curp', file: this.files.curp },
          { name: 'comprobante de domicilio', file: this.files.address },
        ],
      },
    });
  }
}
