import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.scss'],
})
export class MenuOptionComponent implements OnInit {
  /** Menu option title */
  @Input() title: string = 'Test sub-menu';
  /** Menu option icon */
  @Input() icon?: string = 'caret-right';
  /** Menu option route */
  @Input() href: string = '#';
  /** Menu option id */
  @Input() id: string = '';
  /** Menu option sub options */
  @Input() options: Array<any> = [
    {
      title: 'opt1',
      href: 'opt1',
      icon: 'caret-right',
    },
  ];
  public showSubmenu: boolean = true;
  /** Only for control init selected option */
  private actualRoute: string = '';

  /**
   * @constructor
   * @param {Router} router - Angular Router Service..
   */
  constructor(private router: Router) {
    /** Get the current route */
    this.actualRoute = this.router.url;
  }

  ngOnInit(): void {}

  /**
   * Define if option is initially selected by actual route
   * @param {String} href Option href
   * @param {Boolean} isActive Return if is active
   * @public
   */
  public initialSelectionOption(href: string): boolean {
    return href === this.actualRoute;
  }

  /**
   * Add select active class to selected option and redirect to href
   * @param {Number} index index of the selected element
   * @param {String} href Href of selected element
   * @public
   */
  public selectSubmenuOption(index: number, href: string): void {
    this.deselectAllOptions();
    const element = document.getElementsByClassName(`submenu-opt-${this.id}`)[index];
    element.classList.add('active');
    this.router.navigate([`${href}`]);
    this.actualRoute=href;
  }

  /**
   * Hide/Show Submenu options on click
   * @public
   */
  public hideSubmenuOpt() {
    this.showSubmenu = !this.showSubmenu;
  }

  /**
   * Deselect all options to handle selected options
   * @private
   */
  private deselectAllOptions(): void {
    const elements = document.getElementsByClassName('submenu-opt');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
  }
}
