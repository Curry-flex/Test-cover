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
import { PenaltyExemptReasonComponent } from './penalty-exempt-reason/penalty-exempt-reason.component';
import { PenaltyExemptApprovalComponent } from './penalty-exempt-approval/penalty-exempt-approval.component';
import { PaymentListComponent } from './Payment-List/payment-list/payment-list.component';
import { CorrectLookupComponent } from './Correct/correct-lookup/correct-lookup.component';
import { CorrectRequestComponent } from './Correct/correct-request/correct-request.component';
import { CorrectListComponent } from './Correct/correct-list/correct-list.component';
import { CorrectGetComponent } from './Correct/correct-get/correct-get.component';
import { ComplianceUncontributedComponent } from './Reports/compliance-uncontributed/compliance-uncontributed.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { EmployerCreateComponent } from './FUMIS/Employers/employer-create/employer-create.component';
import { EmployerListComponent } from './FUMIS/Employers/employer-list/employer-list.component';
import { EmployerInfoComponent } from './FUMIS/Employers/employer-info/employer-info.component';
import { EmployerRegistrationPerformanceComponent } from './FUMIS/Employers/employer-registration-performance/employer-registration-performance.component';
//import { EmployerReportComponent } from './FUMIS/Employers/employer-report/employer-report.component';
import { EmployerReportFumisComponent } from './FUMIS/Employers/employer-report-fumis/employer-report-fumis.component';
import { MemberCreateComponent } from './FUMIS/Member/member-create/member-create.component';
import { MemberListComponent } from './FUMIS/Member/member-list/member-list.component';
import { MemberInfoComponent } from './FUMIS/Member/member-info/member-info.component';
import { MemberByEmployerComponent } from './FUMIS/Member/member-by-employer/member-by-employer.component';
import { MemberByAgeSectorEmpNoComponent } from './FUMIS/Member/member-by-age-sector-emp-no/member-by-age-sector-emp-no.component';
import { MemberAgeGroupComponent } from './FUMIS/Member/member-age-group/member-age-group.component';
import { MemberRegistratonPerformanceComponent } from './FUMIS/Member/member-registraton-performance/member-registraton-performance.component';
import { MemberRegistrationDailyComponent } from './FUMIS/Member/member-registration-daily/member-registration-daily.component';
import { MemberIndividualRegReportComponent } from './FUMIS/Member/member-individual-reg-report/member-individual-reg-report.component';
import { ContributionReceiptCreateComponent } from './FUMIS/Member/Contribution/contribution-receipt-create/contribution-receipt-create.component';
import { ContributionReceiptListComponent } from './FUMIS/Member/Contribution/contribution-receipt-list/contribution-receipt-list.component';
import { ContributionReceiptInfoComponent } from './FUMIS/Member/Contribution/contribution-receipt-info/contribution-receipt-info.component';
import { ContributionReceiptUpdateComponent } from './FUMIS/Member/Contribution/contribution-receipt-update/contribution-receipt-update.component';
import { ContributionInvoiceListComponent } from './FUMIS/Member/Contribution/contribution-invoice-list/contribution-invoice-list.component';
import { ContributionPerformanceQotaComponent } from './FUMIS/Member/Contribution/contribution-performance-qota/contribution-performance-qota.component';
import { ContributionPerformanceMonthComponent } from './FUMIS/Member/Contribution/contribution-performance-month/contribution-performance-month.component';
import { InspectionFormComponent } from './FUMIS/Member/Inspection/inspection-form/inspection-form.component';
import { InspectionListComponent } from './FUMIS/Member/Inspection/inspection-list/inspection-list.component';
import { InspectionSummuryComponent } from './FUMIS/Member/Inspection/inspection-summury/inspection-summury.component';
import { SuspenseClearenceComponent } from './FUMIS/Member/Contribution/suspense-clearence/suspense-clearence.component';
import { SuspenseSummuryQotaComponent } from './FUMIS/Member/Contribution/suspense-summury-qota/suspense-summury-qota.component';
import { EmployerAggregateStatementComponent } from './FUMIS/Employers/employer-aggregate-statement/employer-aggregate-statement.component';
import { MemberAggregateStatementComponent } from './FUMIS/Member/member-aggregate-statement/member-aggregate-statement.component';
import { EmployerStatementComponent } from './FUMIS/Employers/employer-statement/employer-statement.component';
import { MemberStatementComponent } from './FUMIS/Member/member-statement/member-statement.component';
import { ContributionDISCREPANCIESComponent } from './FUMIS/Contribution/contribution-discrepancies/contribution-discrepancies.component';
import { ShortRemiitanceComponent } from './FUMIS/REMITTANCE/short-remiitance/short-remiitance.component';
import { ShortRemiitanceAdviceNoteComponent } from './FUMIS/REMITTANCE/short-remiitance-advice-note/short-remiitance-advice-note.component';
import { CollectionReportComponent } from './FUMIS/REPORTS/collection-report/collection-report.component';
import { MaternityBenefitsApplicationComponent } from './FUMIS/MATERNITY/maternity-benefits-application/maternity-benefits-application.component';
import { CompensationClaimRegisterComponent } from './COMPENSATION/compensation-claim-register/compensation-claim-register.component';
import { CompensationClaimListComponent } from './COMPENSATION/compensation-claim-list/compensation-claim-list.component';
import { CompensationClaimInfoComponent } from './COMPENSATION/compensation-claim-info/compensation-claim-info.component';
import { MaternityBenefitsApplicationListComponent } from './FUMIS/MATERNITY/maternity-benefits-application-list/maternity-benefits-application-list.component';
import { MaternityBenefitsApplicationInfoComponent } from './FUMIS/MATERNITY/maternity-benefits-application-info/maternity-benefits-application-info.component';
import { PensionersListComponent } from './FUMIS/PENSIONERS/pensioners-list/pensioners-list.component';
import { PensionersBatchHistoryComponent } from './FUMIS/PENSIONERS/pensioners-batch-history/pensioners-batch-history.component';
import { PensionHistoryComponent } from './FUMIS/PENSIONERS/pension-history/pension-history.component';
import { PensionersBatchListComponent } from './FUMIS/PENSIONERS/pensioners-batch-list/pensioners-batch-list.component';
import { PensionUncollectedComponent } from './FUMIS/PENSIONERS/pension-uncollected/pension-uncollected.component';
import { PensionerCashPaymentsComponent } from './FUMIS/PENSIONERS/pensioner-cash-payments/pensioner-cash-payments.component';
import { PensionerInfoComponent } from './FUMIS/PENSIONERS/pensioner-info/pensioner-info.component';
import { BenefitApplicationListComponent } from './FUMIS/BENEFIT/benefit-application-list/benefit-application-list.component';
import { BenefitApplicationInfoComponent } from './FUMIS/BENEFIT/benefit-application-info/benefit-application-info.component';
import { BenefitApplicationHistoryComponent } from './FUMIS/BENEFIT/benefit-application-history/benefit-application-history.component';
import { BenefitApplicationCreateComponent } from './FUMIS/BENEFIT/benefit-application-create/benefit-application-create.component';
import { BenefitApplicationSummuryComponent } from './FUMIS/BENEFIT/benefit-application-summury/benefit-application-summury.component';
import { BenefitApplicationCalculateComponent } from './FUMIS/BENEFIT/benefit-application-calculate/benefit-application-calculate.component';
import { MaternityBenefitsCalculationComponent } from './FUMIS/MATERNITY/maternity-benefits-calculation/maternity-benefits-calculation.component';
//import { EmployerRegistrationComponent } from './Reports/EmployerRegistration/employer-registration/employer-registration.component';


@NgModule({
  declarations: [
    AppComponent,
    PspListComponent,
    PenaltyExemptApprovalComponent,

    
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
