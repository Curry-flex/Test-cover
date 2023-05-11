import { Component, HostBinding } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }
  copyRightBanner = '';
  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService) {
    this.copyRightBanner = appInfo.getCopyRightText();
  }

  isAutorized() {
    return this.authService.isLoggedIn;
    

  }
}

