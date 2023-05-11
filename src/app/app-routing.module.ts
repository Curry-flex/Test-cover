import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './shared/components';
import { AuthGuardService, AuthGuardServiceAdminsOnly, AuthService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DisplayDataComponent } from './pages/display-data/display-data.component';
import { BankStatementComponent } from './finance-module/bank-statement/bank-statement.component';
import { PenaltyInvoicesComponent } from './finance-module/penalty-invoices/penalty-invoices.component';
import { PaymentInvoicesComponent } from './finance-module/payment-invoices/payment-invoices.component';
import { BankReconciliationComponent } from './finance-module/bank-reconciliation/bank-reconciliation.component';
import { CustomersInvoiceComponent } from './finance-module/customers-invoice/customers-invoice.component';
import { AnQrcodeModule } from 'an-qrcode';
import {
  DxDataGridModule,
  DxFormModule,
  DxContextMenuModule,
  DxMenuModule,
  DxTextBoxModule,
  DxDateBoxModule,
  DxButtonModule,
  DxPopupModule,
  DxActionSheetModule,
  DxFileUploaderModule,
  DxNumberBoxModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxScrollViewModule,
  DxHtmlEditorModule,
  DxDropDownBoxModule,
  DxTagBoxModule,
  DxRadioGroupModule,
  DxTabPanelModule,
  DxBoxModule,
  DxTemplateModule,
  DxValidatorModule,
  DxValidationSummaryModule,
  DxSpeedDialActionModule,
  DxLoadIndicatorModule,
  DxChartModule,
  DxListModule,
  DxSwitchModule,
  DxPieChartModule,
  DxButtonGroupModule
} from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AccessLogsComponent } from './security-module/access-logs/access-logs.component';
import { SecurityManagerComponent } from './security-module/security-manager/security-manager.component';
import { FumisPaymentsComponent } from './fumis-module/payments/fumis-payments/fumis-payments.component';
import { VomisPaymentsComponent } from './vomis-module/vomis-payments/vomis-payments.component';
import { EmployersComponent } from './customers/employers/employers.component';
import { IndividualContributorsComponent } from './customers/individual-contributors/individual-contributors.component';
import { SalesCustomersComponent } from './customers/sales-customers/sales-customers.component';
import { RentCustomersComponent } from './customers/rent-customers/rent-customers.component';
import { MoneyMarketCustomersComponent } from './customers/money-market-customers/money-market-customers.component';
import { OneTimePurchaseCustomersComponent } from './customers/one-time-purchase-customers/one-time-purchase-customers.component';
import { SharedClassComponent } from './shared/components/shared-class/shared-class.component';
import { SystemSettingsComponent } from './administrator-module/system-settings/system-settings.component';
import { SystemUsersComponent } from './administrator-module/system-users/system-users.component';
import { SystemSecurityComponent } from './administrator-module/system-security/system-security.component';
import { SystemRolesComponent } from './administrator-module/system-roles/system-roles.component';
import { SystemPrivilegesComponent } from './administrator-module/system-privileges/system-privileges.component';
import { SystemSecurityQuestionComponent } from './administrator-module/system-security-question/system-security-question.component';
import { PspCollectionAccountsComponent } from './administrator-module/psp/psp-collection-accounts/psp-collection-accounts.component';
import { CommunicationChannelsComponent } from './administrator-module/psp/communication-channels/communication-channels.component';
import { ApiCommunicationLinkComponent } from './administrator-module/psp/api-communication-link/api-communication-link.component';
import { CreateBillComponent } from './administrator-module/billing/create-bill/create-bill.component';
import { ExchangeRateComponent } from './administrator-module/billing/exchange-rate/exchange-rate.component';
import { RegistrationComponent } from './administrator-module/psp/registration/registration.component';
import { TargetComponent } from './target/target.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { FeedbackReplyComponent } from './feedback-reply/feedback-reply.component';
import { BillPaymentFormComponent } from './administrator-module/billing/bill-payment-form/bill-payment-form.component';
import { VomisValidationRequestsComponent } from './vomis/vomis-validation-requests/vomis-validation-requests.component';
import { VomisValidationResponsesComponent } from './vomis/vomis-validation-responses/vomis-validation-responses.component';
import { VomisPostResponsesComponent } from './vomis/vomis-post-responses/vomis-post-responses.component';
import { VomisPostRequestsComponent } from './vomis/vomis-post-requests/vomis-post-requests.component';
import { TemporaryLoginComponent } from './shared/components/temporary-login/temporary-login.component';
import { VomisApiSummaryComponent } from './vomis/vomis-api-summary/vomis-api-summary.component';
import { VomisPushComponent } from './vomis/vomis-push/vomis-push.component';
import { MultipleContributionsComponent } from './customers/multiple-contributions/multiple-contributions.component';
import { GeneratedContributionsComponent } from './customers/generated-contributions/generated-contributions.component';
import { BillDetailsComponent } from './customers/bill-details/bill-details.component';
import { MultipleContibutionInvoiceComponent } from './customers/multiple-contibution-invoice-component/multiple-contibution-invoice-component.component';
import { PspReconciliationComponent } from './administrator-module/psp/psp-reconciliation/psp-reconciliation.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { EmployerReportComponent } from './employer-report/employer-report.component';
import { PublishedInvoicesComponent } from './published-invoices/published-invoices.component';
import { EmployersAllotmentListComponent } from './allotment/employers-allotment-list/employers-allotment-list.component';
import { BillPaymentSummaryComponent } from './allotment/bill-payment-summary/bill-payment-summary.component';
import { ComplienceReportComponent } from './allotment/complience-report/complience-report.component';
import { ContributionsReportComponent } from './contributions-report/contributions-report.component';
import { NavigationSetupComponent } from './navigation-setup/navigation-setup.component';

import { UserNavMappingComponent } from './user-nav-mapping/user-nav-mapping.component';
import { AllBillsComponent } from './bills/all-bills/all-bills.component';
import { ContributionsBillsComponent } from './bills/contributions-bills/contributions-bills.component';
import { InvestmentBillsComponent } from './bills/investment-bills/investment-bills.component';
import { OthersBillsComponent } from './bills/others-bills/others-bills.component';
import { AllUsersComponent } from './usersListing/all-users/all-users.component';
import { BackendUsersComponent } from './usersListing/backend-users/backend-users.component';
import { EmployersUsersComponent } from './usersListing/employers-users/employers-users.component';
import { IndividualContributorsUsersComponent } from './usersListing/individual-contributors-users/individual-contributors-users.component';
import { InvestmentUsersComponent } from './usersListing/investment-users/investment-users.component';
import { BillSearchComponent } from './bills/bill-search/bill-search.component';
import { ControNumberBillDetailsComponent } from './bills/contro-number-bill-details/contro-number-bill-details.component';
import { PenaltyExemptionReasonComponent } from './penalty-exemption-reason/penalty-exemption-reason.component';
import { PenaltyExemptionComponent } from './penalty-exemption/penalty-exemption.component';
import { ContributionInvoicesListComponent } from './contribution-invoices-list/contribution-invoices-list.component';
import { FumisInvoiceComponent } from './fumis-invoice/fumis-invoice.component';
import { EmployerRegistrationComponent } from './Reports/EmployerRegistration/employer-registration/employer-registration.component';
import { IndividualContributorComponent } from './Reports/Individual/individual-contributor/individual-contributor.component';
import { UserPortalComponent } from './Reports/User/user-portal/user-portal.component';
import { AllotmentComponent } from './Reports/Allotment/allotment/allotment.component';


const routes: Routes = [
  {
    path: 'fumis-invoice',
    component: FumisInvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'contribution-invoices-list',
    component: ContributionInvoicesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'penalty-exemption-reason',
    component: PenaltyExemptionReasonComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'penalty-exemption',
    component: PenaltyExemptionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'users/nav/mapping',
    component: UserNavMappingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'all-bills',
    component: AllBillsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'contribution-bills',
    component: ContributionsBillsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'bills-search',
    component: BillSearchComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'bill-fetch',
    component: ControNumberBillDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'investment-bills',
    component: InvestmentBillsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'others-bills',
    component: OthersBillsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'all-users',
    component: AllUsersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'backend-users',
    component: BackendUsersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'employer-users',
    component: EmployersUsersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'individual-contributor-users',
    component: IndividualContributorsUsersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'investment-users',
    component: InvestmentUsersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'change-temporary-password',
    component: TemporaryLoginComponent
  },
  {
    path: 'multiple-contribution-invoice',
    component: MultipleContibutionInvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'navigation',
    component: NavigationSetupComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'contributions-report',
    component: ContributionsReportComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'employers/allotment/settings',
    component: EmployersAllotmentListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'bill/payments/summary',
    component: BillPaymentSummaryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'compliance/report',
    component: ComplienceReportComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'published-invoices',
    component: PublishedInvoicesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'audit-trail',
    component: AuditTrailComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'emp-reg-report',
    component: EmployerReportComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoice/contributions',
    component: MultipleContributionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'vomis-vd-req',
    component: VomisValidationRequestsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-push',
    component: VomisPushComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-api-summary',
    component: VomisApiSummaryComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-vd-res',
    component: VomisValidationResponsesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-ps-res',
    component: VomisPostResponsesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-ps-req',
    component: VomisPostRequestsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-settings',
    component: SystemSettingsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bill-create',
    component: CreateBillComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bill-payment-form',
    component: BillPaymentFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'user/feedback',
    component: FeedbackReplyComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'feedback-management',
    component: FeedbackManagementComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'target',
    component: TargetComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'psp-registration',
    component: RegistrationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'psp-reconciliation',
    component: PspReconciliationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'exchange-rate',
    component: ExchangeRateComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'psp-accounts',
    component: PspCollectionAccountsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'psp-list',
    component: CommunicationChannelsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'api-communication-links',
    component: ApiCommunicationLinkComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-users',
    component: SystemUsersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-security',
    component: SystemSecurityComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-roles',
    component: SystemRolesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-privileges',
    component: SystemPrivilegesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'system-security-question',
    component: SystemSecurityQuestionComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/employers',
    component: EmployersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/individual-contributors',
    component: IndividualContributorsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/sales',
    component: SalesCustomersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/rent',
    component: RentCustomersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/money-market',
    component: MoneyMarketCustomersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers/one-time-purchase',
    component: OneTimePurchaseCustomersComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'display-data',
    component: DisplayDataComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'security-manager',
    component: SecurityManagerComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'invoice-summary',
    component: AccessLogsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bank-statement',
    component: BankStatementComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bank-reconciliation',
    component: BankReconciliationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'payment-invoices',
    component: PaymentInvoicesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customers-invoice',
    component: CustomersInvoiceComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'penalty-invoices',
    component: PenaltyInvoicesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'fumis-payments',
    component: FumisPaymentsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'vomis-payments',
    component: VomisPaymentsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'invoice/view/contributions',
    component: GeneratedContributionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'bill-items',
    component: BillDetailsComponent,
    canActivate: [AuthGuardService]
  },

  //Reports
  {
    path: 'employer-registration-report',
    component: EmployerRegistrationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'individual-contributor-report',
    component: IndividualContributorComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'user-portal-report',
    component: UserPortalComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'allotment-report',
    component: AllotmentComponent,
    canActivate: [AuthGuardService]
  }
  ,
  {
    path: '**',
    redirectTo: 'home',
    canActivate: [ AuthGuardService ]
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    DxDataGridModule,
    DxFormModule,
    DxContextMenuModule,
    DxMenuModule,
    FormsModule,
    ReactiveFormsModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxDataGridModule,
    CommonModule,
    DxPopupModule,
    DxActionSheetModule,
    DxFileUploaderModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    // NgbModalModule,
    DxContextMenuModule,
    DxMenuModule,
    DxScrollViewModule,
    DxHtmlEditorModule,
    DxTabPanelModule,
    DxBoxModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxTemplateModule,
    DxSpeedDialActionModule,
    DxLoadIndicatorModule,
    DxListModule,
    NgHttpLoaderModule.forRoot(),
    DxRadioGroupModule,
    DxChartModule,
    DxSwitchModule,
    DxPieChartModule,
    DxButtonGroupModule,
    AnQrcodeModule
  ],
  providers: [AuthGuardService, AuthGuardServiceAdminsOnly],
  exports: [RouterModule],
  declarations: [
      HomeComponent,
      ProfileComponent,
      DisplayDataComponent,
      BankStatementComponent,
      PenaltyInvoicesComponent,
      PaymentInvoicesComponent,
      BankReconciliationComponent,
      AccessLogsComponent,
      SecurityManagerComponent,
      FumisPaymentsComponent,
      VomisPaymentsComponent,
      EmployersComponent,
      IndividualContributorsComponent,
      SalesCustomersComponent,
      RentCustomersComponent,
      MoneyMarketCustomersComponent,
      OneTimePurchaseCustomersComponent,
      SharedClassComponent,
      SystemSettingsComponent,
      SystemUsersComponent,
      SystemSecurityComponent,
      SystemRolesComponent,
      SystemPrivilegesComponent,
      SystemSecurityQuestionComponent,
      CustomersInvoiceComponent,
      PspCollectionAccountsComponent,
      CommunicationChannelsComponent,
      ApiCommunicationLinkComponent,
      CreateBillComponent,
      ExchangeRateComponent,
      RegistrationComponent,
      TargetComponent,
      FeedbackManagementComponent,
      FeedbackReplyComponent,
      BillPaymentFormComponent,
      VomisValidationRequestsComponent,
      VomisValidationResponsesComponent,
      VomisPostResponsesComponent,
      VomisPostRequestsComponent,
      TemporaryLoginComponent,
      VomisApiSummaryComponent,
      VomisPushComponent,
      MultipleContributionsComponent,
      GeneratedContributionsComponent,
      BillDetailsComponent,
      MultipleContibutionInvoiceComponent,
      PspReconciliationComponent,
      AuditTrailComponent,
      EmployerReportComponent,
      PublishedInvoicesComponent,
      EmployersAllotmentListComponent,
      BillPaymentSummaryComponent,
      ComplienceReportComponent,
      ContributionsReportComponent,
      NavigationSetupComponent,
      UserNavMappingComponent,
      AllBillsComponent,
      ContributionsBillsComponent,
      InvestmentBillsComponent,
      OthersBillsComponent,
      AllUsersComponent,
      BackendUsersComponent,
      EmployersUsersComponent,
      IndividualContributorsUsersComponent,
      InvestmentUsersComponent,
      BillSearchComponent,
      ControNumberBillDetailsComponent,
      PenaltyExemptionReasonComponent,
      PenaltyExemptionComponent,
      ContributionInvoicesListComponent,
      FumisInvoiceComponent,
      EmployerRegistrationComponent,
      IndividualContributorComponent,
      UserPortalComponent,
      AllotmentComponent
    ]
})
export class AppRoutingModule { }
