import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-inspection-summury',
  templateUrl: './inspection-summury.component.html',
  styleUrls: ['./inspection-summury.component.scss']
})
export class InspectionSummuryComponent extends SharedClassComponent implements OnInit {

  inspectionSummuryForm: any;
  inspectionSummury: any =[];
  groupLeadersList: any = [];


  ngOnInit() {
    this.groupLeader()
    this.inspectionSummuryForm = new FormGroup({
      requestType: new FormControl('', Validators.compose([])),
      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      inspLeader: new FormControl('', Validators.compose([])),
    
    });
  }


  filterSummury()
  {
    let sDate
    let eDate

    if (this.inspectionSummuryForm.get('startDate').value == null) {
      this.inspectionSummuryForm.get('startDate').patchValue("");
    }

    if (this.inspectionSummuryForm.get('endDate').value == null) {
      this.inspectionSummuryForm.get('endDate').patchValue("");
    }

    const startDatestring = new Date(this.inspectionSummuryForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionSummuryForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionSummuryForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.inspectionSummuryForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionSummuryForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionSummuryForm.get('endDate').value).getDate()).slice(-2);

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

        "requestType": "INSPECTION_SUMMARY",
        "startDate": sDate,
        "endDate": eDate,
        "inspLeaderID": this.inspectionSummuryForm.get("inspLeader").value
      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.inspectionSummury = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }

    groupLeader()
    {
      
      const data = {
        "requestType": "SYSTEM_USERS",
        
      };
      
      this.utilities.postServiceCallNew(data).subscribe(
        (res) => {
          const response = res;
          if (response.code == 2000) {
            this.groupLeadersList = response.data;
            
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
