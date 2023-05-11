import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contributions-report',
  templateUrl: './contributions-report.component.html',
  styleUrls: ['./contributions-report.component.scss']
})
export class ContributionsReportComponent extends SharedClassComponent implements OnInit {

  title = 'Contributions Report';
  endPoint = 'backend/request';
  contributionsReportDatasource = [];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.getContributionsReport();
  }

  getContributionsReport() {
    const data = {
      requestType: 'CONTRIBUTIONS_REPORT'
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.contributionsReportDatasource = response.data;
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.spinner.hide();
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

  toolBarPreparing(e, refresh_action) {
    e.toolbarOptions.items.unshift(
         {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: refresh_action.bind(this)
        }
      }
    );
  }

}
