import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';

@Component({
  selector: 'app-sections-header',
  templateUrl: './sections-header.component.html',
  styleUrls: ['./sections-header.component.scss']
})
export class SectionsHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showDependency: boolean = true;
  public token: TokenEntity;

  constructor(private cookieService: CookieService) { 
    this.token = new TokenEntity(this.cookieService);
    if (this.subtitle === '') {
      this.subtitle = `${ this.token.dependencyName } ${ this.token.programName ? ': ' + this.token.programName : ''}`;
    }
  }

  ngOnInit(): void {
  }

}
