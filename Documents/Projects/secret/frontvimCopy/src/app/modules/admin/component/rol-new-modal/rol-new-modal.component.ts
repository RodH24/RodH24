import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RoleService } from '@app/data/services';
import { SideBarService } from '@core/services/sidebar/sidebar.service';

@Component({
  selector: 'app-rol-new-modal',
  templateUrl: './rol-new-modal.component.html',
  styleUrls: ['./rol-new-modal.component.scss'],
})
export class RolNewModalComponent implements OnInit {

  @Input() rol:any;


  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public formData: UntypedFormGroup;
  public disableGuardarButton:boolean=false;
  public routeList:Array<string>=[];
  public roleRequirementList:Array<any>=[];

  constructor(
    private formBuilder: UntypedFormBuilder,private roleService: RoleService, private sideBarService: SideBarService
  ) {
    this.formData = this.createFormData();
  }

  ngOnInit(): void {
    this.setInitData();
    this.getRoutesFromSidebar();
    this.getRolRequirementsList();
  }

  get getRequirements(){
    return this.formData.get('requirements') as UntypedFormArray
  }

 

  /****************************
   ******** EVENTS ************
   ****************************/ 

  public onCloseEmiter(emit: boolean = false): void {
    this.formData.reset();
    this.onCloseModal.emit(emit);
  }

  public onSaveData(): void {

    if (this.rol?._id && this.rol?._id !== '') {
      this.updateRol();
    } else {
      this.createRol();
    }
    this.formData.reset();
  }

  /****************************
  ******* DATABASE ***********
  ****************************/
  private createRol(): void {
    this.roleService.createRol(this.formData.getRawValue(), (isSuccess) => {
      if (isSuccess) {
        this.onCloseEmiter(true);
      }
    });
  }

  private updateRol(): void {
    this.roleService.updateRol(this.rol._id,this.formData.getRawValue(), (isSuccess) => {
      if (isSuccess) {
        this.onCloseEmiter(true);
      }
    });
  }

  /****************************
   ******* AUXILIAR ***********
   ****************************/
  public addRequirementControl(requirement?:any){
    const control=<UntypedFormArray>this.formData.controls['requirements'];
    const requirementForm = this.formBuilder.group({name:requirement?.name||'',
                                                    description:requirement?.description||'',
                                                    isMultiple:requirement?.isMultiple||''});
    control.push(requirementForm);
  }

  public removeRequirementControl(i:number){
    const control=<UntypedFormArray>this.formData.controls['requirements'];
    control.removeAt(i);
  }

  private createFormData(): UntypedFormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      mainRoute: ['', [Validators.required]],
      key: ['', [Validators.required]],
      hierarchyLevel: [10, [Validators.required]],
      requirements: this.formBuilder.array([])
    });
  }

  private setInitData(): void {
    if(this.rol){
      this.formData.patchValue({
        name: this.rol.name,
        mainRoute: this.rol.mainRoute,
        key: this.rol.key,
        hierarchyLevel: this.rol.hierarchyLevel
      })
      this.rol?.requirements.forEach((requirement:any) => {
        this.addRequirementControl(requirement);
      });    
    }else{
      this.formData.patchValue({
        name: '',
        mainRoute: '',
        key: '',
        hierarchyLevel: 10,
      })
    }
  }


  private getRoutesFromSidebar(){
    this.sideBarService.getSideBarStructure((structure:any)=>{
      this.routeList=structure.map((section:any)=>{return section.options.map((opt:any)=>{return opt.href.startsWith('/')?opt.href.slice(1):opt.href}) }).flat(1);
    });
    }

    private getRolRequirementsList():  Promise<boolean>{
      return new Promise( (resolve)=>{
      this.roleService.getRolRequirementsList(({list}:any) => {
        this.roleRequirementList = list;
        return resolve(true);
      })
    });
    }
}