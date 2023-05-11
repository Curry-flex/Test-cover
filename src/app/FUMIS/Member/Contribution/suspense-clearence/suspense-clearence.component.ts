import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-suspense-clearence',
  templateUrl: './suspense-clearence.component.html',
  styleUrls: ['./suspense-clearence.component.scss']
})
export class SuspenseClearenceComponent extends SharedClassComponent implements OnInit {

  status: any = 0
  qotaList = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}]
  suspenseSummuryForm: FormGroup;
  summuryDatasource = []
  

  ngOnInit() {

    
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


  getSummury()
  {

      const data = {
     
        "requestType": "CONTRIBUTION_SUSPENSE_CLEARANCE",
        "isCleared": this.status

      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.summuryDatasource = response.data;
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
