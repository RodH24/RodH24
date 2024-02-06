import { Component, OnInit } from '@angular/core';
import { PaginatorEntity, TokenEntity } from '@app/data/entities';
import { ApplicationService } from '@app/data/services';
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-solicitudlote',
  templateUrl: './solicitudlote.component.html',
  styleUrls: ['./solicitudlote.component.scss'],
})
export class SolicitudloteComponent implements OnInit {
  public token: TokenEntity;
  public file:any={};
  public arrayBuffer:any={};
  public fileList:any={};
  private paginator:PaginatorEntity=new PaginatorEntity();
  public configSelected: Array<any> = [];
  public filterWord:string="";
  
  constructor(
    private cookieService: CookieService,
    private applicationService: ApplicationService
  ) {
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {}

  public onGenerateLoteSolicitudesPDF() {
    this.applicationService.downloadSolicitudesMultiple(
      null,
      this.configSelected[0], 
      this.filterWord.length ? this.filterWord : null,
      null,
      null,
      ({ list, total }) => {
        if (!total) {
          this.paginator.total = 0;
        } else {
          this.paginator.total = total;
        }
      }
    );
  }


  /************* Eventos *************/
  // Event when clicking on select of support types 
  public updateSelectedApoyo(apoyoEvent: any) {
    this.configSelected = apoyoEvent;
    /*if (apoyoEvent[1] === null) {
      // this.refreshData();
    } else {
      this.configViewMiniKpi(apoyoEvent);
    }
    // this.getkpiDataList()
  */
  }

  public onSelect(event:any){
    this.file= event.addedFiles[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];     
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
    }    
  
  }

  public onRemove(){

  }

}
