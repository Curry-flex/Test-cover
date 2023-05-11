import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-system-privileges',
  templateUrl: './system-privileges.component.html',
  styleUrls: ['./system-privileges.component.scss']
})
export class SystemPrivilegesComponent extends SharedClassComponent implements OnInit {

  title = 'System User Groups';
  modelName = 'backend/request';
  requestType = 'PRIVILEDGES_LIST';
  ngOnInit() {
    this.fetchRequestTypes(this.requestType);
    this.appInfo.setTitle(this.title);
    this.paramwinfrm =  new FormGroup({
      id: new FormControl('', Validators.compose([])),
      name: new FormControl('', Validators.compose([Validators.required])),
      auth: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required])),
      priviledgeId: new FormControl('', Validators.compose([]))
    });
    // Controls the datagrid height and max rows to display
    this.observerCall();
  }



}
