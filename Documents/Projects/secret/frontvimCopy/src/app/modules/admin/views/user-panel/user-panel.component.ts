import { Component, OnInit } from '@angular/core';
import { UserService, DependencyService,RoleService } from '@data/services';
import { CookieService } from 'ngx-cookie-service';
import { newUser, User } from '@data/types';
import { PaginatorEntity, TokenEntity } from '@data/entities';
import * as moment from 'moment';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  public selectedUser: User = newUser;
  public showEditUserModal: boolean = false;

  ////////////////////////
  
  public isCreateUser: boolean = false;
  private action: string = "";
  private selectedUserId: string = '';
  //
  public token: TokenEntity;
  public paginator: PaginatorEntity = new PaginatorEntity();
  //
  public userStatus: string = '';
  public isActivate: boolean = false; // Controla la modal de usuario. Si es editar o activar
  public confirmModalMsg = ''; // Mensaje de la modal de confirmacion
  public confirmModalTitle = ''; // Titulo de la modal de confirmacion
  // Informacion para mostrar
  public userRoles: any = [];
  public userList: Array<User> = [];
  public dependencyList: Array<any> = [];
  
  public programList: Array<{ clave: string; descripcion: string }> = [];
  //
  // Controla la visibilidad de los elementos
  public showYesNoModal = false;
  public showUserModal = false;
  public showExternalModal = false;
  public isTableLoading: boolean = true;
  // Filtro
  public filterWord: string = '';
  public isFiltered: boolean = false;
  public dependencyId: string = '';

  /**
   * @constructor
   * @param cookieService
   * @param userService
   */
  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private dependencyService: DependencyService,
    private roleService: RoleService,    
  ) {
    this.token = new TokenEntity(this.cookieService);

    Promise.all([this.getUserRoles(),  this.getDependencyList()])
    .then(([roles,dependencias]:Array<any>)=> {
          this.userRoles=roles;
          this.dependencyList=dependencias;
          this.getUserList()});
  }

  ngOnInit(): void {
     
    
  }

  public onEditUser(user: User): void {
    this.selectedUser = user;
    this.showEditUserModal = true;
  }

  /*******************************/
  /*******************************/
  /*******************************/
  /*******************************/
  /*******************************/


  /*******************************
   ********** EVENTS **************
   ********************************/

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getUserList();
  }

  public onCloseModal(refresh: boolean): void {
    this.showAddUserModal = false;
    this.showEditUserModal = false;
    if (refresh) {
      this.getUserList();
    }
  }
  
  // public onUpdateUserStatus(user: User, isEnabledAction: boolean) {
  //   this.showModal = true;
  //   this.isDeleteUser = false;
  //   this.selectedUserId = user._id;
  //   this.isEnabledAction = isEnabledAction;
  //   if (isEnabledAction) {
  //     this.confirmModalTitle = 'Habilitar Usuario';
  //     this.confirmModalMsg =
  //       '¿Seguro que quiere reactivar los privilegios del usuario?';
  //   } else {
  //     this.confirmModalTitle = 'Deshabilitar Usurario';
  //     this.confirmModalMsg =
  //       '¿Seguro que quiere pausar los privilegios del usuario?';
  //   }
  // }

  public onEnableUser(userId: string): void {
    this.showYesNoModal = true;
    this.action = "Enable";
    this.confirmModalTitle = 'Activar Usuario';
    this.confirmModalMsg = '¿Seguro que quiere activar el usuario?';
    this.selectedUserId = userId;
  }

  public onDisableUser(userId: string): void {
     this.showYesNoModal = true;
     this.action = "Disable";
     this.confirmModalTitle = 'Eliminar Usuario';
     this.confirmModalMsg = '¿Seguro que quiere eliminar el usuario?';
     this.selectedUserId = userId;
   }

   public onModalAccept(isAccept: boolean): void {
     this.showYesNoModal = false;
     if (isAccept) {
      switch(this.action){
        case "Enable": this.enableUser();break;
        case "Disable": this.disableUser();break;
        }
      }
   }

  // public onDependencySelect() {
  //   this.getUserList();
  // }

  // public onShowExternalModal(user: User): void {
  //   this.selectedUser = user;
  //   this.showExternalModal = true;
  // }
  /*******************************
   ********** AUXILIAR **************
   ********************************/

  /**
   * Control the ngIf condition on the html
   * @param status User status
   * @returns {any} Object to easy access to the conditions
   */
  public getUserStatus(status: string): any {
    status = status.toLowerCase();
    return {
      enabled: status === 'enabled',
      disabled: status === 'disabled',
      pending: status === 'pending',
    };
  }

  public getUserRoleName(roleId: string): string {
      const filter = this.userRoles.find(function (element:any){return element._id === roleId});

    return filter?filter.name:'';
  }

  public getUserDependencyName(dependency: string): string {
    const filter = this.dependencyList.find(function (element:any){return element._id === dependency});
    return filter?filter.siglas:'Sin asignar';
  }

  public filterUserValidRoles(roleId: string): string {
    const filter =this.userRoles.find(
                    function (element:any){
                      let now= moment().toISOString();
                      let start=moment(element?.vigencia?.inicio).toISOString();
                      let fin=element?.vigencia?.fin===null?now:element?.vigencia?.fin;
                      
                      return element._id === roleId  && (now >= start && now<=fin );
                    });
                    
    return filter?"success":'default';
  }

  /**********************************
   *********** DATABASE **************
   **********************************/
  /**
   * Call the user service to delete seletected user and refresh the list is success
   * @param userId Id of the selected user (to delete)
   */
   private disableUser(): void {
     this.isTableLoading = true;
     this.userService.disable(this.selectedUserId, (isSuccess) => {
       if (isSuccess) {
         this.getUserList();
       } else {
         this.isTableLoading = false;
       }
     });
   }

   private enableUser(): void {
     this.userService.enable(this.selectedUserId, (isSuccess) => {
       if (isSuccess) {
         this.getUserList();
       }
     });
   }

  // private disableUser(): void {
  //   this.userService.disable(this.selectedUserId, (isSuccess) => {
  //     if (isSuccess) {
  //       this.getUserList();
  //     }
  //   });
  // }


  /*************************************************************** */
  /*************************************************************** */
  /*************************************************************** */

  public readonly statusList: Array<any> = [
    {
      title: 'Todas',
      value: '',
    },
    {
      title: 'Activo',
      value: 'Enabled',
    },
    {
      title: 'Inactivo',
      value: 'Disabled',
    },
  ];
  public showAddUserModal: boolean = false;
  public isLoading: boolean = false;
  public selectedStatus: string = '';
  private filteredWord: string = '';


  /*******************************
   ********** EVENTS **************
   ********************************/

  

  public onUserFilter(filterWord: string): void {
    this.filteredWord = filterWord;
    this.getUserList();
  }

  /**
   * Update the list with filter
   */
   public onSelectedStatusChange(selectedStatus: string | number): void {
     this.selectedStatus = selectedStatus as string;
    this.getUserList();
  }

  public onCreateUser() {
    this.showAddUserModal = true;
  }

  private getUserList(): void {
    this.isTableLoading = true;
    this.userService.list(
      this.paginator.page, // ok
      this.selectedStatus, // ok
      this.dependencyId,
      this.filteredWord,
      ({ list, total }) => {
        this.isTableLoading = false;
        this.userList = list;
        this.paginator.total = total;
      }
    );

  }

  private async getDependencyList() {
   return await new Promise((resolve: any, reject: any) => ( 
    this.dependencyService.list(true, (list) => {
      resolve(list); 
    })
    ))
  }

  private async getUserRoles() {
    return await new Promise((resolve: any, reject: any) => ( 
      this.roleService.getRolList(({ list }: any) => {
      resolve(list);
      })
    ))
  }

}