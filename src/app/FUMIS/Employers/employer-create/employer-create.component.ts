import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-create',
  templateUrl: './employer-create.component.html',
  styleUrls: ['./employer-create.component.scss']
})
export class EmployerCreateComponent extends SharedClassComponent implements OnInit {
  fumisEmployerCreateForm : FormGroup
  sectorList: any =[]
  districtList: any =[]
  natureBusinessList: any =[];
  branchList =[]

  // constructor() { }

  ngOnInit() {

    this.fumisEmployerCreateForm = new FormGroup({
      
      emName: new FormControl('', Validators.compose([Validators.required])),
      altName: new FormControl('', Validators.compose([])),
      acronomy: new FormControl('', Validators.compose([])),
      regNo: new FormControl('', Validators.compose([Validators.required])),
      district: new FormControl('', Validators.compose([Validators.required])),
      sector: new FormControl('', Validators.compose([Validators.required])),
      natureBusines: new FormControl('', Validators.compose([])),
      postalAddress: new FormControl('', Validators.compose([Validators.required])),
      physicalAddress: new FormControl('', Validators.compose([])),
      emailAddress: new FormControl('', Validators.compose([])),
      regDate: new FormControl('', Validators.compose([Validators.required])),
      opDate: new FormControl('', Validators.compose([Validators.required])),
      telephone: new FormControl('', Validators.compose([])),
      mobile: new FormControl('', Validators.compose([])),
      faxnumber: new FormControl('', Validators.compose([])),
      contactPerson: new FormControl('', Validators.compose([])),
      branchCode: new FormControl('', Validators.compose([])),
      website: new FormControl('', Validators.compose([])),

    });

    this.getDistricts()
    this.getSectors()
    this.businessNature()
    this.branch()
  }

  createEmployer()
  {
    if(this.fumisEmployerCreateForm.get("emName").invalid)
    {
      this.toastr.error("Employer name required")
      return;
    }
    if(this.fumisEmployerCreateForm.get("regNo").invalid)
    {
      this.toastr.error("Registration number required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("district").invalid)
    {
      this.toastr.error("District required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("sector").invalid)
    {
      this.toastr.error("Sector required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("postalAddress").invalid)
    {
      this.toastr.error("Postal address required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("regDate").invalid)
    {
      this.toastr.error("Registration date required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("opDate").invalid)
    {
      this.toastr.error("First operation date required")
      return;
    }

    if(this.fumisEmployerCreateForm.get("regDate").value == null)
    {
      this.fumisEmployerCreateForm.get("regDate").patchValue(this.today)
    }

    if(this.fumisEmployerCreateForm.get("opDate").value == null)
    {
      this.fumisEmployerCreateForm.get("opDate").patchValue(this.today)
    }

    const registrationtDate = new Date(this.fumisEmployerCreateForm.get('regDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fumisEmployerCreateForm.get('regDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fumisEmployerCreateForm.get('regDate').value).getDate()).slice(-2);
    const operationDate = new Date(this.fumisEmployerCreateForm.get('opDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fumisEmployerCreateForm.get('opDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fumisEmployerCreateForm.get('opDate').value).getDate()).slice(-2);

    const data ={
      "requestType": "EMPLOYER_CREATE",
      "employerName": this.fumisEmployerCreateForm.get('emName').value,
      "alternateName": this.fumisEmployerCreateForm.get('altName').value,
      "acronym": this.fumisEmployerCreateForm.get('acronomy').value,
      "registrationNumber":this.fumisEmployerCreateForm.get('regNo').value,
      "districtId": this.fumisEmployerCreateForm.get('district').value,
      "sectorId": this.fumisEmployerCreateForm.get('sector').value,
      "natureOfBusiness": this.fumisEmployerCreateForm.get('natureBusines').value,
      "postalAddress": this.fumisEmployerCreateForm.get('postalAddress').value,
      "physicalAddress": this.fumisEmployerCreateForm.get('physicalAddress').value,
      "registrationDate":registrationtDate,
      "firstOperationDate": operationDate,
      "emailAddress": this.fumisEmployerCreateForm.get('emailAddress').value,
      "website": this.fumisEmployerCreateForm.get('website').value,
      "telephoneOffice": this.fumisEmployerCreateForm.get('telephone').value,
      "telephoneMobile": this.fumisEmployerCreateForm.get('mobile').value,
      "faxNumber": this.fumisEmployerCreateForm.get('faxnumber').value,
      "contactPerson": this.fumisEmployerCreateForm.get('contactPerson').value,
      "isActive": "1",
      "branchCode": this.fumisEmployerCreateForm.get('branchCode').value
    }
    this.spinner.show()
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      console.log(res)
      this.spinner.hide();
      if (res.code == 2000) {
        this.toastr.success(res.message)
        this.fumisEmployerCreateForm.reset();
        this.router.navigateByUrl("fumis-employer-list")
        
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

  branch() {
    const data = {
      requestType: "BRANCHES",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.branchList = response.data;
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
