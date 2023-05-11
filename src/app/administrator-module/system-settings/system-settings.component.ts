import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent extends SharedClassComponent implements OnInit {

  title = 'System Settings';
  modelName = 'backend/request';
  requestType = "SETTING_LIST"

  ngOnInit() {
    this.paramwinfrm =  new FormGroup({
      id: new FormControl('', Validators.compose([])),
      requestType: new FormControl('', Validators.compose([])),
      name: new FormControl('', Validators.compose([Validators.required])),
      value: new FormControl('', Validators.compose([Validators.required])),
      settingId: new FormControl('', Validators.compose([]))
    });
    this.fetchRequestTypes('SETTING_LIST');
  // Controls the datagrid height and max rows to display
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }

}
