import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-short-remiitance',
  templateUrl: './short-remiitance.component.html',
  styleUrls: ['./short-remiitance.component.scss']
})
export class ShortRemiitanceComponent extends SharedClassComponent implements OnInit {

  month = [
    {name:"January",value:"01"},
    {name:"February",value:"02"},
    {name:"March",value:"03"},
    {name:"April",value:"04"},
    {name:"May",value:"05"},
    {name:"June",value:"06"},
    {name:"July",value:"07"},
    {name:"August",value:"08"},
    {name:"September",value:"09"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]

  optionList =[
    {
      value:1,
      name:"All"
    },
    {
      value:2,
      name:"Balanced"
    },
    {
      value:3,
      name:"Under Payment"
    },
    {
      value:4,
      name:"Over Payment"
    }
  ]
  
  years =[]
  shorttermForm: FormGroup
  shortRemmitanceList =[]

  

  ngOnInit() {
    this.years = this.getYears()
    this.shorttermForm = new FormGroup({
     
      options: new FormControl('', Validators.compose([Validators.required])),
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

  getData()
  {
    if(this.shorttermForm.invalid)
    {
      this.toastr.error("Input all required fields")
      return
    }


    const data = {
    
      "requestType": "GET_SHORT_REMITTANCE",
      "loadOptions": this.shorttermForm.get("options").value,
      "contributionMonth": this.shorttermForm.get("month").value,
      "contributionYear": this.shorttermForm.get("year").value
  };
  this.spinner.show();
  this.utilities.postServiceCallNew(data).subscribe(
    (res) => {
      const response = res;
      if (response.code == 2000) {
        this.shortRemmitanceList = response.data;
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
