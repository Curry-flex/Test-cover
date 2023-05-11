import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-report-fumis',
  templateUrl: './employer-report-fumis.component.html',
  styleUrls: ['./employer-report-fumis.component.scss']
})
export class EmployerReportFumisComponent extends SharedClassComponent implements OnInit {

  employerList: any =[]
  filterEmployerForm: FormGroup;
  sectorList: any =[]
  districtList: any=[]
  regionList: any=[]
  natureBusinessList: any=[]
  districtListNew: any =[];

  ngOnInit() {

    this.filterEmployerForm = new FormGroup({

      regNo: new FormControl('', Validators.compose([])),
      district: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      natureBusines: new FormControl('', Validators.compose([])),
      
      region: new FormControl('', Validators.compose([])),
     

    });

    this.getSectors()
    this.getDistricts()
    this.getRegion()
    this.businessNature()
  }


  filterEmployers()
  {
   
    
    const data ={
    
      "requestType": "EMPLOYER_REPORTS",
      "sectorID": this.filterEmployerForm.get("sector").value,
      "NOBID": this.filterEmployerForm.get("natureBusines").value,
      "districtID": this.filterEmployerForm.get("district").value,
      "regionID": this.filterEmployerForm.get("region").value
    }

    console.log(data)

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      console.log(res)
      this.spinner.hide();
      if (res.code == 2000) {
        this.employerList = res.data
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

  filterDistricts(e)
  {
   
    this.districtListNew =this.districtList.filter((res) => res.regionId == e.value)
 
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

  getRegion() {
    const data = {
      requestType: "REGION_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.regionList = response.data;
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

  businessNature() {
    const data = {
      requestType: "NATURE_OF_BUSINESS_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.natureBusinessList = response.data;
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
