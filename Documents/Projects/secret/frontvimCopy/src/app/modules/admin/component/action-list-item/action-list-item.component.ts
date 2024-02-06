import { Component, Input,Output, OnInit,EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RoleService,ActionService } from '@app/data/services';

@Component({
  selector: 'app-action-list-item',
  templateUrl: './action-list-item.component.html',
  styleUrls: ['./action-list-item.component.scss']
})
export class ActionListItemComponent implements OnInit {
  public clMarginLeft: string="ml-1";
  public levelActions:any=[];
  public rolActions:any;
  public showChilds:boolean=true;
  public nLevelChilds=0;
  public uniqueHex=0;
  public formData: UntypedFormGroup;

  constructor( private formBuilder: UntypedFormBuilder,private roleService: RoleService,private actionService: ActionService) { 
    this.formData = this.formBuilder.group({
      nLevel: [{value:'', disabled: true}, [Validators.required]],
      nameId: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      hexId: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]*$/),Validators.minLength(12),Validators.maxLength(12)]],
      name:['', [Validators.required]],
    });
   }

  @Input() nLevel:number=1;
  @Input() editMode:boolean=false;
  @Input() parent_id:any=null;
  @Input() actionList:any;
  @Input() rol:any;
  @Input() childVisible:boolean=true;
  @Output() uploaded = new EventEmitter<string>();
  @Output() onUpdatedActionList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onNewChild: EventEmitter<boolean> = new EventEmitter<boolean>();


  ngOnInit(): void {
    this.removeAllNewChilds();
      this.updatelevelActions();    
      this.nLevelChilds=this.nLevel+1;
      this.formData.patchValue({
        nLevel: 'n'+(this.nLevelChilds),
        nameId: "",
        hexId: "",
        name:""
      })
  }

  /****************************
   ******** Functions *********
   ****************************/
  private removeAllNewChilds(){
    this.actionList.map((action:any)=>delete action['newChild']);
  }
   
  public addChild(action:any){
    this.removeAllNewChilds();
    action['newChild']=true;
    this.formData.patchValue({
      nLevel: 'n'+(this.nLevelChilds),
      nameId: "",
      hexId: ""
    })
    this.newChildEmiter();
  }

  public updatelevelActions(){
    this.levelActions=this.actionList.filter((action:any) => { return action.parent==this.parent_id;});
      if(this.rol?.roleActions && this.levelActions){
        this.rolActions=this.actionList.filter((action:any) => { return this.rol.roleActions.includes(action._id);});
        this.levelActions.map((levelAction:any )=> {
          levelAction.canAccess=false;
          levelAction.assigned=false;
          if(this.rolActions.some((rA:any )=> rA.ancestors.includes(levelAction._id)) ||
            this.rolActions.some((rA:any )=> rA._id == levelAction._id)){
              levelAction.canAccess=true;
            }
          if( this.rolActions.some((rA:any )=> rA._id == levelAction._id)){
              levelAction.assigned=true;
            }
          return levelAction;
        });

      }
  }

  /****************************
   ******** EVENTS ************
   ****************************/
  public setUniqueHex(){
    var blake = require('blakejs');
    this.formData.get('hexId')?.setValue( blake.blake2bHex(new Date().toLocaleString(), new Array(), 6));
  }

   public onClickSwitch(actionId : string,rol : any){
    this.changeActionRolPermission(rol,actionId);
  }

  public actionCollapse(actionId:string){
    this.actionList.map((action:any )=> {
      action.showChilds=action._id==actionId?!action.showChilds:action.showChilds;
    });
  }

  public onSaveAction(parentAction:any){
    const data:any=this.formData.getRawValue();
    const _id=data.nLevel+'_'+data.nameId+'_'+data.hexId;
    this.saveAction(parentAction._id,_id,data.name);
    this.updateActionList();
  }

  public newChildEmiter(){
    this.onNewChild.emit(true);
  }

  public updateActionList(){
    this.onUpdatedActionList.emit(true);
  }

  public updateParent(){
    this.updatelevelActions();
    this.uploaded.emit();
  }


  /****************************
   ******** DATABASE **********
   ****************************/
  
  private changeActionRolPermission(rol:any,actionId:string): void {
    this.roleService.addRemoveActionRol(
      rol._id,actionId,
      (response: any) => {
        if(response.canAccess){
          this.rol.roleActions.push(actionId);
        }
        else{
            this.rol.roleActions.forEach((element:string,index:number)=>{
              if(element==actionId) delete this.rol.roleActions[index];
           });

        }
        this.updateParent();
      }
    );
  }

   private saveAction(parent:string|null,_id:string,name:string){
    this.actionService.createAction(parent,_id,name, (response: any) => { });
  }

}