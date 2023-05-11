import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { DxDateBoxComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';


@Component({
  selector: 'member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss']
})
export class MemberRegistrationComponent extends SharedClassComponent implements OnInit {
  modelName = 'backend/request';
  title = 'Members';

  // variables declaration reactive forms
  paramwinfrm: FormGroup;
  questionsForm: FormGroup;
  securityQuestionsForm: FormGroup;
  password: any;
  rolesList1 = [];
  rolesList11 = [];

  namePattern: any = /^[^0-9]+$/;
  passwordRegex = '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}';


  currentPage = 0;
  pageSize = 10;

  genderls = ['MALE', 'FEMALE'];
  selectedOptiongender: string;

  maritialStatus = ['MARRIED', 'FEMALE', 'DIVORCED', 'WIDOW', 'WIDOWER','REMARRIED'];
  selectedOptionmaritial: string;

  nationality = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic (CAR)",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia (FYROM)",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];  
  selectedOptionnationality: string;

  religion = [
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Sikhism",
    "Judaism",
    "Bahá'í Faith",
    "Confucianism",
    "Taoism",
    "Shinto",
    "Zoroastrianism",
    "Jainism",
    "Shamanism",
    "Cao Dai",
    "Tenrikyo",
    "Rastafarianism",
    "Scientology",
    "Eckankar",
    "Spiritism",
    "Unitarian Universalism",
    "Wicca",
    "New Age",
    "Agnosticism",
    "Atheism"
  ];
  ;
  selectedOptionreligion: string;

  region = [
    "Unguja Mjini Magharibi",
    "Unguja Kaskazini",
    "Unguja Kusini",
    "Mjini Magharibi",
    "Kaskazini Unguja",
    "Kusini Unguja"
  ];
  selectedOptionregion: string;

  district = [
    "Central District",
    "Micheweni District",
    "Mkoani District",
    "North A District",
    "North B District",
    "South District",
    "Unguja Kaskazini A District",
    "Unguja Kaskazini B District",
    "Unguja Kusini A District",
    "Unguja Kusini B District",
    "Urban West District",
    "West District"
  ];
  selectedOptiondistrict: string;

  shehia = [
    "Bububu",
    "Chukwani",
    "Dole",
    "Dunga Bweni",
    "Fuoni Kibondeni",
    "Kama",
    "Kambi ya Utembo",
    "Kibweni",
    "Kidimni",
    "Kikwajuni B",
    "Kikwajuni A",
    "Kilimahewa",
    "Kilombero",
    "Kilimani",
    "Kiponda",
    "Kisiwandui",
    "Kiwengwa",
    "Kombeni",
    "Konde",
    "Kwaalinatu",
    "Machui",
    "Magogoni",
    "Makadara",
    "Makunduchi",
    "Mangapwani",
    "Masingini",
    "Mbuzini",
    "Meli 1",
    "Meli 2",
    "Michamvi Kae",
    "Michamvi Kisiwani",
    "Miembeni",
    "Miembeni Kati",
    "Mikunguni",
    "Mkunazini",
    "Mpendae",
    "Mto Pepo",
    "Mtoni",
    "Mwanakwerekwe",
    "Mwembeshauri",
    "Mwera",
    "Nungwi",
    "Paje",
    "Pangeni",
    "Shangani",
    "Shaabani",
    "Shaurimoyo",
    "Sogea",
    "Tangasisi",
    "Tazani",
    "Tunguu",
    "Ukongoroni",
    "Unguja Ukuu",
    "Uroa"
  ];
  selectedOptionshehia: string;

  dependents = ['Child', 'Spouse', 'Parent', 'Sibling', 'Grandparent', 'Grandchild'];
  selectedOptiondependents: string;

  tanzaniaIdTypes = ["NIDA", "ZANID", "Voters ID", "Passport", "Driver's License", "Birth Certificate", "Student ID"];
  selectedOptiontanzaniaIdTypes: string;

  districtList =[];

  paramswinpnl: boolean = false; // hide/show the pop up panel
  endpointcall:string; // end point string

  response:any; // hold response data from server
  // object array to store registration data
  RegistrationData: any;

  index = 1; // used as indicator of the string which shows the total qns answered.
  registrationEndPoint = 'backend/request'; // end point
  // datasource
  onPageIndexChanged(e) {
    //this.currentPage = e.pageIndex;
  }
  alertDialogMessage = '';
  showAlertDialog = false;
  ngOnInit() {
    this.paramwinfrm = new FormGroup({
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      middleName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      motherName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      domicile: new FormControl('', Validators.compose([Validators.required])),
      dateOfBirth: new FormControl('', Validators.compose([Validators.required])),
      dateJoiningFund: new FormControl('', Validators.compose([Validators.required])),
      gender: new FormControl('', Validators.compose([Validators.required])),
      maritialStatus: new FormControl('', Validators.compose([Validators.required])),
      nationality: new FormControl('', Validators.compose([Validators.required])),
      religion: new FormControl('', Validators.compose([Validators.required])),
      region: new FormControl('', Validators.compose([Validators.required])),
      district: new FormControl('', Validators.compose([Validators.required])),
      shehia: new FormControl('', Validators.compose([Validators.required])),
      branchName: new FormControl('', Validators.compose([Validators.required])),
      postalAddress: new FormControl('', Validators.compose([])),
      physicalAddress:new FormControl('', Validators.compose([])),
      telephoneNo: new FormControl('', Validators.compose([])),
      email: new FormControl('', Validators.compose([])),
      date1: new FormControl(null, Validators.compose([Validators.required])),
      identificationType: new FormControl('', Validators.compose([])),
      identificationNo: new FormControl('', Validators.compose([])),
      employername: new FormControl(null, Validators.compose([Validators.required])),
      date2: new FormControl(null, Validators.compose([Validators.required])),
      salary: new FormControl(null, Validators.compose([Validators.required])),
      fullname: new FormControl(null, Validators.compose([Validators.required])),
      dependentType: new FormControl(null, Validators.compose([Validators.required])),
      date3: new FormControl(null, Validators.compose([Validators.required])),
    });
    this.onGetRolesList('USERGROUPS_LIST');
    this.fetchRequestTypes('MEMBERS_LIST_');
    this.fetchRequestTypes11('EMPLOYERS_LIST');
    this.onGetParamsdetails();

// Controls the datagrid height and max rows to display
    this.observerCall();
  }


  // call getParamsdetails function to refresh datagid
  refreshDataGrid() {
    this.onGetParamsdetails();
  }

 passwordComparison = () => {
  return this.password;
}

@ViewChildren('dateBox1, dateBox2') dateBoxes: QueryList<DxDateBoxComponent>;
  now1: Date = new Date();
  now2: Date = new Date();

  getValue() {
    const dateValues = this.dateBoxes.map(dateBox => dateBox.instance);
    console.log(dateValues); // Output the retrieved date values
  }

  onSubmitAccountForm() {
    // checks if the submitted form is invalid
    
    if (this.paramwinfrm.invalid) {
      const uniqueID = "979123";
      ///window.location.href = "memberregistration://localhost:4201/#/member-registration?key=${uniqueID}";
      this.toastr.error('Please fill in all the required details.', 'Members Details Required');
      return;
      //window.location.href = "memberregistration://"+uniqueID;
    }

  
    // const requireLinkID = ['EMPLOYER','INDIVIDUAL_CONTRIBUTOR','MONEY_MARKET_CUSTOMER','RENT_CUSTOMER','SALES_CUSTOMER'];

    // if (requireLinkID.includes(`${this.paramwinfrm.get('userGroup').value}`)) {
    //   if(this.paramwinfrm.get('linkId').value === null || this.paramwinfrm.get('linkId').value === undefined || `${this.paramwinfrm.get('linkId').value}`.trim() == '') {
    //     this.toastr.error(`Link ID is required for ${requireLinkID[requireLinkID.indexOf(`${this.paramwinfrm.get('userGroup').value}`)]} registration.`, 'Link ID Required');
    //     return;
    //   }
    // }
  
    this.RegistrationData = {
       //dateValues : this.dateBoxes.map(dateBox => dateBox.instance.value),
        requestType: "MEMBER_CREATE",
        firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
        middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
        lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
        motherName: `${this.paramwinfrm.get('motherName').value}`.trim(),
        domicile: `${this.paramwinfrm.get('domicile').value}`.trim(),
        dateOfBirth: this.paramwinfrm.get('dateOfBirth').value, 
        dateJoiningFund:  this.paramwinfrm.get('dateJoiningFund').value,
        gender: `${this.paramwinfrm.get('gender').value}`.trim(),
        maritialStatus: `${this.paramwinfrm.get('maritialStatus').value}`.trim(),
        nationality: `${this.paramwinfrm.get('nationality').value}`.trim(),
        religion: `${this.paramwinfrm.get('religion').value}`.trim(),
        region: `${this.paramwinfrm.get('region').value}`.trim(),
        district: `${this.paramwinfrm.get('district').value}`.trim(),
        shehia: `${this.paramwinfrm.get('shehia').value}`.trim(),
        branchName: `${this.paramwinfrm.get('branchName').value}`.trim(),
        postalAddress: `${this.paramwinfrm.get('postalAddress').value}`.trim(),
        physicalAddress: this.paramwinfrm.get('physicalAddress').value,
        telephoneNo: this.paramwinfrm.get('telephoneNo').value,
        email: this.paramwinfrm.get('email').value,
        date1: this.paramwinfrm.get('date1').value,
        identificationType: this.paramwinfrm.get('identificationType').value,
        identificationNo: this.paramwinfrm.get('identificationNo').value,
        employername: `${this.paramwinfrm.get('employername').value}`.trim(),
        date2: this.paramwinfrm.get('date2').value,
        salary: this.paramwinfrm.get('salary').value,
        fullname: this.paramwinfrm.get('fullname').value,
        dependentType: this.paramwinfrm.get('dependentType').value,
        date3: this.paramwinfrm.get('date3').value,
    };
    console.log('vshjsvvhv are you matching')
    // show loading spinner
    //this.spinner.show();
    // call utilities' service postservicecall to submit registration data to server.
    this.utilities
      .postServiceCall(this.RegistrationData, this.registrationEndPoint)
      .subscribe(
        (res) => {
          this.response = res;
          this.spinner.hide();
          if (this.response.code == 2000) {
          
            //const result = this.response;
          //  this.toastr.success(result.message, 'Response');
            this.paramswinpnl = false;
            this.onGetParamsdetails();
            // this.alertDialogMessage = `Member created successfully`;
            // this.showAlertDialog = true;
          
          } else {
           // window.location.href = "memberregistration:";
            this.toastr.error(this.response.message, 'Error msg');
          }
          this.spinner.hide();
          const uniqueID = "9791235";
          window.location.href = "memberregistration://"+uniqueID;
          //this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(
            'Something went wrong, please try again',
            'Request Failed'
          );
        }
      );
  }
  
  onParamsToolBarPreparing(e) {
    e.toolbarOptions.items.unshift( {
      location: 'before',
      widget: 'dxButton',
      options: {
        text: 'New User',
        type: 'default',
        icon: 'fa fa-plus',
        onClick: this.addNewParameter.bind(this)
      }
    }, {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        type: 'default',
       onClick: this.refreshDataGrid.bind(this)
      }
    });
  }
funcpopWidth(percentage_width) {
    if (window.innerWidth > 800){
      return  window.innerWidth * percentage_width / 100;
    } else {
      return  window.innerWidth - 50;
    }
  }

  getCountryCodes() {
    const countryCodes = [
      {
      countryCode: 'TZA',
      phonePrefix: '255'
      },
      {
      countryCode: 'KEN',
      phonePrefix: '254'
      },
      {
      countryCode: 'UGA',
      phonePrefix: '256'
      },
      {
      countryCode: 'BDI',
      phonePrefix: '257'
      },
      {
      countryCode: 'RWA',
      phonePrefix: '250'
      },
      {
      countryCode: 'MWI',
      phonePrefix: '265'
      },
      {
      countryCode: 'ZWE',
      phonePrefix: '263'
      },
      {
      countryCode: 'ZMB',
      phonePrefix: '260'
      }
      ];

    return countryCodes;
  }
  // onSubmitUserRegDetails() {

  // }

  getDistricts() {
    const data = {
      requestType: "DISTRICT_LIST",
    };
    ///this.spinner.show();
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

  updateUser(e) {
    if (this.paramwinfrm.invalid) {
      this.toastr.error('Please fill in all the required details.', 'User Details Required');
      return;
    }

    // const requireLinkID= ['EMPLOYER','INDIVIDUAL_CONTRIBUTOR','MONEY_MARKET_CUSTOMER','RENT_CUSTOMER','SALES_CUSTOMER'];

    // if (requireLinkID.includes(`${this.paramwinfrm.get('userGroup').value}`)) {
    //   if(this.paramwinfrm.get('linkId').value === null || this.paramwinfrm.get('linkId').value === undefined || `${this.paramwinfrm.get('linkId').value}`.trim() == '') {
    //     this.toastr.error(`Link ID is required for ${requireLinkID[requireLinkID.indexOf(`${this.paramwinfrm.get('userGroup').value}`)]} registration.`, 'Link ID Required');
    //     return;
    //   }
    // }

    this.RegistrationData = {
        requestType: "MEMBER_UPDATE_",
        userId: e.id,
        firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
        middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
        lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
        motherName: `${this.paramwinfrm.get('motherName').value}`.trim(),
        domicile: `${this.paramwinfrm.get('domicile').value}`.trim(),
        dateOfBirth: this.paramwinfrm.get('dateOfBirth').value, 
        dateJoiningFund:  this.paramwinfrm.get('dateJoiningFund').value,
        gender: `${this.paramwinfrm.get('gender').value}`.trim(),
        maritialStatus: `${this.paramwinfrm.get('maritialStatus').value}`.trim(),
        nationality: `${this.paramwinfrm.get('nationality').value}`.trim(),
        religion: `${this.paramwinfrm.get('religion').value}`.trim(),
        region: `${this.paramwinfrm.get('region').value}`.trim(),
        district: `${this.paramwinfrm.get('district').value}`.trim(),
        shehia: `${this.paramwinfrm.get('shehia').value}`.trim(),
        branchName: `${this.paramwinfrm.get('branchName').value}`.trim(),
        postalAddress: `${this.paramwinfrm.get('postalAddress').value}`.trim(),
        physicalAddress: this.paramwinfrm.get('physicalAddress').value,
        telephoneNo: this.paramwinfrm.get('telephoneNo').value,
        email: this.paramwinfrm.get('email').value,
        date1: this.paramwinfrm.get('date1').value,
        identificationType: this.paramwinfrm.get('identificationType').value,
        identificationNo: this.paramwinfrm.get('identificationNo').value,
        employername: `${this.paramwinfrm.get('employername').value}`.trim(),
        date2: this.paramwinfrm.get('date2').value,
        salary: this.paramwinfrm.get('salary').value,
        fullname: this.paramwinfrm.get('fullname').value,
        dependentType: this.paramwinfrm.get('dependentType').value,
        date3: this.paramwinfrm.get('date3').value,
    };

    // show loading spinner
    //this.spinner.show();
    // call utilities' service postservicecall to submit registration data to server.
    this.utilities
      .postServiceCall(this.RegistrationData, this.registrationEndPoint)
      .subscribe(
        (res) => {
          this.response = res;
          this.spinner.hide();
          if (this.response.code == 2000) {
            const result = this.response;
            this.toastr.success(result.message, 'Response');
            this.paramswinpnl = false;
            this.onGetParamsdetails();
          } else {
            this.toastr.error(this.response.message, 'Error');
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(
            error.message,
            'Request Failed'
          );
        }
      );
  }

disableEnableUser(e, flag) {
    const data = {
      requestType: 'USER_ENABLE_',
      userId: e.id,
      status: flag
  };
  this.spinner.show();
  this.utilities.postServiceCallNew(data).subscribe(res => {
    if (res.code == 2000) {
      this.paramswinpnl = false;
      this.toastr.success(res.message);
    } else {
      this.toastr.error(res.message);
    }
    this.spinner.hide();
  }, err => {
    this.toastr.error('Something went wrong while process the request: ' + err.message)
    this.spinner.hide();
  });
}


onSearchTermChange(){
  this.spinner.hide();
 const data = {
      requestType: "SEARCH_LIST",
      firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
      middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
      lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
      motherName: `${this.paramwinfrm.get('motherName').value}`.trim(),
      telephoneNo: this.paramwinfrm.get('telephoneNo').value,
      email: this.paramwinfrm.get('email').value,
    };
    //this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        this.response = res;
        if (this.response.code == 2000) {
          //this.districtList = response.data;
          const result = this.response;
            //this.toastr.success(result.message, 'Response');
            //this.paramswinpnl = false;
            this.alertDialogMessage = `Member Already Registered`;
            this.showAlertDialog = true;
        } else {
          //this.toastr.error(response.message, 'Error');
          // this.alertDialogMessage = `Member Not Registered`;
          // this.showAlertDialog = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        // this.toastr.error(
        //   'Something went wrong please try again',
        //   'Request Failed'
        // );
      }
    );
}

onSearchTermChangrr(){ this.spinner.hide();
  const data = {
       requestType: "SEARCH_LIST1",
       firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
       middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
       lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
       motherName: `${this.paramwinfrm.get('motherName').value}`.trim(),
       telephoneNo: this.paramwinfrm.get('telephoneNo').value,
       email: this.paramwinfrm.get('email').value,
     };
     this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        this.response = res;
        if (this.response.code == 2000) {
          this.rolesList1 = this.response.data;
        } else {
          //this.toastr.error(response.message, 'Error');
          // this.alertDialogMessage = `Member Not Registered`;
          // this.showAlertDialog = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        // this.toastr.error(
        //   'Something went wrong please try again',
        //   'Request Failed'
        // );
      }
    );

}

fetchRequestTypes1(requestType) {
  //this.spinner.hide();
  const data = {requestType,
    firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
    middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
    lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
    motherName: `${this.paramwinfrm.get('motherName').value}`.trim(),
    telephoneNo: this.paramwinfrm.get('telephoneNo').value,
    email: this.paramwinfrm.get('email').value,
  };
  
  //this.spinner.show()
  
  this.utilities.baseApiPostServiceCall(data).subscribe(
   
    response => {
      //this.spinner.hide()
      if (response.code == 2000) {
        this.rolesList1 = response.data;
      } else {
        //this.spinner.hide();
      }
      //this.spinner.hide();
    },
    error => {
      console.log(error);
    }
  );
}

fetchRequestTypes11(requestType) {
  const data = {requestType};
  this.utilities.baseApiPostServiceCall(data).subscribe(
    response => {
      for (const iterator of response.data) {
        this.rolesList11.push({
          userGroup: iterator.employerName,
          paginate: true,
          pageSize: 10
        })
        
      }
    },
    error => {
      console.log(error);
    }
  );
}


onSearchTermChang(e){
  console.log(e)
  //this.spinner.hide();
  this.fetchRequestTypes1('SEARCH_LIST1');
}

onSearchTermChang1(){
  //this.spinner.hide();
  this.fetchRequestTypes1('SEARCH_LIST2');
}

onSearchTermChang2(){
  //this.spinner.hide()
  this.fetchRequestTypes1('SEARCH_LIST3');
}

onSearchTermChang3(){
  //this.spinner.hide()
  this.fetchRequestTypes1('SEARCH_LIST4');
}

}
