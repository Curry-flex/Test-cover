import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-report',
  templateUrl: './employer-report.component.html',
  styleUrls: ['./employer-report.component.scss']
})
export class EmployerReportComponent extends SharedClassComponent implements OnInit {

  title = 'Employers Registration Report (Daily, Weekly, Monthly, Yearly)';
  modelName = 'backend/request';
  requestType = 'REPORT_EMPLOYERS_REG';

  yearlyReport = [];
  monthlyReport = [];
  weeklyReport = [];
  dailyReport = [];

  tab_paneldata: any = [{
    ID: 1,
    name: 'Daily',
}, {
    ID: 2,
    name: 'Weekly',
}, {
    ID: 3,
    name: 'Monthly',
}, {
  ID: 4,
  name: 'Yearly',
}];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.appInfo.setTitle(this.title);
    this.fetchReports();
  }

  fetchReports() {
    const data = {
      requestType: this.requestType
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.modelName).subscribe(
      response => {
        this.yearlyReport = [];
        this.monthlyReport = [];
        this.weeklyReport = [];
        this.dailyReport = [];
        if (response.code == 2000) {
          this.yearlyReport = response.data.yearlyReport;
          this.monthlyReport = response.data.monthlyReport;
          this.weeklyReport = response.data.weeklyReport;
          this.dailyReport = response.data.dailyReport;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error('Error Occured while processing the request, Error ->' + JSON.stringify(error));
        this.spinner.hide();
      }
    );
  }

}
