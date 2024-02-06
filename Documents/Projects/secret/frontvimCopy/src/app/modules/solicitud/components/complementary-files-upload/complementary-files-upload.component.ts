import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
//import { EncryptFunctions } from '@app/data/functions';
import { NewProgram, ProgramType } from '@app/data/types';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'complementary-files-upload',
  templateUrl: './complementary-files-upload.component.html',
  styleUrls: ['./complementary-files-upload.component.scss'],
})
export class ComplementaryFilesUploadComponent implements OnInit {
  @Input() programData: ProgramType = NewProgram;
  public readonly standardDocuments: Array<string> = [
    'CURP',
    'Comprobante de Domicilio',
  ];
  public readonly programDocuments: Array<any>;
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  public files: {
    // [key: string]: { [key: string]: File };
    [type: string]: {
      [fileName: string]: {
        fechaVigencia: any;
        file: File;
      };
    };
  } = {
    estandar: {},
    especifico: {},
  };

  constructor(private toastr: ToastrService) {
    this.programDocuments = this.getProgramDocuments();
  }

  ngOnInit(): void {}

  /**
   * Handle previous step event and emit the step data
   */
  previousStep(): void {
    this.changeContent.emit({
      isNext: false,
      step_action: -1,
      data: {
        name: '',
        value: '',
      },
    });
  }

  /**
   * Handle next step event and emit the step data
   */
  public nextStep(): void {
    const fileObject =  this.getFilesArray();
    if(fileObject) {
      const needCitizenFile = this.programData.modalidad?.cedula;
      this.changeContent.emit({
        isNext: true,
        step_action: needCitizenFile ? -1 : 1,
        data: {
          name: 'datosDocumentos',
          value: this.getFilesArray(),
        },
      });
    } else {
      this.toastr.warning('La fecha de vencimiento es requerida');
    }
  }

  /**
   * Dropzone on file select event handler
   * @param {any} e Dropzone event, has te added files
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @param {string} name file name
   */
  public onSelect(e: any, type: string = 'estandar', name = 'CURP'): void {
    const newItem = {
      fechaVigencia: '',
      file: e.addedFiles[0],
    };
    this.files[type][name] = newItem;
  }

  /**
   * Dropzone on remove file event handler
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @param {string} name file name
   */
  public onRemove(type: string = 'estandar', name: string = 'CURP'): void {
    delete this.files[type][name];
  }

  /**
   * Controls the "next button" disabled property.
   * Is disabled when not all the files are uploaded
   * @returns {boolean}
   */
  public isDisabled(): boolean {
    return (
      Object.keys(this.files).length <
      this.programDocuments.length + this.standardDocuments.length
    );
  }

  /**
   * Format the files array to send in the emitter
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @returns Files array
   */
  private getFilesArray():
    { data: any; files: Array<{ name: string; value: File }> }
    | boolean {
    const result: { data: any; files: Array<{ name: string; value: File }> } = {
      data: {
        estandar: [],
        especifico: [],
      },
      files: [],
    };

    for (const type in this.files) {
      for (const file in this.files[type]) {
        const fileKey = `${type}_${file.replace(/\s/g, '')}`;
        if(this.files[type][file].fechaVigencia === '') {
          return false;
        }
        result.data[type].push({
          llave: fileKey,
          nombre: file,
          uid: '',
          fechaVigencia: this.files[type][file].fechaVigencia.toString(),
        });
        result.files.push({
          name: fileKey,
          value: this.files[type][file].file,
        });
      }
    }
    return result;
  }

  /**
   * Get the program specific documen list from program data
   * @returns Array
   */
  private getProgramDocuments(): Array<any> {
    return this.programData.modalidad?.anexos ?? [];
  }
}
