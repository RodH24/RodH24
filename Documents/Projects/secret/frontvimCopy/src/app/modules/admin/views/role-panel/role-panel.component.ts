import { Component, OnInit } from '@angular/core';
import { ActionService,RoleService } from '@app/data/services';


@Component({
  selector: 'app-role-panel',
  templateUrl: './role-panel.component.html',
  styleUrls: ['./role-panel.component.scss'],
})
export class RolePanelComponent implements OnInit {
  public filteredWord: string = '';
  public rolList: Array<any> = [];
  public actionList:Array<any>=[];
  public selectedRol: any;
  
  public isLoading: boolean = false;

  // Modales
  public showNewRolModal:boolean=false;
  public showActionTreeModal:boolean=false;

  constructor(    private actionService: ActionService,
    private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.getRolList();
    
  }

  /****************************
   ******** EVENTS ************
  ****************************/

  public onUserFilter(filterWord: string): void {
    this.filteredWord = filterWord;
    this.getRolList();
  }

  public onCreateRol() {
    this.showNewRolModal = true;
  }

  public onEditActionTree() {
    this.showActionTreeModal = true;
  }

  public onCloseModal(isRefresh: boolean): void {
    this.selectedRol = null;
    this.showNewRolModal = false;
    this.showActionTreeModal = false;
    if (isRefresh) {
      this.getRolList();
    }
  }



  public onEdit(rol: any) {
    this.selectedRol = rol;
    this.showNewRolModal = true;
  }

 
  /****************************
   ******* DATABASE ***********
   ****************************/

  private getRolList(): void {
    this.isLoading = true;
    this.roleService.getRolList(
      (response: any) => {
        const { list } = response;
        this.rolList = list;
        this.isLoading = false;
        this.rolList.sort((a,b) => a.hierarchyLevel - b.hierarchyLevel)
        this.getActionList();
      }
    );
  }

    /****************************
   ******** Database **********
   ****************************/
   private getActionList(): void {
    this.isLoading = true;
    this.actionService.getActionList(
      (response: any) => {
        const { list } = response;
        this.actionList = list;
        
        this.isLoading = false;
        this.actionList.map((action:any )=> {
          action.showChilds=true;
          action.hasChilds=false;
          if(this.actionList.some((subaction:any )=> {return subaction.parent==action._id;})){
            action.hasChilds=true;
          }
        });
        this.rolList.forEach((rol:any)=>rol['actionList']=JSON.parse(JSON.stringify(this.actionList)));
      }
    );
  }


}
  
