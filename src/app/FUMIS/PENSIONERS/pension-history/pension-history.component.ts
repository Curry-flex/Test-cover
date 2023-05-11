import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-pension-history',
  templateUrl: './pension-history.component.html',
  styleUrls: ['./pension-history.component.scss']
})
export class PensionHistoryComponent extends SharedClassComponent implements OnInit {

  isCollected =  [{name:"Collected",val:1},{name:"Not Collected",val: 0}]
  pensionersBatchHistorytForm: FormGroup ;
  batchDatasource = []


  ngOnInit() {
    this.pensionersBatchHistorytForm = new FormGroup({
     
      status: new FormControl('', Validators.compose([Validators.required])),
      startDate: new FormControl(this.today, Validators.compose([Validators.required])),
      endDate: new FormControl(this.today, Validators.compose([])),
    
    });
  }



  getList() {


     if(this.pensionersBatchHistorytForm.invalid)
     {
        this.toastr.error("Please enter all required fields");
        return;
     }

    const startDatestring = new Date(this.pensionersBatchHistorytForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.pensionersBatchHistorytForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.pensionersBatchHistorytForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.pensionersBatchHistorytForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.pensionersBatchHistorytForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.pensionersBatchHistorytForm.get('endDate').value).getDate()).slice(-2);

 

      const data = {
        "requestType": "PENSION_HISTORY",
        "startDate": startDatestring,
        "endDate": endDatestring,
        "isCollected": this.pensionersBatchHistorytForm.get("status").value

      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.batchDatasource = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }
}
