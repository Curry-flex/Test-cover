import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app-settings';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-feedback-management',
  templateUrl: './feedback-management.component.html',
  styleUrls: ['./feedback-management.component.scss']
})
export class FeedbackManagementComponent extends SharedClassComponent implements OnInit {

  dataSource: any[];
  totalFeedback = 0;
  pendingFeedback = 0;
  processedFeedback = 0;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.apiCall();
  }

  apiCall() {
    const data = {

    };
    this.spinner.show();
    this.utilities.helperApiCall(data, 'users/feedback').subscribe(res => {
      if (res.statusCode === 2000) {
        this.pendingFeedback = 0;
        this.processedFeedback = 0;
        this.dataSource = res.data;
        this.totalFeedback = this.dataSource.length;
        for (const iterator of this.dataSource) {
          if (iterator.status === 1) {
            this.processedFeedback += 1;
          }
          if (iterator.status === 0) {
            this.pendingFeedback += 1;
          }
        }
      } else {
        this.toastr.error(res.statusMessage);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  onViewUserFeedback(e) {
    sessionStorage.removeItem(AppSettings.feedbackKey);
    sessionStorage.setItem(AppSettings.feedbackKey, this.securityService.encryptString(e));
    if (e.status === 0) {
      this.router.navigate(['/user/feedback'], {queryParams: {flag: 0}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate(['/user/feedback'], {queryParams: {flag: 1}, queryParamsHandling: 'merge'});
    }
  }


  onReplyUserFeedback(e) {
    sessionStorage.setItem(AppSettings.feedbackKey, this.securityService.encryptString(e));
    this.router.navigate(['/user/feedback'], {queryParams: {flag: 1}, queryParamsHandling: 'merge'});
  }

  toolBarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.apiCall.bind(this)
        }
      }
    );
  }

}
