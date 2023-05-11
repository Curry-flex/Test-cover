import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-access-logs',
  templateUrl: './access-logs.component.html',
  styleUrls: ['./access-logs.component.scss']
})
export class AccessLogsComponent extends SharedClassComponent implements OnInit {
  title = 'Invoice Summary';
  modelName = 'backend/request';
  requestType = "INVOICE_SUMMARY"

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.fetchRequestTypes('INVOICE_SUMMARY');
  // Controls the datagrid height and max rows to display
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }
}
