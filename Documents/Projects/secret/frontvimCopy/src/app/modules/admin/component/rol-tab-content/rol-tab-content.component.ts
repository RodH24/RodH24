import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionService } from '@app/data/services';

@Component({
  selector: 'app-rol-tab-content',
  templateUrl: './rol-tab-content.component.html',
  styleUrls: ['./rol-tab-content.component.scss'],
})
export class RolTabContentComponent implements OnInit {
  public isLoading: boolean = false;
  @Input() actionList: Array<any> = [];
  public showNewRolModal:boolean=false;
  @Input() 
    rol:any;
    
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {

  }

  
  public collapseAll(collapse:boolean){
    this.actionList.map((action:any )=> {
      action.showChilds=!collapse;
    });
  }

  /****************************
   ******** Event **********
   ****************************/

  public onEditEmiter(rol:any){
    this.onEdit.emit(rol);
  }

}