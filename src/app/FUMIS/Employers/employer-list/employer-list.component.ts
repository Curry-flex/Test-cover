import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss']
})
export class EmployerListComponent extends SharedClassComponent implements OnInit {

  employerList: any =[]
  filterEmployerForm: FormGroup;
  sectorList: any =[]
  districtList: any=[]
  regionList: any=[]
  natureBusinessList: any=[]
  districtListNew: any = [];

  ngOnInit() {

    this.filterEmployerForm = new FormGroup({

      regNo: new FormControl('', Validators.compose([])),
      district: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      natureBusines: new FormControl('', Validators.compose([])),
      regDate: new FormControl('', Validators.compose([])),
      region: new FormControl('', Validators.compose([])),
     

    });

    this.getSectors()
    this.getDistricts()
    this.getRegion()
    this.businessNature()
  }


  filterEmployers()
  {
    if(this.filterEmployerForm.get("regDate").value == null)
    {
      this.filterEmployerForm.get("regDate").patchValue(this.today)
    }
    
    const registrationtDate = new Date(this.filterEmployerForm.get('regDate').value).getFullYear() + "-"+  ("0"+(new Date(this.filterEmployerForm.get('regDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.filterEmployerForm.get('regDate').value).getDate()).slice(-2);
    let regDate
    if(registrationtDate.trim() == "NaN-aN-aN")
    {
      regDate = ""
    }
    else{
      regDate = registrationtDate
    }
    const data ={
      "requestType": "EMPLOYER_LIST",
      "districtID": this.filterEmployerForm.get("district").value,
      "regionID": this.filterEmployerForm.get("region").value,
      "sectorID": this.filterEmployerForm.get("sector").value,
      "natureofBusinessID": "",
      "registrationDate": regDate,
      "isActive": "0"
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

  previewDetailsu(e)
  {
    //console.log(e.data.EmployerNumber);

    const data = {
      "requestType": "EMPLOYERS_GET",
      "employerNumber": e.data.EmployerNumber
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("singleEmployerData")
          sessionStorage.setItem("singleEmployerData", JSON.stringify(response.data))
          this.router.navigateByUrl('fumis-employer-info')
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

}
