import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-receipt-list',
  templateUrl: './contribution-receipt-list.component.html',
  styleUrls: ['./contribution-receipt-list.component.scss']
})
export class ContributionReceiptListComponent extends SharedClassComponent implements OnInit {
  fetchForm: FormGroup;
  branchList: any =[];
  receptDatasource = []

 

  ngOnInit() {

    this.fetchForm = new FormGroup({
      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      empNum: new FormControl('', Validators.compose([])),
      mNumber: new FormControl('', Validators.compose([])),
      branchCode: new FormControl('', Validators.compose([])),
 
    });

    this.fetchForm.reset()
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


  getData() {

    let sDate
    let eDate

    if (this.fetchForm.get('startDate').value == null) {
      this.fetchForm.get('startDate').patchValue("");
    }

    if (this.fetchForm.get('endDate').value == null) {
      this.fetchForm.get('endDate').patchValue("");
    }

    const startDatestring = new Date(this.fetchForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.fetchForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('endDate').value).getDate()).slice(-2);

    if (new Date(startDatestring) > new Date(endDatestring)) {
      this.toastr.error("Start Date is greater than end Date.");
      this.spinner.hide();
      return;
    }

    if(startDatestring.trim() == "NaN-aN-aN")
    {
      sDate = ""
    }
    else{
      sDate = startDatestring
    }

    if(endDatestring.trim() == "NaN-aN-aN")
    {
      eDate = ""
    }
    else{
      eDate = endDatestring
    }
   

      const data = {
        "requestType":"CONTRIBUTION_RECEIPT_LIST",
        "employerNumber": this.fetchForm.get("empNum").value,
        "memberNumber": this.fetchForm.get("mNumber").value,
        "branch": this.fetchForm.get("branchCode").value,
        "startDate": sDate,
        "endDate": eDate,


      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.receptDatasource = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }


    previewDetailsu(e)
    {
      console.log(e.data.MemberNumber);
  
      const data = {
        "requestType": "CONTRIBUTION_RECEIPT_GET",
        "receiptID": e.data.ReceiptID
      };
      this.spinner.show();
      this.utilities.postServiceCallNew(data).subscribe(
        (res) => {
          const response = res;
          if (response.code == 2000) {
            sessionStorage.removeItem("singleReceiptData")
            sessionStorage.setItem("singleReceiptData", JSON.stringify(response.data))
            this.router.navigateByUrl('fumis-contribution-receipt-info')
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
