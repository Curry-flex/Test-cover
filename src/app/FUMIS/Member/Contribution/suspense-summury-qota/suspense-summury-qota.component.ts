import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-suspense-summury-qota',
  templateUrl: './suspense-summury-qota.component.html',
  styleUrls: ['./suspense-summury-qota.component.scss']
})
export class SuspenseSummuryQotaComponent extends SharedClassComponent implements OnInit {

  status: any = 0
  qotaList = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}]
  suspenseSummuryForm: FormGroup;
  summuryDatasource = []
  year: any;
  

  ngOnInit() {

    this.suspenseSummuryForm = new FormGroup({
      qota: new FormControl('', Validators.compose([Validators.required])),
      fiscalYear: new FormControl('', Validators.compose([Validators.required])),
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


  getSummury()
  {

    if(this.suspenseSummuryForm.get("qota").invalid)
    {
      this.toastr.error("Select quarter to proceed")
      return
    }

    if(this.suspenseSummuryForm.get("fiscalYear").invalid)
    {
      this.toastr.error("Enter fiscal year to proceed")
      return
    }
   
      const data = {
     
        "requestType": "CONTRIBUTION_EMPLOYER_SUSPENSE_SUMMARY_QUARTERLY",
        "isCleared": this.status,
        "fiscalYear": this.suspenseSummuryForm.get("fiscalYear").value,
        "quarter": this.suspenseSummuryForm.get("qota").value


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

    getFiscalYear(e){
    
      const fyStartYear = +e.value ;
      const fyEndYear = fyStartYear + 1;
      
      this.year = `${fyStartYear}/${fyEndYear}`
      //return `${fyStartYear}/${fyEndYear}`;
    }
  }



