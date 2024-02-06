import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TokenEntity, SessionEntity } from '@app/data/entities';
import { AcuseService, ProgramService } from '@app/data/services';
import { CookieService } from 'ngx-cookie-service';
import { generateTemplateList } from '@app/data/constants/formatos';

@Component({
  selector: 'app-prefolio',
  templateUrl: './prefolio.component.html',
  styleUrls: ['./prefolio.component.scss'],
})
export class PrefolioComponent implements OnInit, AfterViewInit {
  @ViewChild('firmaAcuse') firmaAcuse!: TemplateRef<any>;
  @ViewChild('reimpresionFirmaAcuse') reimpresionFirmaAcuse!: TemplateRef<any>;
  @ViewChild('solicitudCedulaBlanco') solicitudCedulaBlanco!: TemplateRef<any>;
  @ViewChild('solicitudBlanco') solicitudBlanco!: TemplateRef<any>;
  //
  private sessionEntity = new SessionEntity();
  private vigencia: number = this.sessionEntity.viewingYear;
  public templateList: any = generateTemplateList(this, this.vigencia);
  public currentTemplate: any = '';
  //
  public token: TokenEntity;
  public session: any;
  public permissions: any;
  public formData: UntypedFormGroup;
  public formDataReprint: UntypedFormGroup;
  public userModalidadesList: Array<any> = [];
  public arrModalidades: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private formBuilder: UntypedFormBuilder,
    private acuseService: AcuseService,
    private programService: ProgramService
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
    this.formData = this.formBuilder.group({
      modalidad: ['', [Validators.required]],
      quantity: [
        '',
        [Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern('^[0-9]*$'),
        ],
      ],
    });

    this.arrModalidades = !(this.session.activeRole.apoyos)//isadmin
      ? ['Q'] :
      this.userModalidadesList.map(function (item: string) { return item.replace('-', ''); });

    this.formDataReprint = this.formBuilder.group({
      folio: [
        '',
        [Validators.required,
        // Validators.pattern('^[F|S|A|W|I][2][0-9][0-9][0-9](' +
        //   this.arrModalidades.join('|') +
        //   ')[0-9]*$'),
        ],
      ],
    });

  }

  ngOnInit(): void {
    this.permissions = this.session.permissionsList;
    this.getUserModalidades();

  }


  private getUserModalidades() {
    if (this.session.activeRole.apoyos) {//isadmin isenlace
      this.setModalidadesUserList();
    } else {
      this.setModalidadesAdminList();
    }
  }

  private setModalidadesAdminList(): void {
    //page,isEnabled,isPeu,word,isFilter,type
    this.programService.list(
      null,
      true,
      null,
      null,
      true,
      'modalidad',
      null,
      (list: any) => {
        this.userModalidadesList = [...new Set(list.map((element: any) => element.clave))];
        this.setValidationDataReprint();
      });
  }

  private setModalidadesUserList(): void {
    this.userModalidadesList = this.session.activeRole.apoyos.map((apoyo: any) => apoyo.clave.substring(0, 8)).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
    this.setValidationDataReprint();
  }

  private setValidationDataReprint(): void {
    this.arrModalidades = //!(this.userModalidadesList)  ? ['Q']: 
      this.userModalidadesList.map(function (item: string) {
        //return item.replace('-', '');
        return item.split("-")[0];
      });
    this.formDataReprint?.get('folio')?.setValidators([
      Validators.required,
      Validators.pattern(
        '^[F|S|A|W|I][2][0-9][0-9][0-9](' +
        this.arrModalidades.join('|') +
        ')[0-9]*$'
      ),
    ]);
  }

  ngAfterViewInit() {
    this.templateList = generateTemplateList(this, this.vigencia);
    this.route.params.subscribe((params) => {
      this.currentTemplate = this.templateList[params['type']].template;
    });
  }

  public onGenerate() {
    this.generateFile();
  }

  public onDownloadFormat(isCedula: boolean = false) {
    const url = `../../../../../assets/files/${isCedula ? 'CedulaImpulso' : 'SolicitudImpulso'
      }.pdf`;
    window.open(url, '_blank');
  }

  //AnexoSolicitud2023

  public onDownload2023Format() {
    const url = `../../../../../assets/files/AnexoSolicitud${this.vigencia}.pdf`;
    window.open(url, '_blank');
  }

  public onReprint() {
    const folio = this.formDataReprint.get('folio')?.value;
    if (folio) {
      this.acuseService.getAcuseByFolio(folio);
    }
  }

  private generateFile() {
    const modalidad = this.formData.get('modalidad')?.value;
    const quantity = this.formData.get('quantity')?.value;
    this.formData.get('quantity')?.setValue(0);
    this.acuseService.getPrefolioFile(modalidad, quantity);
  }

}