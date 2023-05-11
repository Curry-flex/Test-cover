import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.scss']
})
export class MemberCreateComponent extends SharedClassComponent implements OnInit {
  fumisMemberCreateForm: FormGroup;
  sectorList: any =[]
  districtList: any =[]
  natureBusinessList: any =[];
  branchList =[]
  regionList =[]
  nationalityDataSource =[]
  shehiaList =[]
  religionList = []

  genderDataSource =[{name: 'male'}, {name: 'female'}]
  maritalDataSource =[{name:"Married"},{name:"Single"},{name:"Divorced"}]
  religionDataSource=[{name:"Christianity"},{name:"Islam"}]
  districtListNew: any = [];
  shehiaListNew: any = [];
  

  ngOnInit() {

    this.fumisMemberCreateForm = new FormGroup({
      
      fname: new FormControl('', Validators.compose([Validators.required])),
      mName: new FormControl('', Validators.compose([Validators.required])),
      lname: new FormControl('', Validators.compose([Validators.required])),
      motherName: new FormControl('', Validators.compose([])),
      domicile: new FormControl('', Validators.compose([])),
      gender: new FormControl('', Validators.compose([Validators.required])),
      marital: new FormControl('', Validators.compose([])),
      nationality: new FormControl('', Validators.compose([])),
      religion: new FormControl('', Validators.compose([])),
      physicalAddress: new FormControl('', Validators.compose([Validators.required])),
      postalAddress: new FormControl('', Validators.compose([])),
      emailAddress: new FormControl('', Validators.compose([])),
      telephone: new FormControl('', Validators.compose([])),
      mobile: new FormControl('', Validators.compose([])),
      NIN: new FormControl('', Validators.compose([])),
      district: new FormControl('', Validators.compose([Validators.required])),
      branchCode: new FormControl('', Validators.compose([Validators.required])),
      region: new FormControl('', Validators.compose([Validators.required])),
      DOB: new FormControl('', Validators.compose([Validators.required])),
      shehia: new FormControl('', Validators.compose([Validators.required])),
      dateJoinFund: new FormControl('', Validators.compose([])),

    });

    this.getSectors()
    this.getDistricts()
    this.branch()
    this.businessNature()
    this.getRegion()
    this.shehia()
    this.nationality()
    this.getReligion()
  }

  createMember()
  {


    if(this.fumisMemberCreateForm.get("fname").invalid)
    {
      this.toastr.error("First name required")
      return;
    }
    if(this.fumisMemberCreateForm.get("mName").invalid)
    {
      this.toastr.error("Middle name required")
      return;
    }

    if(this.fumisMemberCreateForm.get("lname").invalid)
    {
      this.toastr.error("last name required")
      return;
    }

    if(this.fumisMemberCreateForm.get("district").invalid)
    {
      this.toastr.error("District required")
      return;
    }

    if(this.fumisMemberCreateForm.get("region").invalid)
    {
      this.toastr.error("Region required")
      return;
    }
    
    if(this.fumisMemberCreateForm.get("shehia").invalid)
    {
      this.toastr.error("Shehia required")
      return;
    }
    if(this.fumisMemberCreateForm.get("gender").invalid)
    {
      this.toastr.error("Gender required")
      return;
    }

    if(this.fumisMemberCreateForm.get("DOB").invalid)
    {
      this.toastr.error("Date of birth required")
      return;
    }


    if(this.fumisMemberCreateForm.get("branchCode").invalid)
    {
      this.toastr.error("Branch code required")
      return;
    }

   

    if(this.fumisMemberCreateForm.get("postalAddress").invalid)
    {
      this.toastr.error("Postal address required")
      return;
    }

  
    

    const dateJoin = new Date(this.fumisMemberCreateForm.get('dateJoinFund').value).getFullYear() + "-"+  ("0"+(new Date(this.fumisMemberCreateForm.get('dateJoinFund').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fumisMemberCreateForm.get('dateJoinFund').value).getDate()).slice(-2);
    const DON = new Date(this.fumisMemberCreateForm.get('DOB').value).getFullYear() + "-"+  ("0"+(new Date(this.fumisMemberCreateForm.get('DOB').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fumisMemberCreateForm.get('DOB').value).getDate()).slice(-2);
    const DOB =("0" + new Date(this.fumisMemberCreateForm.get('DOB').value).getDate()).slice(-2) +"/"+ ("0"+(new Date(this.fumisMemberCreateForm.get('DOB').value).getMonth()+1)).slice(-2) +"/"+ new Date(this.fumisMemberCreateForm.get('dateJoinFund').value).getFullYear()
    const data ={

      "requestType": "MEMBER_CREATE",
      "firstName": this.fumisMemberCreateForm.get('fname').value,
      "middleName": this.fumisMemberCreateForm.get('mName').value,
      "surname": this.fumisMemberCreateForm.get('lname').value,
      "mothersName": this.fumisMemberCreateForm.get('motherName').value,
      "domicile": this.fumisMemberCreateForm.get('motherName').value,
      "dateOfBirth": DON,
      "dateofJoiningFund": dateJoin,
      "gender": this.fumisMemberCreateForm.get('gender').value,
      "maritalStatus": this.fumisMemberCreateForm.get('marital').value,
      "nationality": this.fumisMemberCreateForm.get('nationality').value,
      "religion": this.fumisMemberCreateForm.get('religion').value,
      "postalAddress": this.fumisMemberCreateForm.get('postalAddress').value,
      "physicalAddress": this.fumisMemberCreateForm.get('physicalAddress').value,
      "emailAddress": this.fumisMemberCreateForm.get('emailAddress').value,
      "mobilePhone": this.fumisMemberCreateForm.get('mobile').value,
      "telephone": this.fumisMemberCreateForm.get('telephone').value,
      "isActive": "0",
      "nationalID": this.fumisMemberCreateForm.get('NIN').value,
      "branchCode": this.fumisMemberCreateForm.get('branchCode').value,
      "regionID": this.fumisMemberCreateForm.get('region').value,
      "districtID": this.fumisMemberCreateForm.get('district').value,
      "shehiaID": this.fumisMemberCreateForm.get('shehia').value

      
    }
    this.spinner.show()
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      console.log(res)
      this.spinner.hide();
      if (res.code == 2000) {
        this.toastr.success(res.message)
        this.fumisMemberCreateForm.reset();
        this.router.navigateByUrl("fumis-member-list")
        
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

 filterShehia(e)
 {
   this.shehiaListNew =this.shehiaList.filter((res) => res.DistrictID == e.value) 
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


  getReligion() {
    const data = {
      requestType: "RELIGION_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.religionList = response.data;
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

  shehia() {
    const data = {
      requestType: "SHEHIA",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.shehiaList = response.data;
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

  nationality() {
    const data = {
      requestType: "NATIONALITY",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.nationalityDataSource = response.data;
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
