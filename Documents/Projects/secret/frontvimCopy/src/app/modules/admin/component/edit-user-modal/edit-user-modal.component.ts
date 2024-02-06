import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DependencyService, ProgramService, RoleService, UserService, VentanillaService } from '@app/data/services';
import { User, newUser, Role, RoleRequirementsOptions, DependencyType, ProgramType, UserRole } from '@app/data/types';
import * as moment from 'moment';
import { runInThisContext } from 'vm';

//type RolesObj = { [key: string]: UserRole }
type RolesArr = { [key: string]: Array<{roleData:UserRole,tabDescription:string,editRoleData:boolean,ShowRoleNoEditableData?:boolean}>} 
@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() user: User = newUser;
  @Input() readyToLoadTab: boolean = false;
  //
  public rolesViewArr: RolesArr = {};
  public formData: UntypedFormGroup;
  public formRequirements: { [key: string]:UntypedFormGroup};
  public roleShowData: any = {};
  public roleNoEditableData: any = {};
 
  public selectedRole: any = null;
  //
  public apoyosList: Array<any> = [];
  public clavesQList: Array<ProgramType> = [];
  public roleList: Array<Role> = [];
  public modalidadList: Array<ProgramType> = [];
  public dependencyList: Array<DependencyType> = [];
  public ventanillaList: Array<any> = [];
  public listReady: any = [];
  //
  public formConfigurationArray: {[key: string]:Array<any> }= {};
  public isEditUserData: boolean = false;
  public isEditRoleData: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private roleService: RoleService,
    private programService: ProgramService,
    private userService: UserService,
    private dependencyService: DependencyService,
    private ventanillaService: VentanillaService
  ) {
    this.getRoleList();
    this.formRequirements = {};
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dependencia: ['', [Validators.required]],
      oficina: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.createRolesObject();
    this.getLists();
    this.fillUserDataForm();
  }

  getInRole(role: Role): boolean {
    return (role._id in this.rolesViewArr);
  }

  isDeletedRole(roleViewObj: any): boolean {
    return roleViewObj?.isDeleted || false;
  }


  private getLists(): void {
    Promise.all([
      this.getRoleList(),
      this.getDependencyList(),
      this.getVentanillaList(),
      this.getApoyosList(),
      this.getApoyosPEUList(),
      this.getClavesQList(),
      this.getClavesQPEUList()]).then(() => { this.onTabSelect(this.selectedRole) });
  }


  private createRolesObject(): void {
    const rolesViewArr: RolesArr = {};
    this.user.roles.forEach(element => {
      let titulo:string="";
      titulo+=element.vigencia.inicio.length>0?moment(element.vigencia.inicio).utc().format('DD-MM-YYYY'):"Indefinido";
      titulo+=" :: ";
      titulo+=element.vigencia.fin?moment(element.vigencia.fin).utc().format('DD-MM-YYYY'):"Indefinido";
      let tmpArrItem:{roleData:UserRole,tabDescription:string,editRoleData:boolean}={roleData:element,tabDescription:titulo,editRoleData:false};
      if(!element.isDeleted)
        (rolesViewArr[element.uid] ?? (rolesViewArr[element.uid] = [])).push(tmpArrItem);
    })
    this.rolesViewArr = rolesViewArr;
  }

  private fillUserDataForm(): void {
    const office = (this.user.oficina && this.user.ventanilla) ? this.user.oficina + "|" + this.user.ventanilla : null;
    this.formData.patchValue({
      name: this.user.fullName,
      email: this.user.email,
      dependencia: this.user.dependencia._id,
      oficina: office
    })
  }

  /**********************************
  ************ EVENTS ***************
  **********************************/
  public RolesArrHasNewRole(role:Role): boolean {
    return (this.rolesViewArr[role._id]||[]).some(roleViewObj=>roleViewObj.editRoleData) ?? false;
  }

  public onEditUserData(): void {
    this.isEditUserData = true;
  }

  public onSaveUserData(): void {
    this.isEditUserData = false;
    this.updateUser();
  }

  public onClose(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

  public onSaveRoleData(roleViewObj: any): void {
    let formWithStatus = this.formRequirements[roleViewObj.roleData.arrId].getRawValue();
    formWithStatus['status'] = "enabled";
    this.updateRoleUser(roleViewObj, this.formRequirements[roleViewObj.roleData.arrId].getRawValue());
  }

  public onCancelRoleData(roleViewObj:any): void {
    if(roleViewObj.roleData.arrId=="FakeId")
      this.rolesViewArr[roleViewObj.roleData.uid]=(this.rolesViewArr[roleViewObj.roleData.uid].filter(roleViewObj => {
        return roleViewObj.roleData.arrId!="FakeId"
      })??[]);
    else
    roleViewObj.editRoleData=false;
    
    
  }

  public onTabSelect(role: Role): void {

    this.isEditRoleData = false;
    this.updateRoleShowData(role);
    this.updateRequirementsForm(role);
    this.selectedRole = role;
  }


  public onEditRoleData(role:any): void {
    role.editRoleData=true;
    //this.isEditRoleData = true;
    document.getElementsByClassName('ant-modal-wrap')[0].scrollTo(0, 0);
  }

  public onChangeRoleStatus(role: any, statusCve: string): void {
    let formWithStatus = { status: statusCve };
    this.updateRoleUser(role, formWithStatus);

  }

  public addRoleTab(role:Role){
    
    let userRole: UserRole={} as UserRole;
    userRole["arrId"]="FakeId";
    userRole["uid"]=role._id;
    
    (this.rolesViewArr[role._id] ?? (this.rolesViewArr[role._id] = [])).push({roleData:userRole,tabDescription:"Pendiente",editRoleData:true});
    this.updateRequirementsForm(role);
  }
  /**********************************
  *********** DATABASE **************
  **********************************/
  private async updateRoleUser(roleViewObj: any, newData: any) {
    if (roleViewObj.roleData.arrId!=="FakeId" || this.isDeletedRole(roleViewObj)) {
      if (this.isDeletedRole(roleViewObj))
        newData['status'] = "enabled";
      this.userService.updateUserRol(this.user._id, roleViewObj.roleData.arrId, "replace", newData, (isSuccess: boolean) => {
        this.onClose(true);
      });
      return;
    }

    this.userService.addUserRol(this.user._id, roleViewObj.roleData.uid, newData, (isSuccess: boolean) => {
      this.onClose(true);
    });
    return;

  }

  private updateUser() {
    this.userService.updateUserData(this.user._id, this.formData.getRawValue(), (success: any) => {
      this.onClose(true);
    })
  }

  private getRoleList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.roleService.getRolList(({ list }: any) => {
        this.roleList = list;

        return resolve(true);
      })
    });
  }

  private getDependencyList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.dependencyService.list(true, (list) => {
        this.dependencyList = list;
        return resolve(true);
      })
    });
  }

  private getVentanillaList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.ventanillaService.list(null, false, null, true, null, null, (list: any) => {
        this.ventanillaList = list;
        return resolve(true);
      })
    });
  }


  private getClavesQList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.programService.list(
        null,
        true,
        false,
        null,
        true,
        'claveQ',
        null,
        (list: any) => {
          this.clavesQList = [...this.clavesQList, ...list];
          return resolve(true);
        })
    });
  }

  private getClavesQPEUList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.programService.list(
        null,
        true,
        true,
        null,
        true,
        'claveQ',
        null,
        (list: any) => {
          this.clavesQList = [...this.clavesQList, ...list];
          return resolve(true);
        })
    });
  }


  private getApoyosList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.programService.list(
        null,
        true,
        false,
        null,
        true,
        null,
        null,
        (list: any) => {
          this.apoyosList = [...this.apoyosList, ...list];
          return resolve(true);
        })
    });
  }

  private getApoyosPEUList(): Promise<boolean> {
    return new Promise((resolve) => {
      this.programService.list(
        null,
        true,
        true,
        null,
        true,
        null,
        null,
        (list: any) => {
          this.apoyosList = [...this.apoyosList, ...list];
          return resolve(true);
        })
    });
  }

  /**********************************
  *********** AUXILIAR **************
  **********************************/

  public async updateRequirementsForm(role: Role): Promise<void> {
        const roleRequirements = role?.requirements || [];
    
    for (const roleViewObj of this.rolesViewArr[role._id]||[]){
      const formControls: any = {};
      const formConfigurationArray: Array<any> = [];
      for (const element of roleRequirements) {
        formConfigurationArray.push({
          inputName: element.name,
          formControl: element.name,
          placeholder: `${element.name} de Usuario`,
          isMultiple: element.isMultiple,
          ... await this.getConfigBasedOnRequirement(element.name),
        })

        formControls[element.name] =[this.getFormItemValue(roleViewObj, element.name, element.isMultiple), [Validators.required]];
      }

      this.formConfigurationArray[roleViewObj.roleData.arrId] = formConfigurationArray

      this.formRequirements[roleViewObj.roleData.arrId] = this.formBuilder.group(formControls)
    }
  }

  private getFormItemValue(roleViewObj: any, itemKey: RoleRequirementsOptions, isMultiple: boolean): Array<string> | string {
    if (roleViewObj && roleViewObj?.arrId!=="FakeId") {
      const roleData = !this.isDeletedRole(roleViewObj["roleData"]) ? roleViewObj["roleData"][itemKey] : [];
      if (isMultiple) return roleData ?? []
      return roleData ? roleData : '';
    }
    return isMultiple ? [] : '';
  }

  private async getConfigBasedOnRequirement(requeriment: RoleRequirementsOptions): Promise<any> {
    switch (requeriment) {
      case 'clavesQ':
        return {
          options: await this.clavesQList,
          groupLabelFunc: (item: any, index: any) => (`${item.dependencia.siglas}: ${item.nombre} ${index}`),
          optionLabelFunc: (item: any) => (`${item.clave}: ${item.nombre}`),
          optionValueFunc: (item: any) => (`${item._id}`),
          optionDisableFunc: (item: any) => ({ disabled: true })
        }
      case 'apoyos':
        return {
          options: await this.apoyosList,
          groupLabelFunc: (item: any, index: any) => (`${item.clave}: ${item.nombre} ${index}`),
          optionLabelFunc: (item: any) => (`${item.apoyo.clave}: ${item.apoyo.nombre}`),
          optionValueFunc: (item: any) => (`${item.apoyo.clave}`),
          optionDisableFunc: (item: any) => ({ disabled: true })
        }
      case 'dependencias':
        return {
          options: this.dependencyList,
          groupLabelFunc: (item: any, index: any) => (`${item.nombre}: ${item.siglas}`),
          optionLabelFunc: (item: any) => (`${item.siglas}: ${item.nombre}`),
          optionValueFunc: (item: any) => (`${item._id}`)
        }
    }
  }

  private updateRoleShowData(role: Role): void {
    this.roleShowData = null;
    const parent=this;

    if(this.rolesViewArr[role._id]){
      this.rolesViewArr[role._id].forEach ( function(roleViewObj)
      {
        if (!roleViewObj.roleData.isDeleted && !(roleViewObj.roleData.arrId=="FakeId")) {
          parent.userService.userRoleData(parent.user._id, roleViewObj.roleData.arrId, response => {
            parent.roleShowData = response;
            parent.updateNoEditableData(roleViewObj);
          });
        }
      });
    }/*
    if (this.getInRole(role) && !this.isDeletedRole(role)) {
      this.userService.userRoleData(this.user._id, role._id, response => {
        this.roleShowData = response;
        this.updateNoEditableData();
      });
    } else {
      this.roleShowData = null;
    }*/
  }

  private updateNoEditableData(roleViewObj:any): void {
    roleViewObj.ShowRoleNoEditableData = false;
    this.roleNoEditableData = Object.assign({}, this.roleShowData.requirements);
    if (this.roleNoEditableData.apoyos)
      this.roleNoEditableData.apoyos = (this.roleNoEditableData.apoyos || []).filter((apoyo: any) => {
        if (!this.apoyosList.some(function (data) { return data.apoyo?.clave === apoyo.clave; })) {
          roleViewObj.ShowRoleNoEditableData = true;
          return apoyo;
        }
      });

  }

}


