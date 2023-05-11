import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-pension-uncollected',
  templateUrl: './pension-uncollected.component.html',
  styleUrls: ['./pension-uncollected.component.scss']
})
export class PensionUncollectedComponent extends SharedClassComponent implements OnInit {

  month = [
    {name:"January",value:"1"},
    {name:"February",value:"2"},
    {name:"March",value:"3"},
    {name:"April",value:"4"},
    {name:"May",value:"5"},
    {name:"June",value:"6"},
    {name:"July",value:"7"},
    {name:"August",value:"8"},
    {name:"September",value:"9"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]

  years = []
  uncollectedForm: FormGroup;
  uncollectedDatasource = []

  // constructor() { }

  ngOnInit() {
    this.years = this.getYears()

    this.uncollectedForm = new FormGroup({
   
      month: new FormControl('', Validators.compose([Validators.required])),
      year: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }

  public getYears() {
    const years = [];
    const initialYear = 2017;
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = currentYear; i >= initialYear; i--) {
      years.push(i);
    }
    return years;
  }

  getList() {
     
    if(this.uncollectedForm.invalid)
    {
      this.toastr.error("Please enter all required fields");
      return;
    }

     const data = {
      "requestType": "GET_UNCOLLECTED_PENSION",
      "paymentYear": this.uncollectedForm.get("year").value,
      "paymentMonth": this.uncollectedForm.get("month").value
     }
 
     this.spinner.show();
     this.utilities.baseApiPostServiceCall(data).subscribe(res => {
       this.spinner.hide();
       //console.log(res)
       const response = res;
       if (response.code == 2000) {
         this.toastr.success(response.message);
         this.uncollectedDatasource = response.data;
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
