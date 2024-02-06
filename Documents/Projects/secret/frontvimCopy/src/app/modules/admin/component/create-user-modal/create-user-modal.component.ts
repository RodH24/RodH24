import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProgramService, RoleService, DependencyService, VentanillaService, UserService } from '@app/data/services';
import { ProgramType, Role, RoleRequirementsOptions, DependencyType } from '@app/data/types';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnInit {
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public formData: UntypedFormGroup;
  public formRequirements: UntypedFormGroup;
  public roleList: Array<Role> = [];
  public modalidadList: Array<ProgramType> = [];
  public dependencyList: Array<DependencyType> = [];
  public ventanillaList: Array<any> = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private programService: ProgramService,
    private dependencyService: DependencyService,
    private ventanillaService: VentanillaService
  ) {
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      office: ['', [Validators.required]],
      dependency: ['', [Validators.required]],
      role: ['', Validators.required]
    });
    this.formRequirements = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getRoleList();
    this.getDependencyList();
    this.getVentanillaList();

    this.formData.get('role')?.valueChanges.subscribe(selectedRole => {
      this.updateRequirementsForm(selectedRole);
    });

    this.formData.get('dependency')?.valueChanges.subscribe(selectedDependency => {
      this.formData.get('office')?.setValue('');
      this.getVentanillaList();
    })
  }

  get selectedDependency(): string {
    return this.formData.get('dependency')?.value
  }

  /**********************************
  ************ EVENTS ***************
  **********************************/
  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(emit: boolean = false): void {
    this.formData.reset();
    this.formRequirements.reset();
    this.onCloseModal.emit(emit);
  }

  /**
   * Call the user service to update role and/or status and refresh the list is success
   * @param {string} userId Id of the selected user (to update)
   * @param {{ role: string, status: string }} status and role object with new data
   */
  public onSaveUser() {
    const userData = {
      name: this.formData.getRawValue()?.name,
      email: this.formData.getRawValue()?.email,
      office: this.formData.getRawValue()?.office,
      dependenciaUsuario: this.formData.getRawValue()?.dependency,
      role: this.formData.getRawValue()?.role,
      dependencia: this.formRequirements.getRawValue()?.dependencia,
      clavesQ: this.formRequirements.getRawValue()?.clavesQ,
      apoyos: this.formRequirements.getRawValue()?.clavesQ,
      regiones: this.formRequirements.getRawValue()?.clavesQ
    }
    this.createUser(userData);
    this.onCloseModal.emit(true);
  }

  /**********************************
  *********** DATABASE **************
  **********************************/
  private createUser(userData: any): void {


    this.userService.createUserByPanel(userData, (isSuccess: boolean) => void {});
  }
  /**
   * Calls the role service to get the roles based on user
   */
  private getRoleList(): void {
    this.roleService.getRolList(({ list }: any) => {
      this.roleList = list;
    })
  }

  private getDependencyList(): void {
    this.dependencyService.list(true, (list) => {
      this.dependencyList = list;
    })
  }

  private getVentanillaList(): void {

    if (this.selectedDependency)
      this.ventanillaService.list(null, false, this.selectedDependency, true, null, null, (list: any) => {
        this.ventanillaList = list;
      })
  }

  private async getApoyosListPromise(): Promise<any> {
    return await new Promise((resolve: any, reject: any) => (
      this.programService.list(
        null,
        true,
        null,
        null,
        false,
        null,
        null,
        (list) => {
          resolve(list);
        })
    ))
  }

  private async getDependencyListPromise(): Promise<any> {
    return await new Promise((resolve: any, reject: any) => (
      this.dependencyService.list(true, (list) => {
        resolve(list);
      })
    ))
  }

  /**********************************
  *********** AUXILIAR **************
  **********************************/

  public formConfigurationArray: Array<any> = []

  private async updateRequirementsForm(selectedRole: string): Promise<void> {
    const roleRequirements = this.roleList.filter(element => element._id === selectedRole)[0]?.requirements || [];
    const formControls: any = {};

    const formConfigurationArray: Array<any> = []
    for (const element of roleRequirements) {
      formConfigurationArray.push({
        inputName: element.name,
        formControl: element.name,
        placeholder: `${element.name} de Usuario`,
        isMultiple: element.isMultiple,
        ... await this.getConfigBasedOnRequirement(element.name),
      })
      formControls[element.name] = [element.isMultiple ? [] : '', [Validators.required]]
    }
    this.formConfigurationArray = formConfigurationArray
    this.formRequirements = this.formBuilder.group(formControls)
  }

  private async getConfigBasedOnRequirement(requeriment: RoleRequirementsOptions): Promise<any> {
    switch (requeriment) {
      case 'apoyos':
        return {
          options: await this.getApoyosListPromise(),
          groupLabelFunc: (item: any, index: any) => (`${item.clave}: ${item.nombre} ${index}`),
          optionLabelFunc: (item: any) => (`${item.apoyo.clave}: ${item.apoyo.nombre}`),
          optionValueFunc: (item: any) => (`${item.apoyo.clave}`)
        }
      case 'dependencias':
        return {
          options: this.dependencyList.length ? this.dependencyList : await this.getDependencyListPromise(),
          groupLabelFunc: (item: any, index: any) => (`${item.nombre}: ${item.siglas}`),
          optionLabelFunc: (item: any) => (`${item.siglas}: ${item.nombre}`),
          optionValueFunc: (item: any) => (`${item._id}`)
        }
    }
  }
}