import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { UserPanelComponent } from './views/user-panel/user-panel.component';
import { ProgramPanelComponent } from './views/program-panel/program-panel.component';
import { ProgramModalComponent } from './component/program-modal/program-modal.component';
//import { UserModalComponent } from './component/user-modal/user-modal.component';
import { OfficePanelComponent } from './views/office-panel/office-panel.component';
import { OfficeMapModalComponent } from './component/office-map-modal/office-map-modal.component';
import { OfficeModalComponent } from './component/office-modal/office-modal.component';
//import { ExternalOperadorModalComponent } from './component/external-operador-modal/external-operador-modal.component';
import { OfficeSelectModalComponent } from './component/office-select-modal/office-select-modal.component';
import { VentanillaModalComponent } from './component/ventanilla-modal/ventanilla-modal.component';
import { CreateUserModalComponent } from './component/create-user-modal/create-user-modal.component';
import { DocumentPanelComponent } from './views/document-panel/document-panel.component';
import { EditUserModalComponent } from './component/edit-user-modal/edit-user-modal.component';
import { RolePanelComponent } from './views/role-panel/role-panel.component';
import { RolTabContentComponent } from './component/rol-tab-content/rol-tab-content.component';
import { RolNewModalComponent } from './component/rol-new-modal/rol-new-modal.component';
import { ActionListItemComponent } from './component/action-list-item/action-list-item.component';
import { ActionTreeModalComponent } from './component/action-tree-modal/action-tree-modal.component';
import { ModalidadModalComponent } from './component/modalidad-modal/modalidad-modal.component';
import { ApoyosModalComponent } from './component/apoyos-modal/apoyos-modal.component';
import { DocumentAdminComponent } from './component/document-admin/document-admin.component';
import { AdditionalDataModalComponent } from './component/additional-data-modal/additional-data-modal.component';

@NgModule({
  declarations: [
    UserPanelComponent,
    ProgramPanelComponent,
    ProgramModalComponent,
//    UserModalComponent,
    OfficePanelComponent,
    OfficeMapModalComponent,
    OfficeModalComponent,
//    ExternalOperadorModalComponent,
    OfficeSelectModalComponent,
    VentanillaModalComponent,
    CreateUserModalComponent,
    DocumentPanelComponent,
    EditUserModalComponent,
    RolePanelComponent,
    RolTabContentComponent,
    ActionListItemComponent,
    RolNewModalComponent,
    ActionTreeModalComponent,
    ModalidadModalComponent,
    ApoyosModalComponent,
    DocumentAdminComponent,
    AdditionalDataModalComponent
  ],
  imports: [AdminRoutingModule, SharedModule],
})
export class AdminModule {}
