import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-complience-report',
  templateUrl: './complience-report.component.html',
  styleUrls: ['./complience-report.component.scss']
})
export class ComplienceReportComponent extends SharedClassComponent implements OnInit {

  title = "COMPLIANCE MONTHLY REPORT";
  searchParamDatasource = [
    {
      id: 'CONTRIBUTED',
      text: 'CONTRIBUTED'
    },
    {
      id: 'UNCONTRIBUTED',
      text: 'UNCONTRIBUTED'
    },
    {
      id: 'ALL',
      text: 'ALL'
    }
  ];

  months = [
    {
      id: '01',
      text: 'January'
    },
    {
      id: '02',
      text: 'February'
    },
    {
      id: '03',
      text: 'March'
    },
    {
      id: '04',
      text: 'April'
    },
    {
      id: '05',
      text: 'May'
    },
    {
      id: '06',
      text: 'June'
    },
    {
      id: '07',
      text: 'July'
    },
    {
      id: '08',
      text: 'August'
    },
    {
      id: '09',
      text: 'September'
    },
    {
      id: '10',
      text: 'October'
    },
    {
      id: '11',
      text: 'November'
    },
    {
      id: '12',
      text: 'December'
    }
  ];
  years: any;
  now = new Date();

  employerNo: any;
  employerName: any;
  effectiveDate: any;
  scope: any;
  status: any;

  hideEmpDataGrid = true;

  searchForm: FormGroup;
  contributionDatasource = [];
  employerContributionRecords = [];
  endPoint = 'backend/request';

  hideEmployerContributionRecords = true;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.searchForm = new FormGroup({
      searchParam: new FormControl(null, Validators.compose([Validators.required])),
      contributionYear: new FormControl(null, Validators.compose([Validators.required])),
      contributionMonth: new FormControl(null, Validators.compose([Validators.required])),
      customerNumber: new FormControl(null, Validators.compose([]))
    })
    this.years = this.contributionService.getYears();
  }


  searchRecords() {

    if (this.searchForm.invalid) {
      this.toastr.error('Please fill up all searching options.');
      return;
    }

    const request = {
      "requestType": "COMPLIANCE_MONTHLY",
      "contributingPeriod": `${this.searchForm.get('contributionYear').value}${this.searchForm.get('contributionMonth').value}`,
      "scope": this.searchForm.get('searchParam').value /* UNCONTRIBUTED | ALL  */
    };
    this.spinner.show();
    this.utilities.postServiceCall(request, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.contributionDatasource = [];
          this.contributionDatasource = response.data.contributions;
          this.hideEmpDataGrid = false;
          this.hideEmployerContributionRecords = true;
          this.toastr.success(res.message);
          this.spinner.hide();
        } else {
          this.toastr.error(response.message, 'Error');
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }



  searchEmployerRecords() {

    if (this.searchForm.get('customerNumber').value === null || `${this.searchForm.get('customerNumber').value}`.trim() == '') {
      this.toastr.error('Please enter employer number.');
      return;
    }

    const request = {
        "requestType": "COMPLIANCE_EMPLOYER",
        "employerRef": this.searchForm.get('customerNumber').value,
        "scope": "ALL"
    };
    this.spinner.show();
    this.utilities.postServiceCall(request, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.employerContributionRecords = [];
          this.employerNo = response.data.employerNo;
          this.employerName = response.data.employerName;
          this.effectiveDate = response.data.effectiveDate;
          this.scope = response.data.scope;
          this.status = response.data.status;
          this.employerContributionRecords = response.data.contributions;
          this.hideEmployerContributionRecords = false;
          this.hideEmpDataGrid = false;
          this.toastr.success(res.message);
          this.spinner.hide();
        } else {
          this.toastr.error(response.message, 'Error');
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }

}
