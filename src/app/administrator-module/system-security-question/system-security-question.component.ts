import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-system-security-question',
  templateUrl: './system-security-question.component.html',
  styleUrls: ['./system-security-question.component.scss']
})
export class SystemSecurityQuestionComponent extends SharedClassComponent implements OnInit {
  title = 'Registration Security Questions';
  modelName = 'questions';
  ngOnInit() {
    this.paramwinfrm =  new FormGroup({
      id: new FormControl('', Validators.compose([])),
      question: new FormControl('', Validators.compose([Validators.required])),
      createdBy: new FormControl('', Validators.compose([])),
      createdAt: new FormControl('', Validators.compose([])),
      modifiedBy: new FormControl('', Validators.compose([])),
      modifiedAt: new FormControl('', Validators.compose([])),
      questionId: new FormControl('', Validators.compose([]))
    });
    this.onGetParamsdetails();
    // Controls the datagrid height and max rows to display
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }

}
