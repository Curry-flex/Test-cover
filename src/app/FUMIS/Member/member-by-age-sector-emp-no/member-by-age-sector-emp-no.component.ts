import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-by-age-sector-emp-no',
  templateUrl: './member-by-age-sector-emp-no.component.html',
  styleUrls: ['./member-by-age-sector-emp-no.component.scss']
})
export class MemberByAgeSectorEmpNoComponent extends SharedClassComponent implements OnInit {

  sectorList:any =[]
  filterMemberForm: FormGroup;
  memberList: any =[];

  ngOnInit() {

    this.filterMemberForm = new FormGroup({

      empNo: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      age: new FormControl('', Validators.compose([])),
     

    });

    this.getSectors()
  }


  filterMember()
  {

  
    const data ={
      "requestType": "MEMBER_ABOVE_AGE_BY_SECTOR_AND_EMPLOYER",
      "employerNumber": this.filterMemberForm.get("empNo").value,
      "age": this.filterMemberForm.get("age").value,
      "sector": this.filterMemberForm.get("sector").value

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



  getSectors() {
    const data = {
      requestType: "SECTOR_LIST",
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.sectorList = response.data;
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


}
