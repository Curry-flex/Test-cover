import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuModule, HeaderModule } from '../../shared/components';
import { ScreenService, AuthService } from '../../shared/services';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';

import { Router, NavigationEnd } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SUPER_ADMINNavigation, ICT_ADMINISTRATORNavigation, GENERAL_MANAGERNavigation,
         VOMIS_MANAGERNavigation, COMPLIANCE_MANAGERNavigation, ACCOUNTS_MANAGERNavigation,
         DATA_ENTRY_MANAGERNavigation, INVESTMENT_MANAGERNavigation, AUDITORNavigation,
         UNKNOWNNavigation } from 'src/app/app-navigation';
import { BnNgIdleService } from 'bn-ng-idle';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from 'src/app/app-settings';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss']
})
export class SideNavOuterToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: true }) scrollView: DxScrollViewComponent;
  selectedRoute = '';

  menuItems: any; // navigation;
  data = {
    setting_id: '1008'
  };
  getIdleTimeoutByName = {
    requestType: "SETTING_BY_NAME",
    settingName: 'IDLE_TIMEOUT_IN_SECONDS'
  };
  getSettingsByNameEndpoint = 'backend/request';
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

  constructor(private screen: ScreenService,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private toastr: ToastrService,
              public utilities: UtilitiesService,
              public spinner: SpinnerVisibilityService,
              public authService: AuthService) {
                this.onUserRolesNavigationsdetails();
                const isLoginForm = router.url === '/login';
                this.idleTimeout = 300;
                if (!isLoginForm) {
                this.utilities.postServiceCall(this.getIdleTimeoutByName, this.getSettingsByNameEndpoint).subscribe(res => {
                  const response = res;
                  if(response.code == 2000){
                    this.idleTimeout = response.data.value;
                  } else {
                    this.idleTimeout = 300;
                  }
                  if (!isLoginForm) {
                    this.bnIdle.startWatching(this.idleTimeout).subscribe(result => {
                      if (result) {
                        this.authService.logOut();
                        this.bnIdle.stopTimer();
                        notify('You have been logged out due to inactivity.', 'info', 60000);
                      }
                    });
                  }
                });
              }
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
    const data = {
      "requestType": "USERGROUP_NAV_MENU",
      "usegroup": USERGROUP
  }
  
    this.utilities.postServiceCall(data, this.getSettingsByNameEndpoint).subscribe(res => {
      const response = res;
      if(response.code == 2000){
        // this.menuItems = response.data.navMenu;
        this.menuItems = [];
        const userGroupNavigations = [];
        for (const iterator of response.data.navMenu) {
          if (iterator.accessName != 'NO_ACCESS') {
            this.menuItems.push(iterator);
          }
            userGroupNavigations.push(iterator);
          if (iterator.items !== null) {
            for (const item of iterator.items) {
                userGroupNavigations.push(item);
            }
          }
        }

        sessionStorage.removeItem(AppSettings.userGroupKey);
        sessionStorage.setItem(AppSettings.userGroupKey, JSON.stringify(userGroupNavigations));
      } else {
        this.toastr.error(response.message, 'Failed to load navigations');
      }
    }, err => {
      this.toastr.error('Failed to load navigations');
    });

    // const USERGROUP = this.authService.getUserDetails().userGroup;


  }
  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [ SideNavigationMenuModule, DxDrawerModule, HeaderModule, DxScrollViewModule, CommonModule ],
  exports: [ SideNavOuterToolbarComponent ],
  declarations: [ SideNavOuterToolbarComponent ]
})
export class SideNavOuterToolbarModule { }
