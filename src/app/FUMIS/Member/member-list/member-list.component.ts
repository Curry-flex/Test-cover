import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent extends SharedClassComponent implements OnInit {
  filterMemberForm: FormGroup;
  branchList =[]
  sectorList: any =[]


  genderDataSource =[{name: 'male'}, {name: 'female'}]
  memberList: any =[];
  

  ngOnInit() {

    
    this.filterMemberForm = new FormGroup({

      empNo: new FormControl('', Validators.compose([])),
      district: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      regDate: new FormControl('', Validators.compose([])),
      branchCode: new FormControl('', Validators.compose([])),
      gender: new FormControl('', Validators.compose([])),
      age: new FormControl('', Validators.compose([])),
     

    });

    this.branch()
    this.getSectors()
  }


  filterMember()
  {

    if(this.filterMemberForm.get("regDate").value == null)
    {
      this.filterMemberForm.get("regDate").patchValue(this.today)
    }
    
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
      "requestType": "MEMBER_LIST",
      "isVerified": "",
      "startDate": "",
      "endDate": "",
      "registrationDate": regDate,
      "branchCode": this.filterMemberForm.get("branchCode").value,
      "employerNumber": this.filterMemberForm.get("empNo").value,
      "sectorID": this.filterMemberForm.get("sector").value,
      "gender": this.filterMemberForm.get("gender").value,
      "age": this.filterMemberForm.get("age").value

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


  previewDetailsu(e)
  {
    console.log(e.data.MemberNumber);

    const data = {
      "requestType": "MEMBER_GET",
      "memberNumber": e.data.MemberNumber
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("singleMemberData")
          sessionStorage.setItem("singleMemberData", JSON.stringify(response.data))
          this.router.navigateByUrl('fumis-member-info')
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
