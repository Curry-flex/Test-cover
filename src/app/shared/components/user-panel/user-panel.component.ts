import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { SharedClassComponent } from '../shared-class/shared-class.component';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent extends SharedClassComponent implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;
  loggedInUserCredentials;
  roles;
  userName: string;
  ngOnInit() {
    this.roles = this.authService.getUserDetails().userGroup;
    this.loggedInUserCredentials = this.authService.getUserDetails();
    // tslint:disable-next-line: max-line-length
    this.userName = this.roles + '  |  ' + this.loggedInUserCredentials.firstName + ' ' + this.loggedInUserCredentials.lastName;
  }
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [ UserPanelComponent ],
  exports: [ UserPanelComponent ]
})
export class UserPanelModule { }
