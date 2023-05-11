import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-individual-reg-report',
  templateUrl: './member-individual-reg-report.component.html',
  styleUrls: ['./member-individual-reg-report.component.scss']
})
export class MemberIndividualRegReportComponent extends SharedClassComponent implements OnInit {
  filterMemberForm: FormGroup;
  individualData =[]



  ngOnInit() {
    this.filterMemberForm = new FormGroup({

      mNumber: new FormControl('', Validators.compose([])),

    });
  }


  filterMember()
  {

   
    const data ={
      "requestType": "INDIVIDUAL_REGISTRATION_MEMBER_REPORT",
      "memberNumber": this.filterMemberForm.get("mNumber").value,

    }

    this.spinner.show()

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
    this.spinner.hide()
      this.spinner.hide();
      if (res.code == 2000) {
        this.individualData = res.data
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
