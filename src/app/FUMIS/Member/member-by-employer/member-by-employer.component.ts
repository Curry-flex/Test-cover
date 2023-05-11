import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-by-employer',
  templateUrl: './member-by-employer.component.html',
  styleUrls: ['./member-by-employer.component.scss']
})
export class MemberByEmployerComponent extends SharedClassComponent implements OnInit {
  filterMemberForm: any = FormGroup;
  memberList: any = [];

  
  ngOnInit() {

    this.filterMemberForm = new FormGroup({

      empNo: new FormControl('', Validators.compose([])),
      empName: new FormControl('', Validators.compose([])),
      acronomy: new FormControl('', Validators.compose([])),
      altname: new FormControl('', Validators.compose([])),
     
     

    });
  }


  filterMember()
  {

    const data ={
      "requestType": "MEMBERS_BY_EMPLOYER",
      "employerNumber": this.filterMemberForm.get("empNo").value,
      "employerName": this.filterMemberForm.get("empName").value,
      "acronym": this.filterMemberForm.get("acronomy").value,
      "alternateName": this.filterMemberForm.get("altname").value

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


}
