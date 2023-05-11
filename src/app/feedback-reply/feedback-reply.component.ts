import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app-settings';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-feedback-reply',
  templateUrl: './feedback-reply.component.html',
  styleUrls: ['./feedback-reply.component.scss']
})
export class FeedbackReplyComponent extends SharedClassComponent implements OnInit {
  isMultiline = true;
  flag = 0;
  feedbackData: any;
  feedbackReply = '';
  isNull = false;

  dateSubmitted: any;
  feedbackMessage: any;
  feedbackNumber: any;
  repliedBy: any;
  repliedOn: any;
  replyMessage: any;
  status: any;


  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.route.queryParams.subscribe(params => {
      this.flag = params.flag;
      });
    this.feedbackData = this.securityService.decryptString(sessionStorage.getItem(AppSettings.feedbackKey));
    if (this.feedbackData === null || this.feedbackData === undefined) {
      this.isNull = true;
      this.router.navigate(['/feedback-management']);
      return;
    }
    this.dateSubmitted = this.feedbackData.dateSubmitted;
    this.feedbackMessage = this.feedbackData.feedbackMessage;
    this.feedbackNumber = this.feedbackData.feedbackNumber;
    this.repliedBy = this.feedbackData.repliedBy;
    this.repliedOn = this.feedbackData.repliedOn;
    this.replyMessage = this.feedbackData.repliedMessage;
    // try {
    //   this.replyMessage = this.base64Service.decodeBase64UrlToString(this.feedbackData.repliedMessage);
    // } catch (error) {
    //   this.replyMessage = this.feedbackData.repliedMessage;
    // }
    this.status = this.feedbackData.status;
  }

  back() {
    sessionStorage.removeItem(AppSettings.feedbackKey);
    this.router.navigate(['/feedback-management']);
  }

  onReplySubmitted() {
    if (this.feedbackReply.trim().length < 1) {
      this.toastr.error('Please write a message to reply on the above user\'s feedback' );
      return;
    }

    const data = {
      id: this.feedbackData.id,
      repliedBy: `${this.authService.getUserDetails().firstName} ${this.authService.getUserDetails().middleName} ${this.authService.getUserDetails().lastName} (${this.authService.getUserDetails().systemId})`,
      repliedMessage: this.feedbackReply
    };
    this.spinner.show();
    this.utilities.helperApiCall(data, 'users/feedback/reply').subscribe(res => {
      if (res.statusCode === 2000) {
        this.router.navigate(['/feedback-management']);
        sessionStorage.removeItem(AppSettings.feedbackKey);
      } else {
        this.toastr.error(res.statusMessage);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


}
