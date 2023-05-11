import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-compliance-uncontributed',
  templateUrl: './compliance-uncontributed.component.html',
  styleUrls: ['./compliance-uncontributed.component.scss']
})
export class ComplianceUncontributedComponent extends SharedClassComponent implements OnInit {

  // constructor() { }

  complianceForm:FormGroup
  sectorList =[]
  districtList =[]
  //yearList =[{year:2017},{year:2018},{year:2019},{year:2020},{year:2021},{year:2022},{year:2023},{year:2024},{year:2025}]
  yearList = []
  monthList =[{month:'01'},{month:'02'},{month:'03'},{month:'04'},{month:'05'},{month:'06'},{month:'07'},{month:'08'},{month:'09'},{month:'10'},{month:'11'},{month:'12'}]
  complianceDatasource = []
  showRecords = false

  ngOnInit() {

    this.complianceForm =  new FormGroup({
      sector: new FormControl('',Validators.compose([Validators.required])),
      district: new FormControl('',Validators.compose([Validators.required])),
      month: new FormControl('',Validators.compose([Validators.required])),
      year: new FormControl('',Validators.compose([Validators.required])),
    })

    this.getSectors()
    this.getDistricts()
     this.yearList= this.getYears()
     console.log(this.yearList)
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


  getDistricts() {
    const data = {
      requestType: "DISTRICT_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.districtList = response.data;
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

  fetchRecords() {
    this.showRecords = false;
    const data = {
      requestType: "COMPLIANCE_UNCONTRIBUTED",
      sector:this.complianceForm.get("sector").value,
      district:this.complianceForm.get("district").value,
      year:this.complianceForm.get("year").value,
      month:this.complianceForm.get("month").value,
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        console.log(response)
        if (response.code == 2000) {
           this.complianceDatasource = response.data.records;
           this.showRecords = true;
           this.toastr.success(response.message)
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

   getYears() {
    const years = [];
    const initialYear = 2017;
    const date = new Date();  
    const currentYear = date.getFullYear();

    for (let i = currentYear; i >= initialYear; i--) {
      years.push(i);
    }
    
    return years;
  }
  
}
