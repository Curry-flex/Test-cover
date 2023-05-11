import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-security-manager',
  templateUrl: './security-manager.component.html',
  styleUrls: ['./security-manager.component.scss']
})
export class SecurityManagerComponent extends SharedClassComponent implements OnInit {
  title = 'Security Manager';
  passwordPattern = '^([a-zA-Z0-9@*#]{8,15})$';
  getAlertViaOptions = [];
  additionalSecurityForm: FormGroup;
  passwordChangeForm: FormGroup;


  ngOnInit() {

    this.getAlertViaOptions = [{
      text: 'Via Phone number',
      value: 1
    },
    {
      text: 'Via Email',
      value: 2
    }
  ];

    this.passwordChangeForm = new FormGroup({
    oldPassword: new FormControl(null, Validators.compose([Validators.required])),
    newPassword: new FormControl(null, Validators.compose([Validators.required])),
    confirmPassword: new FormControl(null, Validators.compose([Validators.required]))
  });

    this.additionalSecurityForm = new FormGroup({
    twoStepVerification: new FormControl(false),
    passwordChangeSwitch: new FormControl(true),
    unrecognizedAlerts: new FormControl(false),
    getAlertOption: new FormControl(this.getAlertViaOptions[0]),
    recoveryEmailSwitch: new FormControl(false),
    recoveryEmail: new FormControl(null)
  });
  }
  onSubmitAdditionalSecuritySettings() {
    // this.toastr.success('Security settings have been updated');
    console.log(this.additionalSecurityForm.value);
  }

  onSubmitPasswordChangeRequest() {
    // this.toastr.success('Password changed successfully');
    console.log(this.passwordChangeForm);
  }

  passwordComparison = () => {
    return this.passwordChangeForm.get('newPassword').value;
}
}
