import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService, UtilsService } from '@app/data/services';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
  @Input() googleToken: any = '';
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public dependencyList: Array<any> = [];
  public officeList: Array<any> = [];
  public dependencia: string = '';
  public oficina: string = '';

  constructor(
    private utilsService: UtilsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getDependencyList();
  }

  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

  public onChangeDependencia(): void {
    this.getOfficeList();
  }

  public onSaveUser(): void {
    this.userService.create(
      this.googleToken,
      this.dependencia,
      this.officeList[parseInt(this.oficina)],
      (isSuccess) => {
        if (isSuccess) {
          this.onClose();
        }
      }
    );
  }

  public isSaveDisabled(): boolean {
    return this.dependencia === '' || this.oficina === '';
  }

  private getDependencyList(): void {
    // this.utilsService.getOpenDependencyList((list) => {
    //   this.dependencyList = list;
    // });
  }

  private getOfficeList() {
    this.officeList = this.dependencyList.filter(
      (element) => element._id === this.dependencia
    )[0]?.ventanillas;
  }
}
