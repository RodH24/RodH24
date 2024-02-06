import { Pipe, PipeTransform } from '@angular/core';
import { ApprovedStatus, PendingStatus } from '@data/constants/application';

@Pipe({
  name: 'statusBadge',
})
export class StatusBadgePipe implements PipeTransform {
  private class: string | undefined = 'secondary';
  private title: string | undefined = 'Sin Estatus';

  transform(status: string): string {
    status = status.toLowerCase();
    switch (status) {
      case 'enabled':
      case 'true':
        this.class = 'success';
        this.title = 'Activo';
        break;
      case 'disabled':
      case 'false':
        this.class = 'warning';
        this.title = 'Inactivo';
        break;
      case 'pending':
        this.class = 'secondary';
        this.title = 'Pendiente';
        break;
      //
      case PendingStatus.get('entered')?.dbName:
        this.class = PendingStatus.get('entered')?.class;
        this.title = PendingStatus.get('entered')?.toShow;
        break;
      case PendingStatus.get('pending')?.dbName:
        this.class = PendingStatus.get('pending')?.class;
        this.title = PendingStatus.get('pending')?.toShow;
        break;
      case PendingStatus.get('rejected')?.dbName:
        this.class = PendingStatus.get('rejected')?.class;
        this.title = PendingStatus.get('rejected')?.toShow;
        break;
      //
      case ApprovedStatus.get('validated')?.dbName:
        this.class = ApprovedStatus.get('validated')?.class;
        this.title = ApprovedStatus.get('validated')?.toShow;
        break;
      case ApprovedStatus.get('dictamination')?.dbName:
        this.class = ApprovedStatus.get('dictamination')?.class;
        this.title = ApprovedStatus.get('dictamination')?.toShow;
        break;
      case ApprovedStatus.get('aproved')?.dbName:
        this.class = ApprovedStatus.get('aproved')?.class;
        this.title = ApprovedStatus.get('aproved')?.toShow;
        break;
      case 'en observación':
        this.class = 'info';
        this.title = 'En observación';
        break;
      case 'cancelada':
        this.class = 'canceled-status';
        this.title = 'Cancelada';
        break;
    }
    return `<span class="badge bg-color-${this.class}">${this.title}</span>`;
  }
}
