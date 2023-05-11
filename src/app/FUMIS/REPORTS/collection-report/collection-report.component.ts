import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent extends SharedClassComponent implements OnInit {

  collectionType =[
    {
      val:1,
      desc:"Monthly contribution"
    },

    {
      val:2,
      desc:"Salary arrears"
    },
    {
      val:3,
      desc:"Short remittance"
    },
    {
      val:4,
      desc:"Penalty"
    },
  ]
  correctionForm: FormGroup;
  collectionDatasource = []
 

  ngOnInit() {

    this.correctionForm = new FormGroup({
     
      collectionType: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl('', Validators.compose([Validators.required])),
     
    
    });
  }

  getData()
  {
    if(this.correctionForm.invalid)
    {
      this.toastr.error("Please enter required fields")
      return;
    }

    const startDate = new Date(this.correctionForm.get('date').value).getFullYear() + "-"+  ("0"+(new Date(this.correctionForm.get('date').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.correctionForm.get('date').value).getDate()).slice(-2);
    let date
    if(startDate.trim() == "NaN-aN-aN")
    {
      date = ""
    }
    else{
      date = startDate
    }


    const data ={
      "requestType": "COLLECTION_REPORT",
      "collectionType": this.correctionForm.get("collectionType").value,
      "startDate": date
    }

    this.spinner.show()

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
    this.spinner.hide()
      this.spinner.hide();
      if (res.code == 2000) {
        this.collectionDatasource = res.data
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
