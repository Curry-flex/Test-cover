import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OutgoingInterceptor } from './shared/interceptor/outgoing.interceptor';
import { PspListComponent } from './psp-list/psp-list.component';
import { IndividualContributorComponent } from './Reports/Individual/individual-contributor/individual-contributor.component';
import { UserPortalComponent } from './Reports/User/user-portal/user-portal.component';
import { AllotmentComponent } from './Reports/Allotment/allotment/allotment.component';
//import { EmployerRegistrationComponent } from './Reports/EmployerRegistration/employer-registration/employer-registration.component';


@NgModule({
  declarations: [
    AppComponent,
    PspListComponent,
    
   

   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    NgHttpLoaderModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [AuthService, ScreenService, AppInfoService, HttpClientModule, Title,
    {provide: HTTP_INTERCEPTORS, useClass: OutgoingInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
