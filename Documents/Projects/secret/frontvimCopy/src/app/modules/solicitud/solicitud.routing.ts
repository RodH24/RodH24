import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolicitudesComponent } from "./views/solicitudes/solicitudes.component";
import { RegistroSolicitudesComponent } from "./views/registro-solicitudes/registro-solicitudes.component";
import { AcuseUploadComponent } from "@app/shared-documents/components/acuse-upload/acuse-upload.component";
import { UniversalGuard } from "@core/guards";

const routes: Routes = [
  {
    path: "",
    component: SolicitudesComponent,
  },
  {
    path: "solicitud/registro",
    component: RegistroSolicitudesComponent,
    canDeactivate: [
      (component: any) => {
          return component.canDeactivate();
      },
    ],
  },
  {
    path: "solicitud/editar/:folio",
    component: RegistroSolicitudesComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudRoutingModule {}
