import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent extends SharedClassComponent implements OnInit {

  title = 'Audit Trail';
  modelName = 'backend/request';
  requestType = "AT_LOGS";
  hideViewDetailsTable = true;

  id: any;
  tableName: any;
  appUser: any;
  dbUser: any;
  eventType: any;
  eventDesc: any;
  eventDate: any;

  originalData = [];
  modifiedData = [];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.fetchRequestTypes('AT_LOGS');
  // Controls the datagrid height and max rows to display
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }

  onViewAdditionalDetails(e) {
    const data = {
      requestType: 'AT_LOG_ITEM',
      logId: e.data.id
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.modelName).subscribe(
      response => {
        this.originalData = [];
        this.modifiedData = [];
        this.id = null;
        this.tableName = null;
        this.appUser = null;
        this.dbUser = null;
        this.eventType = null;
        this.eventDesc = null;
        this.eventDate = null;
        if (response.code == 2000) {
          this.id = response.data.id;
          this.tableName = response.data.tableName;
          this.appUser = response.data.appUser;
          this.dbUser = response.data.dbUser;
          this.eventType = response.data.eventType;
          this.eventDesc = response.data.eventDesc;
          this.eventDate = response.data.eventDate;

          this.originalData.push(response.data.originalData);
          this.modifiedData.push(response.data.modifiedData);

          this.hideViewDetailsTable = false;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error('Error Occured while processing the request, Error -> ' + error);
        this.spinner.hide();
      }
    );
  }

  onCloseViewDetailsTable() {
    this.hideViewDetailsTable = true;
  }
}
