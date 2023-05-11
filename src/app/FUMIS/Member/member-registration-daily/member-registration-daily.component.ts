import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-registration-daily',
  templateUrl: './member-registration-daily.component.html',
  styleUrls: ['./member-registration-daily.component.scss']
})
export class MemberRegistrationDailyComponent extends SharedClassComponent implements OnInit {

  branchList =[]
  filterMemberForm: FormGroup;
  memberList: any = [];
  status:any  =0
 

  ngOnInit() {
    this.filterMemberForm = new FormGroup({

      regDate: new FormControl('', Validators.compose([])),
      branchCode: new FormControl('', Validators.compose([])),
    
     

    });
    this.branch()
  }

  branch() {
    const data = {
      requestType: "BRANCHES",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.branchList = response.data;
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

  filterMember()
  {

    // if(this.filterMemberForm.get("regDate").value == null)
    // {
    //   this.filterMemberForm.get("regDate").patchValue(this.today)
    // }
    
    const registrationtDate = new Date(this.filterMemberForm.get('regDate').value).getFullYear() + "-"+  ("0"+(new Date(this.filterMemberForm.get('regDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.filterMemberForm.get('regDate').value).getDate()).slice(-2);
    let regDate
    if(registrationtDate.trim() == "NaN-aN-aN")
    {
      regDate = ""
    }
    else{
      regDate = registrationtDate
    }
    const data ={
      "requestType": "DAILY_MEMBER_REGISTRATION",
      "registrationDate": regDate,
      "isVerified": this.status,
      "branch": this.filterMemberForm.get("branchCode").value

    }

    this.spinner.show()

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
    this.spinner.hide()
      this.spinner.hide();
      if (res.code == 2000) {
        this.memberList = res.data
        this.toastr.success(res.message)
       
        
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });

  }

  onCheckChange(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
    if(ischecked)
    {
     this.status=1;
    }
    else{
     this.status=0;
    }
  }



}
