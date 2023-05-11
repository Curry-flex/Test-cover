import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuModule, HeaderModule } from '../../shared/components';
import { ScreenService, AuthService } from '../../shared/services';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { CommonModule } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import notify from 'devextreme/ui/notify';

import { Router, NavigationEnd } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SUPER_ADMINNavigation, ICT_ADMINISTRATORNavigation, GENERAL_MANAGERNavigation,
  VOMIS_MANAGERNavigation, COMPLIANCE_MANAGERNavigation, ACCOUNTS_MANAGERNavigation,
  DATA_ENTRY_MANAGERNavigation, INVESTMENT_MANAGERNavigation, AUDITORNavigation,
  UNKNOWNNavigation } from 'src/app/app-navigation';

@Component({
  selector: 'app-side-nav-inner-toolbar',
  templateUrl: './side-nav-inner-toolbar.component.html',
  styleUrls: ['./side-nav-inner-toolbar.component.scss']
})
export class SideNavInnerToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: true }) scrollView: DxScrollViewComponent;
  selectedRoute = '';
  menuItems: any; // navigation;
  data = {
    settingId: '1006'
  };
  endPoint = 'settings/get';
  idleTimeout: number;
  user: any;
  roleId: number;

  menuOpened: boolean;
  temporaryMenuOpened = false;

  @Input()
  title: string;

  menuMode = 'shrink';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;

  constructor(private screen: ScreenService, private router: Router,
              public utilities: UtilitiesService,
              public spinner: SpinnerVisibilityService,
              public authService: AuthService,
              private bnIdle: BnNgIdleService) {
    const isLoginForm = router.url === '/login';
    this.onUserRolesNavigationsdetails();
    this.utilities.postServiceCall(this.data, this.endPoint).subscribe(res => {
      const response = res;
      this.idleTimeout = response.data.value;
      if (!isLoginForm) {
        this.bnIdle.startWatching(300000).subscribe(result => {
          if (result) {
            this.authService.logOut();
            this.bnIdle.stopTimer();
            notify('You have been logged out due to inactivity.', 'info', 600000);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.menuOpened = this.screen.sizes['screen-large'];

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.selectedRoute = val.urlAfterRedirects.split('?')[0];
      }
    });

    this.screen.changed.subscribe(() => this.updateDrawer());

    this.updateDrawer();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];

    this.menuMode = isLarge ? 'shrink' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = isXSmall ? 0 : 60;
    this.shaderEnabled = !isLarge;
  }

  toggleMenu = (e) => {
    this.menuOpened = !this.menuOpened;
    e.event.stopPropagation();
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  navigationChanged(event) {
    const path = event.itemData.path;
    const pointerEvent = event.event;

    if (path && this.menuOpened) {
      if (event.node.selected) {
        pointerEvent.preventDefault();
      } else {
        this.router.navigate([path]);
        this.scrollView.instance.scrollTo(0);
      }

      if (this.hideMenuAfterNavigation) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
        pointerEvent.stopPropagation();
      }
    } else {
      pointerEvent.preventDefault();
    }
  }
  onUserRolesNavigationsdetails() {
    const USERGROUP = this.authService.getUserDetails().userGroup;
    if (USERGROUP == 'SUPER_ADMIN') {
      this.menuItems = SUPER_ADMINNavigation;
    } else if (USERGROUP == 'ICT_ADMINISTRATOR' || USERGROUP == 'ICT_MANAGER'
    || USERGROUP == 'ICT_OFFICER') {
      this.menuItems = ICT_ADMINISTRATORNavigation;
    } else if (USERGROUP == 'GENERAL_MANAGER' || USERGROUP == 'MD') {
      this.menuItems = GENERAL_MANAGERNavigation;
    } else if (USERGROUP == 'VOMIS_MANAGER' || USERGROUP == 'VOMIS_OFFICER') {
      this.menuItems = VOMIS_MANAGERNavigation;
    } else if (USERGROUP == 'COMPLIANCE_MANAGER' || USERGROUP == 'COMPLIANCE_OFFICER') {
      this.menuItems = COMPLIANCE_MANAGERNavigation;
    } else if (USERGROUP == 'ACCOUNTS_MANAGER' || USERGROUP == 'ACCOUNTS_OFFICER') {
      this.menuItems = ACCOUNTS_MANAGERNavigation;
    } else if (USERGROUP == 'DATA_ENTRY_MANAGER' || USERGROUP == 'DATA_ENTRY_OFFICER') {
      this.menuItems = DATA_ENTRY_MANAGERNavigation;
    } else if (USERGROUP == 'INVESTMENT_MANAGER' || USERGROUP == 'INVESTMENT_OFFICER') {
      this.menuItems = INVESTMENT_MANAGERNavigation;
    } else if (USERGROUP == 'AUDITOR') {
      this.menuItems = AUDITORNavigation;
    } else if (USERGROUP == null || USERGROUP == undefined || USERGROUP == '') {
      this.menuItems = UNKNOWNNavigation;
    } else {
      this.menuItems = UNKNOWNNavigation;
    }
  }
  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [ SideNavigationMenuModule, DxDrawerModule, HeaderModule, DxToolbarModule, DxScrollViewModule, CommonModule ],
  exports: [ SideNavInnerToolbarComponent ],
  declarations: [ SideNavInnerToolbarComponent ]
})
export class SideNavInnerToolbarModule { }
