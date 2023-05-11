import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.scss']
})
export class InspectionListComponent extends SharedClassComponent implements OnInit {
  inspectionListForm: any;
  inspectionList: any =[];
  inspectionTypeList: any = [];


  ngOnInit() {

    this.inspectionType()
    this.inspectionListForm = new FormGroup({
      requestType: new FormControl('', Validators.compose([])),
      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      inspType: new FormControl('', Validators.compose([])),
    
    });
  }


  filterList()
  {
    let sDate
    let eDate

    if (this.inspectionListForm.get('startDate').value == null) {
      this.inspectionListForm.get('startDate').patchValue("");
    }

    if (this.inspectionListForm.get('endDate').value == null) {
      this.inspectionListForm.get('endDate').patchValue("");
    }

    const startDatestring = new Date(this.inspectionListForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionListForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionListForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.inspectionListForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionListForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionListForm.get('endDate').value).getDate()).slice(-2);

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
        "requestType": "INSPECTION_LIST",
        "startDate": sDate,
        "endDate": eDate,
        "type": this.inspectionListForm.get("inspType").value


      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.inspectionList = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }

    
  inspectionType()
  {
    
    const data = {
      "requestType": "INSPECTION_TYPES",
      
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.inspectionTypeList = response.data;
          
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


