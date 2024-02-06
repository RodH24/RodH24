import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPanelComponent } from './views/user-panel/user-panel.component';
import { ProgramPanelComponent } from './views/program-panel/program-panel.component';
import { OfficePanelComponent } from './views/office-panel/office-panel.component';
import { DocumentPanelComponent } from './views/document-panel/document-panel.component';
import { RolePanelComponent } from './views/role-panel/role-panel.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: UserPanelComponent,
  },
  {
    path: 'programa',
    component: ProgramPanelComponent,
  },
  {
    path: 'oficina',
    component: OfficePanelComponent,
  },
  {
    path: 'documentos-panel',
    component: DocumentPanelComponent,
  },
  {
    path: 'rol',
    component: RolePanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
