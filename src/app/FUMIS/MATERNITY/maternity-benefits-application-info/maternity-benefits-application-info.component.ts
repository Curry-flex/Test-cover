import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-maternity-benefits-application-info',
  templateUrl: './maternity-benefits-application-info.component.html',
  styleUrls: ['./maternity-benefits-application-info.component.scss']
})
export class MaternityBenefitsApplicationInfoComponent extends SharedClassComponent implements OnInit {


  tab_paneldata: any = [{
    ID: 1,
    icon: '',
    name: 'Application Details',
}, {
    ID: 2,
    icon: '',
    name: 'Contribution Details',
}, {
  ID: 3,
  icon: '',
  name: 'Maternity Details',
},
{
  ID: 4,
  icon: '',
  name: 'Payment Details',
},

{
  ID: 5,
  icon: '',
  name: 'Pensions',
},
{
  ID: 6,
  icon: '',
  name: 'Processing Stage',
},





];
 maternityInfo: any = [];
//  maternityInfo =  {
//   "ApplicationNo": "ZSSF/MBA/0000007999",
//   "MemberNumber": "00000009",
//   "ApplicationID": "6AC2A3F1-98EB-4A7F-9973-8DE0DF51644E",
//   "MemberID": null,
//   "ApplicationDate": "2023-04-25",
//   "LastContributionMonth": 9,
//   "LastContributionYear": 2020,
//   "PhysicalAddress": "Paje",
//   "PostalAddress": "",
//   "TelephoneMobile": "1265656789",
//   "EmailAddress": "e@gMAIL.com",
//   "ApplicationTypeID": 8,
//   "LastEmployerID": "",
//   "TerminationDate": "1900-01-01",
//   "NumberOfContributions": 0,
//   "ContBeforeRetirement": null,
//   "MaternityBenefitAmount": 100000.00,
//   "TwinIncriment": 100000.00,
//   "TotalMaternityBenefit": 100000.00,
//   "AverageSalary": 100000.00,
//   "LastSixMonthContribution": 0,
//   "ApplicationCategory": "",
//   "PregAge": 0,
//   "BabyStatus": 0,
//   "DeliveryCategory": "",
//   "ApplicationMode": false,
//   "ReferenceApplication": "",
//   "DeliveryDate": "1900-01-01T00:00:00",
//   "LumpsumPayable": 100000.00,
//   "MonthlyPension": 100000.00,
//   "ModeOfPayment": 0,
//   "BankID": 0,
//   "AccountNo": "",
//   "AccountName": "",
//   "ReferenceNo": "",
//   "OfBankID": 1,
//   "PaymentDate": "1900-01-01T00:00:00",
//   "PaymentDetails": "",
//   "AuthorityID": 1,
//   "ProcessingStageID": 1,
//   "Status": "",
//   "RejectionReasonID": 1,
//   "Remarks": "",
//   "CreatedBy": "511",
//   "DateCreated": "2023-04-25T15:49:42.450",
//   "LastModifiedBy": "511",
//   "LastModified": "2023-04-25T15:49:42.450",
//   "ContributingPeriod": null,
//   "FirstPensionMonth": null,
//   "MBCR": 0,
//   "DateofBirth": "1976-01-31"
// }

 

  ngOnInit() {
    this.maternityInfo =JSON.parse(sessionStorage.getItem("maternityData"))
  }

}
