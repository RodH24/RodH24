import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActionService } from '@app/data/services';


@Component({
  selector: 'app-action-tree-modal',
  templateUrl: './action-tree-modal.component.html',
  styleUrls: ['./action-tree-modal.component.scss'],
})
export class ActionTreeModalComponent implements OnInit {
  public filteredWord: string = '';
  public rolList: Array<any> = [];
  public selectedRol: any;
  public newChild:boolean=false;
  public isLoading: boolean = false;
  public formData: UntypedFormGroup;

  // Modales
  public showNewRolModal:boolean=false;


  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() title:string="";
  @Input() actionList:any=null;
  
  constructor(private formBuilder: UntypedFormBuilder,private actionService:ActionService) {
    this.formData = this.formBuilder.group({
      nLevel: [{value:'', disabled: true}, [Validators.required]],
      nameId: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      hexId: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]*$/),Validators.minLength(12),Validators.maxLength(12)]],
      name:['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.removeAllNewChilds();
    this.formData.patchValue({
      nLevel: 'n'+(1),
      nameId: "",
      hexId: "",
      name:""
    })
  }

  /****************************
   ******** FUNCTIONS *********
  ****************************/
   private removeAllNewChilds(){
    this.actionList.map((action:any)=>delete action['newChild']);
  }

  public removeChild(){
    this.newChild=false;
  }

  public addChild(){
    this.removeAllNewChilds();
    this.newChild=true;
    this.formData.patchValue({
      nLevel: 'n'+(1),
      nameId: "",
      hexId: ""
    })
  }


  /****************************
   ******** EVENTS ************
  ****************************/
   public setUniqueHex(){
    var blake = require('blakejs');
    this.formData.get('hexId')?.setValue( blake.blake2bHex(new Date().toLocaleString(), new Array(), 6));
  }

   public onSaveAction(){
    const data:any=this.formData.getRawValue();
    const _id=data.nLevel+'_'+data.nameId+'_'+data.hexId;
    this.saveAction(null,_id,data.name);
    this.onCloseModal.emit(true);
  }

   public onCloseEmiter(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

   public collapseAll(collapse:boolean){
    this.actionList.map((action:any )=> {
      action.showChilds=!collapse;
    });
  }

  /****************************
   ******** DATABASE **********
   ****************************/
  private saveAction(parent:string|null,_id:string,name:string){
    this.actionService.createAction(null,_id,name, (response: any) => { });
  }

}
  
