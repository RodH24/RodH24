import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { PeuService } from '@data/services';
import { EncryptFunctions } from '@app/data/functions';
import { SolicitudPanelFunctions } from '@app/data/functions';

@Component({
  selector: 'peu-dashboard',
  templateUrl: './peu-dashboard.component.html',
  styleUrls: ['./peu-dashboard.component.scss'],
})
export class PeuDashboardComponent implements OnInit {
  public paginator: PaginatorEntity = new PaginatorEntity();
  public token: TokenEntity;
  public session: SessionEntity;
  public showSelect: boolean = true;
  public selectedQ: any;

  public sessionQlist: Array<any> = [];
  public types_of_support: Array<any> = [];
  public notData: boolean = false;

  constructor(
    private router: Router,
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private peuService: PeuService,
  ) {
    this.session = new SessionEntity();
    this.token = new TokenEntity(this.cookieService);
    this.getModalitiesList();
  }

  ngOnInit(): void {
    this.getSupportList();
  }

  public getModalitiesList() {
    let tempSupports = this.session.activeRol.apoyos;

    // inserts default value 
    this.sessionQlist.unshift({
      clave: '-',
      name: 'Todos los Q'
    });

    if(tempSupports){
      // create duplicate objects 
      for (let m of tempSupports) {
        let actualKey = m.clave.split('-')[0];
        this.sessionQlist.push({
          clave: actualKey,
          name: ''
        })
      }
    }

    // remove duplicate values 
    this.sessionQlist = this.sessionQlist.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.clave === value.clave && t.name === value.name
      ))
    )
    
    // this validates if only has 1 option and define this like the main option 
    if(this.sessionQlist.length == 2){
      this.selectedQ = this.sessionQlist[1];
    }else{
      this.selectedQ = this.sessionQlist[0];
    }
  }

  public getSupportList() {
    
    this.peuService.getSupportList(SolicitudPanelFunctions.validateKeyOnSelectedQPEU(this.selectedQ),
      this.paginator.page,
      ({ list, total }) => {
        if (list.length == 0) {
          this.types_of_support = list;
          this.paginator.total = 0;
          this.notData = true;
          this.spinner.hide();
        } else {
          this.notData = false;
          this.types_of_support = list;
          this.paginator.total = total;
          // this.filterFoliosList();
          this.spinner.hide();
        }
      }
    );
  }

  public updateSelectedQ(e: any) {
    this.selectedQ = { clave: e.target.value, name: '' }
    this.getSupportList();
  }

  public onSelectCard(event: any) {
    const encrypt = EncryptFunctions.encryptObj(event);
    sessionStorage.setItem('_', encrypt);
    this.router.navigate(['peu/panel-detail']);
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getSupportList();
  }

}
