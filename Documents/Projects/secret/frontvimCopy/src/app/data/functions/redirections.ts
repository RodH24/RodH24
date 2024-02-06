import { Router } from '@angular/router';
import {
  UserRoutes,
  ProgramsRoutes,
  FlowRequestsRoutes,
} from '@data/constants/routes';
import { roleType } from '@app/data/types';


export function redirectToLogin(router: Router): void {
  router.navigate([`${UserRoutes.login}`]);
}

export function redirectToProgramList(router: Router): void {
  router.navigate([`${ProgramsRoutes.list}`]);
}

export function redirectToProgramPutRequest(router: Router): void {
  router.navigate([`${ProgramsRoutes.putRequest}`]);
}
// Function to start the request for the program
export function redirectToReadCurp(router: Router): void {
  router.navigate([`${FlowRequestsRoutes.register}`]);
}

export function redirectToCitizenFile(router: Router): void {
  router.navigate([`${FlowRequestsRoutes.citizen}`]);
}

export function redirectToEditSolicitud(router: Router, folio: string): void {
  router.navigate([`${FlowRequestsRoutes.edit}/${folio}`]);
}

export function redirectToSolicitudPanel(router: Router): void {
  router.navigate(['dependencia/panel/pendientes']);
}

export function redirectToMainPage(router: Router, activeRole: roleType): void {
  router.routeReuseStrategy.shouldReuseRoute = () => false;
  router.onSameUrlNavigation = 'reload';
  router.navigate([activeRole.mainRoute]);
}
