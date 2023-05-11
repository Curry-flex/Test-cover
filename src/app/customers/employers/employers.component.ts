import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { AppSettings } from 'src/app/app-settings';
import csv2json from 'csvjson-csv2json/csv2json';
import notify from 'devextreme/ui/notify';
import XLSX from 'xlsx-style/dist/xlsx';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.scss']
})
export class EmployersComponent extends SharedClassComponent implements OnInit {

  prefixText = 'Correct Name is: ';
  hideInfoAlert = true;
  invoiceForm: FormGroup;
  customerForm: FormGroup;
  lastContributionDatasetForm: FormGroup;
  invoiceCreateEndPoint = 'portal/request';
  selectedRowIndex = -1;
  isFileValid = false;
  yearPattern = '^(19|20)\\d{2}$';
  monthPattern = '/^(0[1-9]|1[012])$/';
  employerContributionAmt = 0;
  memberContributionAmt = 0;
  currrentEmployerNumber: any;
  currentCustomerName = '';
  userGroup: any;
  isMultipleContributionMode = false;
  value: any[] = [];
  title = 'Create a contribution invoice on behalf of Employer';
  loadExistingListEndpointCall = 'employer/employees';
  createInvoiceEndpointCall = 'invoice/create';
  validateMemberNumberEndPoint = 'users/verify';
  validateEmployerNumberEndPoint = '';
  uploadFailedMessage = '';
  openFileUploadDialog = false;
  employeeUploadListDataSource: any = [];
  employeeUploadListDataSourceN =[]
  hideEmployeeListDataGrid = true;
  hideEmployeeFetchedDataListDataGrid = true;
  hideEmployeeListManualEntrance = true;
  hideEmployeeUploadForm = true;
  hideDataUploadControls = false;
  hideInitialInvoiceDetails = false;
  isUploadFileMethodSelected = false;
  hideBackButton = true;
  steps = 0;
  months = [];
  years: any;
  curDate = new Date();
  userDetails: any;
  currentMonth = this.curDate.getMonth() +  1;
  currentYear = this.curDate.getFullYear();
  isallowediting = true

  invoiceError: Error = null;
  buttonText = 'Create Invoice';
  iconText = 'save';
  showYearAndMonthColumn = true;
  batchContributionData = [];
  isContributionBatchRequest = false;
  isAddNewContributionToAnyExistingInvoice = false;
  invoiceIdToAddContribution;
  disableContributionType = false;
  lastContributionsDataSet = [];

  selectedContributionMonths = [];
  selectedContributionYear;
  selectedContributionType;
  descriptionString = '';
  monthInText = [];
  hideLoadMembersButton = true;
  showAlertDialog = false;
  showWarningDialog = false;
  alertReason = '';
  customerNumberSaved = false;
  showUpdate = false
  UpdatedArray =[]


  lastContributionTotalAmount = 0;
  currentContributionTotalAmount = 0;
  continueWithWarning = false;

  customerDetails = [];
  uncontributedPeriod = [];
  yearsMonths = [];
  monthSelected = []
  LimitedMonthGov =[]
  compensationZeroGov = false
  isEmployerGov = false
  isContributionMonthSelected = false
  isIndividualSelected = false
  myArrays: any = []

  user = this.authService.getUserDetails();

  showDialog = false;

  contributionType = [
    {
      id: 1,
      text: 'Contributions'
    },
    {
      id: 2,
      text: 'Arrears'
    },
    {
      id: 3,
      text: 'Adjustments'
    },
    {
      id: 4,
      text: 'Compensation'
    }
  ];

  hideContributionMonthGap = true;
  contributionMonthGapMessage = '';

  sivs = {
    requestType: "SETTING_LIST"
  }
  thresholdAmount = 10000;
  employerPercent = 13;
  memberPercent = 7;
  compensationPercent=1
  contributionAmountDiffInPercent = 80;
  allowAmountContributionGap = 1;
  settingsEndPoint = 'settings';
  isMemberNamesMatch: boolean = true;
  isMemberNumberValid: boolean = true;
  compensation =0;
  contributionYear:any = new Date().getFullYear()
  contributionTypeValue : any
  isNewRowInserted = false

 customerType = [{
    text: 'Employer',
    value: 1
  },
  {
    text: 'Individual Contributor',
    value: 2
  }
];

installmentType = [
  {
    text: 'Single Installment',
    value: 'SINGLE_INSTALLMENT'
  },
  {
  text: 'Multiple Installments',
  value: 'MULTIPLE_INSTALLMENTS'
  }
];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.lastContributionDatasetForm = new FormGroup({
      contributionPeriod: new FormControl(null, Validators.compose([Validators.required]))
    });
    // this.spinner.show();
    this.loadSettings();
   

    // this.currrentEmployerNumber = this.currrentEmployerNumber;
    // this.userGroup = this.authService.getUserDetails().userGroup;
    // this.currentCustomerName = this.authService.getUserDetails().currentCustomerName;

    // if (`${this.userGroup}`.match('EMPLOYER')) {
    //   this.getUncontributedPeriods();
    // }

    // INDIVIDUAL_CONTRIBUTOR

    // this.onLoadPreviousContributionData();
    this.route.queryParams.subscribe((params) => {
      this.isAddNewContributionToAnyExistingInvoice = params.addContribution;
      this.invoiceIdToAddContribution = params.id;
    });
    if (this.isAddNewContributionToAnyExistingInvoice) {
        this.disableContributionType = true;
    }

    this.spinner.hide();
    this.userDetails = this.authService.getUserDetails();
    // this.months = this.contributionService.getMonthsDataset();
    for (let index = 0; index < this.contributionService.getMonthsDataset().length; index++) {
      // if (index <= 5) {
        this.months.push(this.contributionService.getMonthsDataset()[index]);
      // }
    }
    this.years = this.contributionService.getYears();

    this.invoiceForm = new FormGroup({
      contributionYear: new FormControl(this.currentYear, Validators.compose([Validators.required, Validators.maxLength(4), Validators.minLength(4)])),
      contributionMonth: new FormControl(null , Validators.compose([Validators.required])),
      contributionType: new FormControl(1, Validators.compose([Validators.required])),
      description: new FormControl(null, Validators.compose([])),
      installmentType: new FormControl(this.installmentType[0].value, Validators.compose([Validators.required])),
    });

    this.customerForm = new FormGroup({
      customerNumber: new FormControl(null , Validators.compose([Validators.required])),
      customerType: new FormControl(1 , Validators.compose([Validators.required])),
    });
  }

  updateCustomerNumber() {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }

    if(this.isIndividualSelected == true)
    {
      
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        }
      ];

      this.employeeUploadListDataSource.splice(0)
      sessionStorage.removeItem("employeeUploadListDataSource")
      this.isEmployerGov = false
      this.compensationZeroGov = false
      this.contributionTypeValue =null
  
      this.invoiceForm.get("contributionMonth").reset()
      //this.invoiceForm.get("contributionType").reset()


    }
    else{
      this.employeeUploadListDataSource.splice(0)
      sessionStorage.removeItem("employeeUploadListDataSource")
      this.isEmployerGov = false
      this.compensationZeroGov = false
      this.contributionTypeValue =null
      
  
      this.invoiceForm.get("contributionMonth").reset() 
      this.invoiceForm.get("contributionType").reset()

    }
   
   

    
    const data = {
        requestType: 'FUMIS_MEMBER_DETAILS',
        memberType: '',
        memberRef: this.customerForm.get('customerNumber').value
    };

    
    
    if (this.customerForm.get('customerType').value == 1) {
      this.userGroup = 'EMPLOYER';
      this.hideDataUploadControls = false;
      data.memberType = 'EMPLOYER';
    } else {
      this.userGroup = 'INDIVIDUAL_CONTRIBUTOR';
      data.memberType = 'MEMBER';
        this.title = 'Individual Contribution';
        this.contributionType = [
          {
            id: 1,
            text: 'Contributions'
          }
        ];
        this.hideDataUploadControls = true;
        this.employeeUploadListDataSource = [{
          id: 1,
          memberNames: '',
          memberSalary: 0,
          employerNumber: this.currrentEmployerNumber,
          memberNumber: this.currrentEmployerNumber,
          memberContribution: 0,
          employerContribution: 0,
          amountContributed: 0,
          compensation:0,
          totalContributionsAmt: 0,
          amountContributedG: 0
        }];
    }
 
    this.spinner.show();
    this.utilities.postServiceCall(data, 'backend/request').subscribe(res => {
      //console.log(res);
      //membeshipName
      
      if (res.code = 2000) {

        if(res.data.SectorID == 1)
        {
          this.isEmployerGov = true
        }

       this.currrentEmployerNumber = res.data.membershipNo;
       if (this.userGroup == 'INDIVIDUAL_CONTRIBUTOR') {
        this.employeeUploadListDataSource[0].memberNames = res.data.membeshipName
       }

      this.currentCustomerName = res.data.membeshipName;
      this.customerNumberSaved = true;
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    });
  }

  onCustomerTypeValueChange(e) {
    
    if (e.value == 1) {
      this.isIndividualSelected = false;
      this.userGroup = 'EMPLOYER';
      this.hideDataUploadControls = false;
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        },
        {
          id: 2,
          text: 'Arrears'
        },
        {
          id: 3,
          text: 'Adjustments'
        },
        {
          id: 4,
          text: 'Compensation'
        }
      ];


    this.employeeUploadListDataSource = [];
    } else {
        this.isIndividualSelected = true
        this.userGroup = 'INDIVIDUAL_CONTRIBUTOR';
        this.title = 'Individual Contribution';
        this.hideDataUploadControls = true;

        this.contributionType = [
          {
            id: 1,
            text: 'Contributions'
          }
        ];

        this.employeeUploadListDataSource = [{
          id: 1,
          memberNames: '',
          memberSalary: 0,
          employerNumber: this.currrentEmployerNumber,
          memberNumber: this.currrentEmployerNumber,
          memberContribution: 0,
          employerContribution: 0,
          amountContributed: 0,
          compensation:0,
          totalContributionsAmt: 0
        }];
    }
  }

  loadSettings() {
    this.utilities.postServiceCall(this.sivs, 'backend/request').subscribe(res => {
      const serveRes = res;
      if (serveRes.code == 2000) {
        for(const iterator of serveRes.data) {
          if (iterator.name == 'thresholdAmount') {
            this.thresholdAmount = +iterator.value;
          }
          if (iterator.name == 'CONTRIBUTION_AMOUNT_GAP_IN_PERCENT') {
            this.contributionAmountDiffInPercent = +iterator.value;
          }
          if (iterator.name == 'EMPLOYER_CONTRIBUTION_PERCENT') {
            this.employerPercent = +iterator.value;
            this.compensationPercent = 1
          }
          if (iterator.name == 'MEMBER_CONTRIBUTION_PERCENT') {
            this.memberPercent = +iterator.value;
          }
          if (iterator.name == 'CONTRIBUTION_AMOUNT_GAP_ALLOWED') {
            this.allowAmountContributionGap = +iterator.value;
          }
        }
      } else {
        // reset to normal
        this.thresholdAmount = 10000;
        this.employerPercent = 13;
        this.memberPercent = 7;
        this.compensationPercent = 1
        this.contributionAmountDiffInPercent = 80;
        this.allowAmountContributionGap = 1;

        // this.toastr.error(serveRes.message);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.thresholdAmount = 10000;
      this.employerPercent = 13;
      this.memberPercent = 7;
      this.compensationPercent=1
      this.contributionAmountDiffInPercent = 80;
      this.allowAmountContributionGap = 1;
    });
  }
  hideDialog() {
    this.showAlertDialog = false;
  }


  postInvoice() {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }
    if (this.employeeUploadListDataSource.length < 1) {
      notify('No members\' contributions data has been provided', 'error', 6000);
      return;
    }
    if(this.employeeUploadListDataSource[0].memberSalary == 0 || this.employeeUploadListDataSource[0].memberSalary == null || this.employeeUploadListDataSource[0].memberSalary == undefined) {
      notify('Member salary can not be less or equal to zero', 'error', 6000);
      return;
    }

    if (this.invoiceForm.invalid) {
      notify('Contribution month, year or description can not be empty!', 'error', 6000);
      return;
    }

    if (this.employeeUploadListDataSource.length <= 0) {
      notify('Members Contribution data required!', 'error', 6000);
      return;
    }

    if (this.invoiceForm.invalid) {
   notify('Contribution month, year or description can not be empty!', 'error', 6000);
   return;
 }

    const contributionData = [];
    const selectedContributionMonths = this.invoiceForm.get('contributionMonth').value;
    this.spinner.show();
    let amount = 0;
    const membersData = [];

              for (let i = 0; i < this.employeeUploadListDataSource.length; i++) {
                if(this.contributionTypeValue == 4)
                {
                  amount += +this.employeeUploadListDataSource[i].compensation.toFixed(2);
                }
                else{
                  amount += +this.employeeUploadListDataSource[i].amountContributed.toFixed(2) +  +this.employeeUploadListDataSource[i].compensation.toFixed(2);
                }
                

                if(this.employeeUploadListDataSource[i].memberNumber === undefined || `${this.employeeUploadListDataSource[i].memberNumber}`.trim() == '') {
                    membersData.push({
                    a: this.employeeUploadListDataSource[i].memberNames,
                    c: this.employeeUploadListDataSource[i].memberSalary.toFixed(2),
                    d: '',
                    g: +this.employeeUploadListDataSource[i].amountContributed.toFixed(2),
                    m: +this.employeeUploadListDataSource[i].compensation.toFixed(2)
                });

                } else {
                    membersData.push({
                      a: this.employeeUploadListDataSource[i].memberNames,
                      c: this.employeeUploadListDataSource[i].memberSalary.toFixed(2),
                      d: this.employeeUploadListDataSource[i].memberNumber,
                      g: +this.employeeUploadListDataSource[i].amountContributed.toFixed(2),
                      m: +this.employeeUploadListDataSource[i].compensation.toFixed(2)
                });
                }
              }
          for (let index = 0; index < selectedContributionMonths.length; index++) {
                contributionData.push({
                contributionYear: this.invoiceForm.get('contributionYear').value,
                contributionMonth: selectedContributionMonths[index],
                entryType: this.invoiceForm.get('contributionType').value,
                totalAmount: `${amount}`,
                narration: `Members contribution for ${this.contributionService.getMonthsDataset()[(selectedContributionMonths[index] - 1)].text} ${this.invoiceForm.get('contributionYear').value}`,
                individualContributions: membersData
              });
            }

      console.log(membersData)
      const yearExcluded = [];
      const monthExcluded = [];

      let proceed = true;

    let contributionTotalAmount = 0;
      // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < contributionData.length; i++) {
      contributionTotalAmount += amount;
      }

    // if (this.customerForm.get('customerType').value == 1 && contributionTotalAmount < this.lastContributionTotalAmount) {
    //   const amountDifference = this.lastContributionTotalAmount - contributionTotalAmount;
    //   if (this.calculateAmountDifferencePercent(amountDifference) >= this.contributionAmountDiffInPercent) {
    //     if (this.allowAmountContributionGap == 1) {
    //     // tslint:disable-next-line: max-line-length
    //     this.alertReason = `The current total amount (${contributionTotalAmount} TZS) for members contribution differs by ${amountDifference} TZS (${this.calculateAmountDifferencePercent(amountDifference)}%) compared to the last total amount (${this.lastContributionTotalAmount} TZS) of contributed members.`;
    //     // notify(this.alertReason,'error', 6000);
    //     this.toastr.error(this.alertReason, 'Alert', {
    //       timeOut: 90000
    //     });
    //     } else {
    //       this.showAlertDialog = true;
    //       this.alertReason = `The current total amount (${contributionTotalAmount} TZS) for members contribution differs by ${amountDifference} TZS (${this.calculateAmountDifferencePercent(amountDifference)}%) compared to the last total amount (${this.lastContributionTotalAmount} TZS) of contributed members.`;
    //       this.spinner.hide();
    //       return;
    //     }
    //   }
    // }


    let contributionBatchData = {
      requestType: "INVOICE_CREATE_MINI",
      memberNumber: '',
      employerNumber: '',
      invoiceTotalAmount: `${contributionTotalAmount}`,
      invoiceDescription: this.invoiceForm.get('description').value,
      contributions: contributionData
      };
    if (this.customerForm.get('customerType').value == 1) {
        contributionBatchData.employerNumber = this.currrentEmployerNumber;
      }
    if (this.customerForm.get('customerType').value == 2) {
        contributionBatchData.memberNumber = this.currrentEmployerNumber;
      }
    const memberNames = [];
    let memberNumberWithNames = [];
    let memberNamesWithoutNumbers = [];
    let memberNumbers = [];

    if(this.customerForm.get('customerType').value == 1) {
      for (const el of this.employeeUploadListDataSource) {
        if (el.memberSalary < this.thresholdAmount) {
          // tslint:disable-next-line: max-line-length
          this.alertReason = `Member salary (${el.memberSalary}) for member number ${el.memberNumber} (${el.memberNames}) is below the Threshold amount (${this.thresholdAmount} TZS).`;
          this.toastr.error(this.alertReason, 'Salary Threshold Amount',);
          this.showAlertDialog = true;
          this.spinner.hide();
          return;
        }
      }
    }
   
    for (const el of this.employeeUploadListDataSource) {
       memberNames.push(`${el.memberNames}`.toUpperCase());
       if (el.memberNumber !== null && el.memberNumber !== undefined &&  `${el.memberNumber}`.trim() !== '') {
        memberNumbers.push(el.memberNumber);
        memberNumberWithNames.push(`${el.memberNumber}`+`${el.memberNames}`.trim().toUpperCase());
       } else {
        memberNamesWithoutNumbers.push(`${el.memberNames}`.trim().toUpperCase());
       }
     }
    let duplicateMemberNames: any;
    let duplicateMemberNambers: any;

    for(let i = 0; i< memberNames.length;i++) {
      if (`${memberNames[i]}`.trim() === '') {
        this.alertReason = `Empty member name is not allowed`;
        this.showAlertDialog = true;
        this.spinner.hide();
        return;
      }
    }

    for (const iterator of memberNumberWithNames) {
       duplicateMemberNames = this.findDuplicates(memberNumberWithNames);
       if (duplicateMemberNames.length > 0 ) {
        //  this.alertReason = `The duplicate member names \n ${this.findDuplicates(memberNames)} detected`;
         this.alertReason = `The duplicate member names (${duplicateMemberNames}) detected in the list.`;
         this.showAlertDialog = true;
         this.spinner.hide();
         return;
       }
    }
    for (const iterator of memberNamesWithoutNumbers) {
      duplicateMemberNames = this.findDuplicates(memberNamesWithoutNumbers);
      if (duplicateMemberNames.length > 0 ) {
        //  this.alertReason = `The duplicate member names \n ${this.findDuplicates(memberNames)} detected`;
        this.alertReason = `The duplicate member names (${duplicateMemberNames})  detected in the list.`;
        this.showAlertDialog = true;
        this.spinner.hide();
        return;
      }
   }

    memberNumbers = memberNumbers.filter(function(str) {
    return /\S/.test(str);
   });

  //  console.log(memberNumbers);
  //  memberNumbers = this.removeArrayItems(memberNumbers, undefined);

    // for (const iterator of memberNumbers) {
      //  if (!`${iterator}`.trim().match('') || iterator !== undefined || iterator !== null) {
        duplicateMemberNambers = this.findDuplicates(memberNumbers);
        if (duplicateMemberNambers.length > 0 ) {
          this.alertReason = `Duplicate member numbers \n ${this.findDuplicates(memberNumbers)} detected`;
          this.showAlertDialog = true;
          this.spinner.hide();
          return;
        // }
      //  }
    }
    if (this.isAddNewContributionToAnyExistingInvoice) {

      const addedContributionData = {
        requestType: "CONTRIBUTION_ADD",
        invoiceID: this.invoiceIdToAddContribution,
        memberNumber: '',
        employerNumber: '',
        contributions: contributionData
      };

      if (this.authService.getUserDetails().userGroup == 'EMPLOYER') {
        addedContributionData.employerNumber = this.currrentEmployerNumber;
      }
    if (this.authService.getUserDetails().userGroup == 'INDIVIDUAL_CONTRIBUTOR') {
      addedContributionData.memberNumber = this.currrentEmployerNumber;
      }

      this.utilities.postServiceCall(addedContributionData, 'backend/request').subscribe(res => {
        const serverResponse = res;
        this.spinner.hide();
        if (serverResponse.code == 2000) {
          
          console.log(serverResponse.data)
          sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
          sessionStorage.setItem(AppSettings.invoiceDetailsKey,  this.securityService.encryptString(serverResponse.data));
          this.router.navigate(['/invoice/contributions']);
        } else {
          this.showAlertDialog = true;
          this.alertReason = serverResponse.message;
          // this.toastr.error(serverResponse.message, 'Failed to create invoice');
        }
      }, error => {
             this.spinner.hide();
             this.toastr.error('Something went wrong, please try again');
      });

      return; // this is very important
    }
    
    this.utilities.postServiceCall(contributionBatchData, this.invoiceCreateEndPoint).subscribe(res => {
        const serverResponse = res;
        this.spinner.hide();
        if (serverResponse.code == 2000) {
         
          sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
          sessionStorage.removeItem(AppSettings.customerNumberKey);
          sessionStorage.removeItem(AppSettings.customerUserGroup);
          sessionStorage.removeItem(AppSettings.customerName);
          sessionStorage.removeItem(AppSettings.installmentTypeKey);

          sessionStorage.setItem(AppSettings.installmentTypeKey, this.securityService.encryptString(this.invoiceForm.get('installmentType').value));
          sessionStorage.setItem(AppSettings.invoiceDetailsKey,  this.securityService.encryptString(serverResponse.data));
          sessionStorage.setItem(AppSettings.customerNumberKey, this.securityService.encryptString(this.currrentEmployerNumber));
          sessionStorage.setItem(AppSettings.customerUserGroup, this.userGroup);
          sessionStorage.setItem(AppSettings.customerName, this.securityService.encryptString(this.currentCustomerName));
          this.router.navigate(['/invoice/contributions']);
        } else {
          this.showAlertDialog = true;
          this.alertReason = serverResponse.message;
          // this.toastr.error(serverResponse.message, 'Request Failed');
        }
      }, error => {
             this.spinner.hide();
             this.toastr.error('Something went wrong, please try again');
      });
  }

  calculateAmountDifferencePercent(amountDifference): number {
    const percent: number = (amountDifference / this.lastContributionTotalAmount) * 100;
    return +percent.toFixed(2);
  }

  removeArrayItems(arr, value) {
    let i = 0;
    while(i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

    findDuplicates(arr) {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }

  warningDecision(bit) {
    if (bit) {
      // do not continue, make adjustments first
      this.continueWithWarning = false;
      this.showWarningDialog = false;
    } else {
      // continue with warning
      this.continueWithWarning =  true;
      this.showWarningDialog = false;
    }
  }

  openPopUp() {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }

    if (this.invoiceForm.get("contributionMonth").invalid) {
      this.toastr.error("Please select contribution month to continue")
      return;
    }

    
    if (this.invoiceForm.get("contributionType").invalid) {
      this.toastr.error("Please select contribution type to continue")
      return;
    }

    this.openFileUploadDialog = true;
    this.value = [];
  }
  closePopUp() {
    this.openFileUploadDialog = false;
  }

  onFileValueChanged(event) {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }
    this.employeeUploadListDataSource = [];
    let data = {};
    let totalContributionsAmt = 0;
    this.uploadFailedMessage = 'Loading....';
    
   
    /*
      check file type
      if it is xlsx or xls call parseXLXS() function
    */
   if (`${event.file.name}`.endsWith('.xlsx') || `${event.file.name}`.endsWith('.xls')) {
    //  this.toastr.info('Excel file with an extension .xlxs or .xls are not supported at a moment, please use csv file instead.  (Temporary)');
    this.parseXLXS(event);
    return;
   }

   this.spinner.show();
    const reader = new FileReader();
    reader.onload = () => {
      this.spinner.show();
      this.uploadFailedMessage =
        'Converting excel data format to json format....';
      const text = reader.result;
      this.hideInfoAlert = false;
      notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
      const json = csv2json(text, { parseNumbers: true });

      // let dataRaw = JSON.stringify(json);

      // dataRaw = +dataRaw.replace(/,/g, '');
      data = {
        data: json
      };

      let memberSalaryConverted: any;
      let counter = 0;
      // tslint:disable-next-line: prefer-for-of

      for (let i = 0; i < json.length; i++) {

          if (!json[0].hasOwnProperty('memberNumber')) {
              this.showAlertDialog = true;
              this.alertReason = `Please include memberNumber header in your excelsheet on member numbers column.`;
              this.spinner.hide();
              return;
          }

          if (!json[0].hasOwnProperty('memberName')) {
              this.showAlertDialog = true;
              this.alertReason = `Please include memberName header in your excelsheet on member names column.`;
              this.spinner.hide();
              return;
          }

          if (!json[0].hasOwnProperty('memberSalary')) {
              this.showAlertDialog = true;
              this.alertReason = `Please include memberSalary header in your excelsheet on members salaries column.`;
              // this.toastr.error('Please include memberName header in your excelsheet for members names column..');
              this.spinner.hide();
              return;
          }

        // if (json[i].memberSalary == null || json[i].memberSalary == '' || json[i].memberSalary === undefined) {
        //   this.toastr.error('Member Salary is required, please update your member\'s salary in the excel sheet.');
        //   this.spinner.hide();
        //   return;
        // }

        // if (!json[i].memberSalary) {
        //   this.toastr.error('Members Salaries are required, please include memberSalary field in your excelsheet.');
        //   this.spinner.hide();
        //   return;
        // }

        // if (!json[i].memberName) {
        //   this.toastr.error('Member Name is required, please include it in your excelsheet.');
        //   this.spinner.hide();
        //   return;
        // }
        // if (json[i].memberName == null || json[i].memberSalary == '') {
        //   this.toastr.error('Member Name is required, please include it in your excelsheet.');
        //   this.spinner.hide();
        //   return;
        // }

        if (json[i].memberSalary == null || json[i].memberSalary == '' || json[i].memberSalary === undefined) {
            this.showAlertDialog = true;
            this.alertReason = `Member Salary is Missing, please update your member\'s salary in the excel sheet.`;
            // this.toastr.error('Member Salary is required, please update your member\'s salary in the excel sheet 2.');
            this.spinner.hide();
            return;
        }

        if (json[i].memberName == null || json[i].memberName == '' || json[i].memberName == undefined) {
            this.showAlertDialog = true;
            this.alertReason = `MemberName column in your excelsheet is empty, please include it in your excelsheet.`;
            // this.toastr.error('Member Name is required, please include it in your excelsheet.');
            this.spinner.hide();
            return;
        }

        if (isNaN(json[i].memberSalary) && json[i].memberSalary !== undefined) {
          memberSalaryConverted = json[i].memberSalary.toString();
          memberSalaryConverted = +memberSalaryConverted.replace(/,/g, '');
        } else {
          memberSalaryConverted = json[i].memberSalary;
        }
        if (memberSalaryConverted < 0) {
          this.toastr.error(`Negative amount is not allowed for members salaries.`);
          this.spinner.hide();
          return;
        }
        if (memberSalaryConverted <  this.thresholdAmount) {
          this.showAlertDialog = true;
          // tslint:disable-next-line: max-line-length
          this.alertReason = `One of your member has salary below the threshold amount (${this.thresholdAmount}), current entries has been filtered out to allow only members with salary above threshold amount (${this.thresholdAmount}). please update the your member salary in the excel sheet.`;
          this.spinner.hide();
          return;
        }

        let memberNumber = `${json[i].memberNumber}`;
            const memberNames = json[i].memberName;

            if (memberNumber.trim() === '' || memberNumber === null || memberNumber === undefined) {
              memberNumber = ""
            }
         //console.log("WE ARE INSIDE THE FUNCTION HOLLA");
        if (memberSalaryConverted >=  this.thresholdAmount) {
          
          if(this.contributionYear < 2023 ){
          
             this.employeeUploadListDataSource.push({
              id: ++counter,
              isMemberNumberValid: true,
              isMemberNamesValid: true,
              correctName: '',
              employerNumber: this.currrentEmployerNumber,
              memberNames: json[i].memberName,
              memberSalary: memberSalaryConverted,
              memberNumber: memberNumber == 'undefined' ? '':memberNumber,
              memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
              employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
              compensation: 0,
              amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
              amountContributed:
                (((this.memberPercent / 100) * memberSalaryConverted) +
                ((this.employerPercent / 100) * memberSalaryConverted) 
                ),
              
            });
            totalContributionsAmt +=
              (((this.memberPercent / 100) * +memberSalaryConverted) +
              ((this.employerPercent / 100) * memberSalaryConverted) 
              );
          }

          else if(this.contributionYear < 2023 && this.isEmployerGov == true) {
            this.employeeUploadListDataSource.push({
              id: ++counter,
              isMemberNumberValid: true,
              isMemberNamesValid: true,
              correctName: '',
              employerNumber: this.currrentEmployerNumber,
              memberNames: json[i].memberName,
              memberSalary: memberSalaryConverted,
              memberNumber: memberNumber == 'undefined' ? '':memberNumber,
              memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
              employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
              compensation: 0, 
              amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted), 
              amountContributed:
                (((this.memberPercent / 100) * memberSalaryConverted) +
                ((this.employerPercent / 100) * memberSalaryConverted) 
                ),
              
            });
            totalContributionsAmt +=
              (((this.memberPercent / 100) * +memberSalaryConverted) +
              ((this.employerPercent / 100) * memberSalaryConverted) 
              );
          }

          

          else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true && this.contributionTypeValue == 4 ){
            this.employeeUploadListDataSource.push({
              id: ++counter,
              isMemberNumberValid: true,
              isMemberNamesValid: true,
              correctName: '',
              employerNumber: this.currrentEmployerNumber,
              memberNames: json[i].memberName,
              memberSalary: memberSalaryConverted,
              memberNumber: memberNumber == 'undefined' ? '':memberNumber,
              memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
              employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
              compensation: 0,
              amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
              amountContributed:
                (((this.memberPercent / 100) * memberSalaryConverted) +
                ((this.employerPercent / 100) * memberSalaryConverted) 
                ),
              
            });
            totalContributionsAmt +=
              (((this.memberPercent / 100) * +memberSalaryConverted) +
              ((this.employerPercent / 100) * memberSalaryConverted) 
              );

              //this.compensationZeroGov = false;
          }

          else if(this.contributionYear == 2023 && this.contributionTypeValue == 4 )
          {  
           
            this.employeeUploadListDataSource.push({
              id: ++counter,
              isMemberNumberValid: true,
              isMemberNamesValid: true,
              correctName: '',
              employerNumber: this.currrentEmployerNumber,
              memberNames: json[i].memberName,
              memberSalary: memberSalaryConverted,
              memberNumber: memberNumber == 'undefined' ? '':memberNumber,
              memberContribution: 0,
              employerContribution: 0,
              compensation: ((this.compensationPercent / 100) * memberSalaryConverted), 
              //amountContributed:(((this.compensationPercent / 100) * memberSalaryConverted)),
              amountContributed: 0,
              amountContributedG: ((this.compensationPercent / 100) * memberSalaryConverted),
              
            });
            totalContributionsAmt +=(((this.compensationPercent / 100) * memberSalaryConverted))
            }

            else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true )
            {
             
              this.employeeUploadListDataSource.push({
                id: ++counter,
                isMemberNumberValid: true,
                isMemberNamesValid: true,
                correctName: '',
                employerNumber: this.currrentEmployerNumber,
                memberNames: json[i].memberName,
                memberSalary: memberSalaryConverted,
                memberNumber: memberNumber == 'undefined' ? '':memberNumber,
                memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
                employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
                compensation: 0, 
                amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted), 
                amountContributed:
                  (((this.memberPercent / 100) * memberSalaryConverted) +
                  ((this.employerPercent / 100) * memberSalaryConverted) 
                  ),
                
              });
              totalContributionsAmt +=
                (((this.memberPercent / 100) * +memberSalaryConverted) +
                ((this.employerPercent / 100) * memberSalaryConverted) 
                );

                //this.compensationZeroGov = false;
            }

        
           
           else{
           
            this.employeeUploadListDataSource.push({
              id: ++counter,
              isMemberNumberValid: true,
              isMemberNamesValid: true,
              correctName: '',
              employerNumber: this.currrentEmployerNumber,
              memberNames: json[i].memberName,
              memberSalary: memberSalaryConverted,
              memberNumber: memberNumber == 'undefined' ? '':memberNumber,
              memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
              employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
              compensation: ((this.compensationPercent / 100) * memberSalaryConverted), 
              amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted) + ((this.compensationPercent / 100) * memberSalaryConverted), 
              amountContributed:
                (((this.memberPercent / 100) * memberSalaryConverted) +
                ((this.employerPercent / 100) * memberSalaryConverted) 
                // ((this.compensationPercent / 100) * memberSalaryConverted)
                ),
              
            });
            totalContributionsAmt +=
              (((this.memberPercent / 100) * +memberSalaryConverted) +
              ((this.employerPercent / 100) * memberSalaryConverted) +
              ((this.compensationPercent / 100) * memberSalaryConverted)
              );
          }


   
          
         


            if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
              this.isMemberNamesMatch = false;
            }

            const data =  {
              requestType: "MEMBERS_VERIFY",
              members: [
                  {
                      memberNumber,
                      memberNames
                  }
              ]
          };

        this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
          this.spinner.show();
          this.hideInfoAlert = false;
          const serverRes = res;
       
          if (serverRes.code == 2000) {
             for (const el of serverRes.data) {
               if (el.status == 2015) {  // invalid member number
                this.isMemberNumberValid = false;
                this.isMemberNamesMatch = false;
                this.employeeUploadListDataSource[i].isMemberNumberValid = false;
                this.employeeUploadListDataSource[i].isMemberNamesValid = false;
               }

               if (el.status == 2016) {  // Difference in names
                this.isMemberNamesMatch = false;
                this.isMemberNumberValid = true;
                this.employeeUploadListDataSource[i].isMemberNumberValid = true;
                this.employeeUploadListDataSource[i].isMemberNamesValid = false;
                this.employeeUploadListDataSource[i].correctName = `${el.registeredName}`;
               }

               if (el.status == 2000) {  // Validation Successful / Empty Member Number
                this.isMemberNumberValid = true;
                this.isMemberNamesMatch = true;
                this.employeeUploadListDataSource[i].isMemberNumberValid = true;
                this.employeeUploadListDataSource[i].isMemberNamesValid = true;
                this.employeeUploadListDataSource[i].correctName = `${el.registeredName}`;
               }
             }

             sessionStorage.removeItem("employeeUploadListDataSource")
             //console.log(this.employeeUploadListDataSource)
             sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSource))
          }
          this.spinner.hide();

        }, err => {
         this.toastr.info("Something went wrong while validating the correctness of the information given, please make sure you have internet connection, or procced without validations.");
         this.isMemberNumberValid = true;
         this.isMemberNamesMatch = true;

         this.spinner.hide();
        });
        }
        this.employeeUploadListDataSource = json;
        this.uploadFailedMessage = 'Conversion completed....';
        }
      this.spinner.hide();
    };
    reader.onloadend = () => {
      this.spinner.hide();
      this.uploadFailedMessage = 'Data uploaded successfully....';
      this.openFileUploadDialog = false;
    };
    reader.readAsText(event.file);
    this.hideEmployeeUploadForm = true;
    this.hideEmployeeListDataGrid = false;
  }



  backToUploadForm() {
    this.hideEmployeeListDataGrid = true;
    this.hideEmployeeUploadForm = false;
    this.employeeUploadListDataSource = [];
  }

  onLoadPreviousContributionData() {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }
    const data = {
      requestType : 'LAST_CONTRIBUTION',
      linkId: this.currrentEmployerNumber
    };
    this.lastContributionTotalAmount = 0;
    this.spinner.show();
    this.utilities
      .postServiceCall(data, 'portal/request')
      .subscribe(
        res => {
          const serverRes = res;
          this.spinner.hide();
          if (serverRes.code === 2000) {
            const arr = serverRes.data;
            let counter = 0;
            if (arr === null || arr === undefined) {
            return;
           }
            for (const el of serverRes.data) {
              this.lastContributionTotalAmount += el.amountContributed;
              this.employeeUploadListDataSource.push({
                id: ++counter,
                memberNames: `${el.firstName} ${el.middleName} ${el.surName}`,
                employerNumber: this.currrentEmployerNumber,
                memberSalary: el.salaryBeforeTax,
                memberNumber: el.memberNumber,
                memberContribution: ((this.memberPercent / 100) * el.salaryBeforeTax),
                employerContribution: ((this.employerPercent / 100) * el.salaryBeforeTax),
                compensation: ((this.compensationPercent / 100) * el.salaryBeforeTax),
                amountContributed: ((this.memberPercent / 100) * el.salaryBeforeTax) + ((this.employerPercent / 100) * el.salaryBeforeTax) + ((this.compensationPercent / 100) * el.salaryBeforeTax),
              });
            }
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

   funCompare( a, b ) {
    if ( a.memberNames < b.memberNames ){
      return -1;
    }
    if ( a.memberNames > b.memberNames ){
      return 1;
    }
    return 0;
  }

  customizeText(data) {
    return "Total Members: " + data.value;
}

  loadSelectedContributionMonth(e) {
   // ContributionYear
  
    this.spinner.show();
    const data = {
      requestType: 'EMPLOYER_CONTRIBUTIONS',
      employerNo: this.currrentEmployerNumber,
      contributingPeriod: e.ContributingPeriod
    };
    this.lastContributionTotalAmount = 0;
    this.utilities
      .postServiceCall(data, 'portal/request')
      .subscribe(
        res => {
          this.employeeUploadListDataSource = [];
          const serverRes = res;
          this.hideEmployeeListDataGrid = false;
          if (serverRes.code === 2000) {
            this.toastr.success(serverRes.message);
            // memberId: el.memberId,
            let counter = 0;
            let index = 0;
            

            if(this.contributionYear < 2023 ) 
            {
              for (const el of serverRes.data) {
                this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
                this.employeeUploadListDataSource.push({
                  id: ++counter,
                  correctName: '',
                  isMemberNumberValid: true,
                  isMemberNamesValid: true,
                  memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                  employerNumber: this.currrentEmployerNumber,
                  memberSalary: el.BaseAmount,
                  memberNumber: el.MemberNumber,
                  memberContribution: ((this.memberPercent / 100) * el.BaseAmount),
                  employerContribution: ((this.employerPercent / 100) * el.BaseAmount),
                  compensation: 0,
                  amountContributed: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount),
                  amountContributedG: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount)
                });
              }
            }

            else if(this.contributionYear < 2023 && this.isEmployerGov == true) {
            {
              for (const el of serverRes.data) {
                this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
                this.employeeUploadListDataSource.push({
                  id: ++counter,
                  correctName: '',
                  isMemberNumberValid: true,
                  isMemberNamesValid: true,
                  memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                  employerNumber: this.currrentEmployerNumber,
                  memberSalary: el.BaseAmount,
                  memberNumber: el.MemberNumber,
                  memberContribution: ((this.memberPercent / 100) * el.BaseAmount),
                  employerContribution: ((this.employerPercent / 100) * el.BaseAmount),
                  compensation: 0,
                  amountContributed: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount),
                  amountContributedG: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount)
                });
              }

              //this.isEmployerGov = false;
            }
          }

          else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true && this.contributionTypeValue == 4 )
          {
            for (const el of serverRes.data) {
              this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
              this.employeeUploadListDataSource.push({
                id: ++counter,
                correctName: '',
                isMemberNumberValid: true,
                isMemberNamesValid: true,
                memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                employerNumber: this.currrentEmployerNumber,
                memberSalary: el.BaseAmount,
                memberNumber: el.MemberNumber,
                memberContribution: ((this.memberPercent / 100) * el.BaseAmount),
                employerContribution: ((this.employerPercent / 100) * el.BaseAmount),
                compensation: 0,
                amountContributed: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount),
                amountContributedG: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount)
              });
            }
            //this.isEmployerGov = false;
            //this.compensationZeroGov = false;
          }

            else if(this.contributionYear == 2023 && this.contributionTypeValue == 4 )
            {
              for (const el of serverRes.data) {
                this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
                this.employeeUploadListDataSource.push({
                  id: ++counter,
                  correctName: '',
                  isMemberNumberValid: true,
                  isMemberNamesValid: true,
                  memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                  employerNumber: this.currrentEmployerNumber,
                  memberSalary: el.BaseAmount,
                  memberNumber: el.MemberNumber,
                  memberContribution: 0,
                  employerContribution: 0,
                  compensation: ((this.compensationPercent / 100) * el.BaseAmount),
                  //amountContributed:((this.compensationPercent / 100) * el.BaseAmount),
                  amountContributed:0,
                  amountContributedG: ((this.compensationPercent / 100) * el.BaseAmount)
                });
              } 
            }
            
            else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true )
            {
              for (const el of serverRes.data) {
                this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
                this.employeeUploadListDataSource.push({
                  id: ++counter,
                  correctName: '',
                  isMemberNumberValid: true,
                  isMemberNamesValid: true,
                  memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                  employerNumber: this.currrentEmployerNumber,
                  memberSalary: el.BaseAmount,
                  memberNumber: el.MemberNumber,
                  memberContribution: ((this.memberPercent / 100) * el.BaseAmount),
                  employerContribution: ((this.employerPercent / 100) * el.BaseAmount),
                  compensation: 0,
                  amountContributed: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount),
                  amountContributedG: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount)
                });
              }
              //this.isEmployerGov = false;
             // this.compensationZeroGov = false;
            }

          

            else{
              for (const el of serverRes.data) {
                this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
                this.employeeUploadListDataSource.push({
                  id: ++counter,
                  correctName: '',
                  isMemberNumberValid: true,
                  isMemberNamesValid: true,
                  memberNames: `${el.FirstName} ${el.MiddleName} ${el.SurName}`,
                  employerNumber: this.currrentEmployerNumber,
                  memberSalary: el.BaseAmount,
                  memberNumber: el.MemberNumber,
                  memberContribution: ((this.memberPercent / 100) * el.BaseAmount),
                  employerContribution: ((this.employerPercent / 100) * el.BaseAmount),
                  compensation: ((this.compensationPercent / 100) * el.BaseAmount),
                  amountContributed: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount),
                  amountContributedG: ((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount) + ((this.compensationPercent / 100) * el.BaseAmount)
                });
              }

            }

            sessionStorage.removeItem("employeeUploadListDataSource")
            //console.log(this.employeeUploadListDataSource)
            sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSource))

            this.spinner.hide();
            // do sorting
            // this.employeeUploadListDataSource = this.employeeUploadListDataSource.sort(this.funCompare)
            this.showDialog = false;
          } else {
            this.toastr.error(serverRes.message);
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error('Something went wrong, Please try again.');
        }
      );
  }

  onLoadExistingEmployeesList() {
    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }

    // if(this.invoiceForm.get("contributionMonth").invalid)
    // {
    //   this.toastr.error("Please select contribution month to continue")
    // }

    if (this.invoiceForm.get("contributionMonth").invalid) {
      this.toastr.error("Please select contribution month to continue")
      return;
    }

    
    if (this.invoiceForm.get("contributionType").invalid) {
      this.toastr.error("Please select contribution type to continue")
      return;
    }

    // if (this.isContributionMonthSelected == false) {
    //   this.toastr.error('Please select contribution month to continue');
    //   return;
    // }

    this.spinner.show();
    let memberType = 'EMPLOYER';
    if (this.authService.getUserDetails().userGroup === 'EMPLOYER' ) {
      memberType = 'EMPLOYER';
    }

    if (this.authService.getUserDetails().userGroup === 'INDIVIDUAL_CONTRIBUTOR') {
      memberType = 'INDIVIDUAL_CONTRIBUTOR';
    }

    const tps = {
      requestType: 'LAST_CONTRIBUTIONS',
      linkId: this.currrentEmployerNumber,
      memberType: memberType
    }
    this.utilities.postServiceCall(tps, 'portal/request').subscribe(res => {
      const serverRes = res;
      this.spinner.hide();
      if (serverRes.code == 2000) {
      this.lastContributionsDataSet = [];
      let counter = 0;
      for (const iterator of serverRes.data) {
        this.lastContributionsDataSet.push({
          id: ++counter,
          ContributionYear: `${iterator.ContributingPeriod}`.substring(0, 4),
          ContributionMonth: this.contributionInWord(`${iterator.ContributingPeriod}`.substring(4)),
          ContributingPeriod: iterator.ContributingPeriod
          // Narration: iterator.Narration,
          // InvoiceID: iterator.InvoiceID,
          // InvoiceAmount: iterator.i[0].InvoiceAmount,
          // currency: 'TZS'
        });
      }
      this.showDialog = true;
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong, please try again later.');
    });
  }

  onUploadExcelDataFile() {
    this.employeeUploadListDataSource = [];
    this.steps = 2;
    this.title = 'Upload Excel Sheet File Method';
    this.hideEmployeeUploadForm = false;
    this.hideEmployeeFetchedDataListDataGrid = true;
    this.hideEmployeeListManualEntrance = true;
    this.hideDataUploadControls = true;
    this.isUploadFileMethodSelected = true;
  }
  
  onManualDataEntrance() {
    this.employeeUploadListDataSource = [];
    this.steps = 2;
    this.title = 'Press the plus(+) sign to add new row';
    this.hideEmployeeListManualEntrance = false;
    this.hideDataUploadControls = true;
    this.hideEmployeeFetchedDataListDataGrid = true;
    this.hideEmployeeUploadForm = true;
    this.hideEmployeeListDataGrid = false;
    this.isUploadFileMethodSelected = false;
  }



  onBackButtonPressed() {
    // this.hideInitialInvoiceDetails = false;
    if (this.steps === 1) {
      this.hideInitialInvoiceDetails = false;
      this.hideBackButton = true;
    } else if (this.steps === 2) {
      this.title = 'Choose The Way To Create Employees Contribution List';
      // if ( this.hideDataUploadControls && this.steps === 2) {
      //   this.title = 'Choose The Way To Create Employees Contribution List';
      //   this.hideDataUploadControls = false;
      //   this.hideEmployeeListDataGrid = true;
      //   this.hideEmployeeUploadForm = true;
      //   return;
      // }
      this.hideEmployeeListDataGrid = true;
      this.hideEmployeeUploadForm = true;
      this.hideDataUploadControls = false;
    }
  }
  selectedChanged(e) {
    // this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
  onParamsToolBarPreparing(e) {
    e.toolbarOptions.items.unshift();
  }
  //  DataGrid's row Calculations & Validations
  calculateMemberContribution(rowData) {
    if (isNaN(rowData.memberSalary) && rowData.memberSalary !== undefined) {
      let num: any = rowData.memberSalary.toString();
      num = +num.replace(/,/g, '');
      if (num === 0) {
        return 0;
      }
      return ((this.memberPercent / 100) * num);
    } else {
      return rowData.memberContribution;
    }
  }
  calculateEmployerContribution(rowData) {
    if (isNaN(rowData.memberSalary) && rowData.memberSalary !== undefined) {
      let num: any = rowData.memberSalary.toString();
      num = +num.replace(/,/g, '');
      if (num === 0) {
        return 0;
      }
      return ((this.employerPercent / 100) * num);
    } else {
      return rowData.employerContribution;
    }
  }
  memberSalaryFilter(rowData) {
    if (isNaN(rowData.memberSalary) && rowData.memberSalary !== undefined) {
      let num: any = rowData.memberSalary.toString();
      num = +num.replace(/,/g, '');
      if (num < this.thresholdAmount) {
        // this.toastr.error('Member salary is below minimum threshold');
        return 0;
      }
      return num;
    } else if (rowData.memberSalary === null || rowData.memberSalary === undefined || rowData.memberSalary === '') {
      // this.toastr.error('Please enter member salary');
      return 0;
    } else {
      return rowData.memberSalary;
    }
  }
  calculateAmountContributed(rowData) {
    if (isNaN(rowData.memberSalary) && rowData.memberSalary !== undefined) {
      let num: any = rowData.memberSalary.toString();
      num = +num.replace(/,/g, '');
      // return num1 + num2;
      if (num === 0) {
        return 0;
      }
      return (((this.memberPercent / 100) * num + (this.employerPercent / 100)) * num);
    } else {
      return rowData.amountContributed;
    }
  }

  validateMemberSalaryThreshold(e) {
    let num: any = e.value;
    num = +num.replace(/,/g, '');
    return num >= this.thresholdAmount;
  }

  onMemberNumberValidation(e) {
    if (e.memberNumber) {
      e.promise = this.validateMemberNumber(
        e.newData.memberNumber,
        this.validateMemberNumberEndPoint
      ).subscribe(
        (result) => {
          const serverRes = result;
          if (serverRes.code == 2000) {
            // e.errorText = serverRes.errorText;
            e.isValid = serverRes.isValid;
          } else {
            this.toastr.error(
              'Something went wrong while validating members number'
            );
          }
        },
        (error) =>
          this.toastr.error(
            'Something went wrong while validating members number'
          )
      );
    }
  }

  validateMemberNumber(memberNumber, endPoint) {
    const data = {
      memberNumber,
    };
    return this.utilities.postServiceCall(data, endPoint);
  }
  onRowInserting(e) {

    e.data.employerNumber = this.currrentEmployerNumber;
    // e.date.memberNumber = this.currrentEmployerNumber;
    e.data.contributionYear = this.contributionService.getContributionYear();
    e.data.contributionMonth = this.contributionService.getContributionMonth();
  }
  onRowInserted(e) {
   
    if (this.customerForm.invalid) {
      this.toastr.error('Please enter customer number,contribution month,contribution type to continue');
      this.employeeUploadListDataSource.splice(0)
      return;
    }


    if (this.invoiceForm.invalid) {
      this.toastr.error('Please enter customer number,contribution month,contribution type to continue')
      this.employeeUploadListDataSource.splice(0)
      return;
    }

    
    // if (this.invoiceForm.get("contributionType").invalid) {
    //   this.toastr.error("Please select contribution type to continue")
    //   this.employeeUploadListDataSource.splice(0)
    //   return;
    // }


    this.hideInfoAlert = false;
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    const baseSalary = +e.data.memberSalary;
    let memberNumber = e.data.memberNumber;
    const memberNames = e.data.memberNames;

    if(e.data.memberSalary == 0 || e.data.memberSalary === undefined) {
      this.toastr.error("Member's salary is below the threshold amount")
      return false;
    }

    if (`${memberNumber}`.trim() === '' || memberNumber === null || memberNumber === undefined) {
      memberNumber = ""
    }

    if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
      this.isMemberNamesMatch = false;
    }

    const data =  {
      requestType: "MEMBERS_VERIFY",
      members: [
          {
              memberNumber,
              memberNames
          }
      ]
     };
   
  this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
    this.spinner.show();
    this.hideInfoAlert = false;
    const serverRes = res;
    if (serverRes.code == 2000) {
       for (const el of serverRes.data) {
         if (el.status == 2015) {  // invalid member number
          this.isMemberNumberValid = false;
          this.isMemberNamesMatch = false;
          e.data.isMemberNumberValid = false;
          e.data.isMemberNamesValid = false;
         }

         if (el.status == 2016) {  // Difference in names
          this.isMemberNamesMatch = false;
          this.isMemberNumberValid = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = false;
          e.data.correctName = `${el.registeredName}`;
         }

         if (el.status == 2000) {  // Validation Successful / Empty Member Number
          this.isMemberNumberValid = true;
          this.isMemberNamesMatch = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = true;
          e.data.correctName = `${el.registeredName}`;
         }
       }
    }
    this.spinner.hide();

  }, err => {
   this.toastr.info("Something went wrong while validating the correctness of the information given, please make sure you have internet connection, or procced without validations.");
   this.isMemberNumberValid = true;
   this.isMemberNamesMatch = true;

   this.spinner.hide();
  });

  if(this.contributionYear < 2023)
  {
    
    const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    const compensation: number = 0;

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.compensation =compensation
    e.data.amountContributed = memberContribution + employerContribution;
    e.data.amountContributedG = memberContribution + employerContribution;

    let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })

    
  }

  else if(this.contributionTypeValue == 4 && this.contributionYear < 2023)
  {
    
    const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    const compensation: number = 0;

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.compensation =compensation
    e.data.amountContributed = memberContribution + employerContribution ;
    e.data.amountContributedG = memberContribution + employerContribution;

    let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })
   
  }

  //contribution-services
  else if(this.contributionTypeValue == 4 && this.contributionYear >= 2023 && this.isEmployerGov == true && this.compensationZeroGov == true)
  {
   
    
    const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    const compensation: number = 0;

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.compensation =compensation
    e.data.amountContributed = memberContribution + employerContribution;
    e.data.amountContributedG = memberContribution + employerContribution; 

    let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })
    
  }

  else if(this.contributionYear >= 2023 && this.isEmployerGov == true && this.compensationZeroGov == true)
  {
    
    const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    const compensation: number = 0;

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.compensation =compensation
    e.data.amountContributed = memberContribution + employerContribution ;
    e.data.amountContributedG = memberContribution + employerContribution; 

    let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })
    
  }
  
  else if(this.contributionTypeValue == 4 && this.contributionYear >= 2023)
  {
    
     const memberContribution: number = 0;
     const employerContribution: number = 0;
     const compensation: number = ((this.compensationPercent / 100) * baseSalary);

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.compensation =compensation
    e.data.amountContributed = 0;
    e.data.amountContributedG = compensation; 

    let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })
    
  }

  else
  {
     
     const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
     const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
     const compensation: number = ((this.compensationPercent / 100) * baseSalary);

     e.data.memberContribution = memberContribution;
     e.data.employerContribution = employerContribution;
     e.data.compensation =compensation
     e.data.amountContributed = memberContribution + employerContribution;
     e.data.amountContributedG = memberContribution + employerContribution + compensation; 

     let counter =0
         this.employeeUploadListDataSourceN.push({
          id: ++counter,
          
          isMemberNumberValid: e.data.isMemberNumberValid,
          isMemberNamesValid: e.data.isMemberNamesValid,
          memberNames: e.data.memberNames,
          employerNumber: e.data.employeeNumber,
          memberSalary: e.data.memberSalary,
          memberNumber: e.data.memberNumber,
          memberContribution: memberContribution,
          employerContribution: employerContribution,
          compensation: compensation,
          amountContributed: memberContribution + employerContribution,
          amountContributedG: memberContribution + employerContribution + compensation,
          correctName: e.data.correctName,
         })
     
   
     
    //  this.employeeUploadListDataSource.push({
    //   id:'',
    //   correctName: '',
    //   isMemberNumberValid: true,
    //   isMemberNamesValid: true,
    //   memberNames: '',
    //   employerNumber: this.currrentEmployerNumber,
    //   memberSalary: e.memberSalary,
    //   memberNumber: e.MemberNumber,
    //   memberContribution:e.memberContribution,
    //   employerContribution:e.employerContribution,
    //   compensation: 0,
    //   amountContributed: e.amountContributed,
    //   amountContributedG: e.amountContributed
    // });

  }

  sessionStorage.removeItem("employeeUploadListDataSource")
  // console.log(this.employeeUploadListDataSource)
  sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSourceN))
  //sessionStorage.removeItem("employeeUploadListDataSource")
  //console.log(this.employeeUploadListDataSource)
  //sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSource))
    // calculate member & employer contribution, as well as total amount contributed
    // const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    // const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    // const compensation: number = ((this.compensationPercent / 100) * baseSalary);

    // e.data.memberContribution = memberContribution;
    // e.data.employerContribution = employerContribution;
    // e.data.compensation =compensation
    // e.data.amountContributed = memberContribution + employerContribution + compensation;
  }



  onRowUpdated(e) {
    // e.component.refresh(true);
    //console.log(e)
    this.hideInfoAlert = false;
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    const baseSalary = e.data.memberSalary;
    // if (baseSalary < 180000) {
    //   return false;
    // }
     
    if(e.data.memberSalary == 0 || e.data.memberSalary === undefined) {
      this.toastr.error("Member's salary is below the threshold amount")
      return false;
    }

    let memberNumber = e.data.memberNumber;
    const memberNames = e.data.memberNames;

    if (`${memberNumber}`.trim() === '' || memberNumber === null || memberNumber === undefined) {
      memberNumber = ""
    }

    if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
      this.isMemberNamesMatch = false;
    }


    const data =  {
      requestType: "MEMBERS_VERIFY",
      members: [
          {
              memberNumber,
              memberNames
          }
      ]
  };


  
  this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
    this.spinner.show();
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    this.hideInfoAlert = false;
    const serverRes = res;
    if (serverRes.code == 2000) {
       for (const el of serverRes.data) {
         if (el.status == 2015) {  // invalid member number
          this.isMemberNumberValid = false;
          this.isMemberNamesMatch = false;
          e.data.isMemberNumberValid = false;
          e.data.isMemberNamesValid = false;
         }

         if (el.status == 2016) {  // Difference in names
          this.isMemberNamesMatch = false;
          this.isMemberNumberValid = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = false;
          e.data.correctName = `${el.registeredName}`;
         }

         if (el.status == 2000) {  // Validation Successful / Empty Member Number
          this.isMemberNumberValid = true;
          this.isMemberNamesMatch = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = true;
          e.data.correctName = `${el.registeredName}`;
         }
       }
    }
    this.spinner.hide();

  }, err => {
   this.toastr.info("Something went wrong while validating the correctness of the information given, please make sure you have internet connection, or procced without validations.");
   this.isMemberNumberValid = true;
   this.isMemberNamesMatch = true;

   this.spinner.hide();
  });
    // calculate member & employer contribution, as well as total amount contributed
   

    // const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    // const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
    // const compensation: number = ((this.compensationPercent / 100) * baseSalary);
    
    // e.data.memberContribution = memberContribution;
    // e.data.employerContribution = employerContribution;
    // e.data.compensation =compensation
    // e.data.amountContributed = memberContribution + employerContribution + compensation;

    if(this.contributionYear < 2023)
    {
      const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
      const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
      const compensation: number = 0;

      e.data.memberContribution = memberContribution;
      e.data.employerContribution = employerContribution;
      e.data.compensation =compensation
      e.data.amountContributed = memberContribution + employerContribution;
      e.data.amountContributedG = memberContribution + employerContribution;
      
    }

    else if(this.contributionTypeValue == 4 && this.contributionYear < 2023)
    {
      const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
      const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
      const compensation: number = 0;

      e.data.memberContribution = memberContribution;
      e.data.employerContribution = employerContribution;
      e.data.compensation =compensation
      e.data.amountContributed = memberContribution + employerContribution;
      e.data.amountContributedG = memberContribution + employerContribution;
    }


    else if(this.contributionTypeValue == 4 && this.contributionYear >= 2023 && this.isEmployerGov == true && this.compensationZeroGov == true)
    {
      const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
      const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
      const compensation: number = 0;
      
      e.data.memberContribution = memberContribution;
      e.data.employerContribution = employerContribution;
      e.data.compensation =compensation
      e.data.amountContributed = memberContribution + employerContribution;
      e.data.amountContributedG = memberContribution + employerContribution;  
    }

    
    else if(this.contributionYear >= 2023 && this.isEmployerGov == true && this.compensationZeroGov == true)
    {
      const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
      const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
      const compensation: number = 0;
      
      e.data.memberContribution = memberContribution;
      e.data.employerContribution = employerContribution;
      e.data.compensation =compensation
      e.data.amountContributed = memberContribution + employerContribution;
      e.data.amountContributedG = memberContribution + employerContribution;  
    }

    else if(this.contributionTypeValue == 4 && this.contributionYear >= 2023)
    {
       const memberContribution: number = 0;
       const employerContribution: number = 0;
       const compensation: number = ((this.compensationPercent / 100) * baseSalary);

      e.data.memberContribution = memberContribution;
      e.data.employerContribution = employerContribution;
      e.data.compensation =compensation
      e.data.amountContributed = memberContribution + employerContribution;
      e.data.amountContributedG = compensation; 
    }

    else
    {
       const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
       const employerContribution: number = ((this.employerPercent / 100) * baseSalary);
       const compensation: number = ((this.compensationPercent / 100) * baseSalary);

       e.data.memberContribution = memberContribution;
       e.data.employerContribution = employerContribution;
       e.data.compensation =compensation
       e.data.amountContributed = memberContribution + employerContribution;
       e.data.amountContributedG = memberContribution + employerContribution + compensation;
    }
  }


  onRowUpdatedINDIVIDUAL(e) {
    // e.component.refresh(true);

   
    // if (this.invoiceForm.get("contributionMonth").invalid) {
    //   this.toastr.error("Please select contribution month to continue")
    //   return;
    // }

    
    // if (this.invoiceForm.get("contributionType").invalid) {
    //   this.toastr.error("Please select contribution type to continue")
    //   return;
    // }

    this.hideInfoAlert = false;
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    const baseSalary = e.data.memberSalary;
    // if (baseSalary < 180000) {
    //   return false;
    // }

    if(e.data.memberSalary == 0 || e.data.memberSalary === undefined) {
      this.toastr.error("Member's salary is below the threshold amount")
      return false;
    }

    let memberNumber = e.data.memberNumber;
    const memberNames = e.data.memberNames;

    if (`${memberNumber}`.trim() === '' || memberNumber === null || memberNumber === undefined) {
      memberNumber = ""
    }

    if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
      this.isMemberNamesMatch = false;
    }


    const data =  {
      requestType: "MEMBERS_VERIFY",
      members: [
          {
              memberNumber,
              memberNames
          }
      ]
  };



  this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
    this.spinner.show();
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    this.hideInfoAlert = false;
    const serverRes = res;
    if (serverRes.code == 2000) {
       for (const el of serverRes.data) {
         if (el.status == 2015) {  // invalid member number
          this.isMemberNumberValid = false;
          this.isMemberNamesMatch = false;
          e.data.isMemberNumberValid = false;
          e.data.isMemberNamesValid = false;
         }

         if (el.status == 2016) {  // Difference in names
          this.isMemberNamesMatch = false;
          this.isMemberNumberValid = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = false;
          e.data.correctName = `${el.registeredName}`;
         }

         if (el.status == 2000) {  // Validation Successful / Empty Member Number
          this.isMemberNumberValid = true;
          this.isMemberNamesMatch = true;
          e.data.isMemberNumberValid = true;
          e.data.isMemberNamesValid = true;
          e.data.correctName = `${el.registeredName}`;
         }
       }
    }
    this.spinner.hide();

  }, err => {
   this.toastr.info("Something went wrong while validating the correctness of the information given, please make sure you have internet connection, or procced without validations.");
   this.isMemberNumberValid = true;
   this.isMemberNamesMatch = true;

   this.spinner.hide();
  });
    // calculate member & employer contribution, as well as total amount contributed
    const memberContribution: number = ((this.memberPercent / 100) * baseSalary);
    const employerContribution: number = ((this.employerPercent / 100) * baseSalary);

    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.amountContributed = memberContribution + employerContribution;
  }

  

  onEditingStart(e) {
    // e.data.employerNumber = this.currrentEmployerNumber;
  }
  getMonthName(e) {
    // tslint:disable-next-line: prefer-for-of
    for (
      let index = 0;
      index < this.contributionService.getMonthsDataset().length;
      index++
    ) {
      if (
        this.contributionService.getMonthsDataset()[index].id ==
        e.data.contributionMonth
      ) {
        e.data.contributionMonth = this.contributionService.getMonthsDataset()[
          index
        ].text;
      }
    }
  }

  verifyMemberNumberAndNames(number, name): boolean {
    let memberNumber = `${number}`;
    const memberNames = `${name}`;

    if (`${memberNumber}`.trim() === '' || memberNumber === null || memberNumber === undefined) {
      memberNumber = ""
    }

    if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
      this.isMemberNamesMatch = false;
    }

    const data =  {
      requestType: "MEMBERS_VERIFY",
      members: [
          {
              memberNumber,
              memberNames
          }
      ]
  };
  
  this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
    const serverRes = res;
    if (serverRes.code == 2000) {
       for (const el of serverRes.data) {
         if (el.status == 2015) {  // invalid member number
          this.isMemberNumberValid = false;
          this.isMemberNamesMatch = false;
         }

         if (el.status == 2016) {  // Difference in names
          this.isMemberNamesMatch = false;
          this.isMemberNumberValid = true;
         }

         if (el.status == 2000) {  // Validation Successful / Empty Member Number
          this.isMemberNumberValid = true;
          this.isMemberNamesMatch = true;
         }
       }
    }
  }, err => {
   this.isMemberNumberValid = true;
   this.isMemberNamesMatch = true;
  });

  return true;
  }

  resetContributionPage() {
  this.invoiceForm.reset();
  this.employeeUploadListDataSource = [];
  }

    onMonthSelectionChanged(e) {
    
    // console.log(e)
    //  if(e.addedItems.length > 0)
    //  {
    //    this.isContributionMonthSelected = true;
    //  }
    //  else  {
    //   this.isContributionMonthSelected = false;
    //  }

     this.monthSelected.push(e.addedItems)
     
     if(e.addedItems.length > 0)
     {
      
      this.monthSelected.push(e.addedItems)
     

      for(let iterator of e.addedItems)
     {
      //console.log("inside loop")
      
      this.myArrays.push(iterator.text)
     }

    
     }

     else if(e.removedItems.length > 0) {
      //console.log(e.removedItems[0].text)
      
      this.myArrays =this.myArrays.filter((item:any) => item != e.removedItems[0].text)
     
       
     }

    //console.log(this.myArrays)
    
    this.LimitedMonthGov =[]
     for(let iterator of this.myArrays)
     {
      
      this.LimitedMonthGov.push(iterator)
     }
     //console.log(this.LimitedMonthGov)
     //"February","March","April","May","June"
     //removedItem
     if(this.LimitedMonthGov.includes("January") || this.LimitedMonthGov.includes("February") || 
      this.LimitedMonthGov.includes("March") || this.LimitedMonthGov.includes("April") || this.LimitedMonthGov.includes("May") ||
      this.LimitedMonthGov.includes("June") )
     {
         
         this.compensationZeroGov = true 
     }
     else{
      
      this.compensationZeroGov = false
     }

    if (e.addedItems.length > 0) { 
      for (const element of e.addedItems) { 
        this.selectedContributionMonths.push(element); 
      } 
    }

    if (e.removedItems.length > 0) {
      for (let i = this.selectedContributionMonths.length - 1; i >= 0; --i) {
        if (this.selectedContributionMonths[i].id === e.removedItems[0].id) {
            this.selectedContributionMonths.splice(i, 1);
        }
    }
    }
    if (this.selectedContributionMonths.length > 0) {
      const type = '';
      this.monthInText = [];
      for (const iterator of this.selectedContributionMonths) {
        this.monthInText.push(`${iterator.text}`);
      }
      if (this.invoiceForm.get('contributionType').value === 1) {

      }
      this.selectedContributionYear = this.invoiceForm.get('contributionYear').value;
      // tslint:disable-next-line: max-line-length
      if(`${this.userGroup}`.match('INDIVIDUAL_CONTRIBUTOR')) {
        this.descriptionString = `Monthly individual contribution for ${this.currentCustomerName}, for ${this.monthInText.join(', ')} ${this.selectedContributionYear}.`;
      } else {
        this.descriptionString = `Monthly ${e.value === undefined ? `contributions` : this.getContributionTypeName(e.value)} for ${this.currentCustomerName}, for ${this.monthInText.join(', ')} ${this.selectedContributionYear}.`;
      }
      this.invoiceForm.get('description').patchValue(this.descriptionString);
    }

    if (this.selectedContributionMonths.length < 1) {
      this.descriptionString = '';
      this.invoiceForm.get('description').reset();
    }
  }

  onContributionYearChanged(e) {
    this.contributionYear = e.value;
    if(e.value < 2023 && this.hideDataUploadControls == true)
    {
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        }
      ];

    }
    else if(e.value >= 2023 && this.hideDataUploadControls == true)
    {
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        }
      ];

    }

    else if(e.value < 2023)
    {
      
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        },
        {
          id: 2,
          text: 'Arrears'
        },
        {
          id: 3,
          text: 'Adjustments'
        }
      ];
    }
    
    else if(e.value >= 2023 && this.hideDataUploadControls == false){
      
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        },
        {
          id: 2,
          text: 'Arrears'
        },
        {
          id: 3,
          text: 'Adjustments'
        },
        {
          id: 4,
          text: 'Compensation'
        }
      ];
    }


    if(e.value < 2023 && this.hideDataUploadControls == false)
    {
      
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        },
        {
          id: 2,
          text: 'Arrears'
        },
        {
          id: 3,
          text: 'Adjustments'
        }
      ];
    }
    
    if(e.value >= 2023){
      
      this.contributionType = [
        {
          id: 1,
          text: 'Contributions'
        },
        {
          id: 2,
          text: 'Arrears'
        },
        {
          id: 3,
          text: 'Adjustments'
        },
        {
          id: 4,
          text: 'Compensation'
        }
      ];
    }
    
    if(e.value < 2023 && this.hideDataUploadControls == true)
    {
        
    }

    else if(e.value >= 2023 && this.hideDataUploadControls == true)
    {
        
    }
    

    else if(e.value < 2023)
    {
      this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
      //console.log(this.UpdatedArray)
      this.employeeUploadListDataSource.splice(0)
      let counter = 0;
      for (const el of this.UpdatedArray) {
        this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
        this.employeeUploadListDataSource.push({
          id: ++counter,   
          correctName: el.correctName,
          isMemberNumberValid: el.isMemberNumberValid,
          isMemberNamesValid: el.isMemberNamesValid,     
          memberNames: el.memberNames,   
          employerNumber: el.employerNumber,   
          memberSalary: el.memberSalary,      
          memberNumber: el.memberNumber,   
          memberContribution: ((this.memberPercent / 100) * el.memberSalary),        
          employerContribution: ((this.employerPercent / 100) * el.memberSalary),      
          compensation: 0,                 
          amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary), 
          amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
        });
      }
   
    }
    

    else if(e.value >=2023 && this.contributionTypeValue == 4 && this.compensationZeroGov == true && this.isEmployerGov == true)
    {
      this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
      
      this.employeeUploadListDataSource.splice(0)
      let counter = 0;

      for (const el of this.UpdatedArray) {
        this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
        this.employeeUploadListDataSource.push({
          id: ++counter,
          correctName: el.correctName,
          isMemberNumberValid: el.isMemberNumberValid,
          isMemberNamesValid: el.isMemberNamesValid,
          memberNames: el.memberNames,
          employerNumber: el.employerNumber,
          memberSalary: el.memberSalary,
          memberNumber: el.memberNumber,
          memberContribution: ((this.memberPercent / 100) * el.memberSalary),
          employerContribution: ((this.employerPercent / 100) * el.memberSalary),
          compensation: 0,
          amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
          amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary)
        });
      }
     }

    else if(e.value >=2023 && this.contributionTypeValue == 4)
    {
      this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
      //console.log(this.UpdatedArray)
      this.employeeUploadListDataSource.splice(0)
      let counter = 0;
      for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: 0,
        employerContribution: 0,
        compensation: ((this.compensationPercent / 100) * el.memberSalary),
        //amountContributed: ((this.compensationPercent / 100) * el.memberSalary),
        amountContributed: 0,
        amountContributedG: ((this.compensationPercent / 100) * el.memberSalary)
      });
    }
 
    }
    else if(e.value >= 2023)
    {

    this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
    //console.log(this.UpdatedArray)
    this.employeeUploadListDataSource.splice(0)
    let counter = 0;
    for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: ((this.memberPercent / 100) * el.memberSalary),
        employerContribution: ((this.employerPercent / 100) * el.memberSalary),
        compensation: ((this.compensationPercent / 100) * el.memberSalary),
        amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
        amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary) + ((this.compensationPercent / 100) * el.memberSalary)
      });
    }

    }

    
    
    
    if (new Date().getFullYear() == e.value) {
      this.months = [];
      for (let index = 0; index < this.contributionService.getMonthsDataset().length; index++) {
        // if (index <= 5) {
          this.months.push(this.contributionService.getMonthsDataset()[index]);
        // }
      }
    } else {
      this.months = [];
      this.months = this.contributionService.getMonthsDataset();
    }

    if (this.selectedContributionMonths.length > 0) {
      this.selectedContributionYear = e.value;
      if (e.previousValue !== e.value) {
        this.descriptionString = this.descriptionString.replace(e.previousValue, e.value);
        this.invoiceForm.get('description').patchValue(this.descriptionString);
      }
      }
    }

  onContributionTypeChanged(e) {
 // tslint:disable-next-line: max-line-length
 this.contributionTypeValue =null
  this.contributionTypeValue = e.value;
  //console.log(this.contributionTypeValue)
  // if(this.isNewRowInserted)
  // {
  //   return;
  // }
  
  if(this.contributionYear < 2023)
  {
    this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
    //console.log(this.UpdatedArray)
    this.employeeUploadListDataSource.splice(0)
    let counter = 0;
    
    for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: ((this.memberPercent / 100) * el.memberSalary),
        employerContribution: ((this.employerPercent / 100) * el.memberSalary),
        compensation: 0,
        amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
        amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary)
      });
  }
}


  if(e.value  == 4 && this.contributionYear >= 2023 && this.compensationZeroGov == true && this.isEmployerGov == true)
  {
    this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
    //console.log(this.UpdatedArray)
    this.employeeUploadListDataSource.splice(0)
    let counter = 0;

    for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: ((this.memberPercent / 100) * el.memberSalary),
        employerContribution: ((this.employerPercent / 100) * el.memberSalary),
        compensation: 0,
        amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
        amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary)
      });
    }
  }

  else if(e.value  == 4 && this.contributionYear >= 2023)
  { 
    //this.showUpdate = true;
    //this.hideDataUploadControls = true
    // var grid = $('#gridContainer').dxDataGrid('instance');  
    // grid.option('dataSource', []);  
    //this.hideDataUploadControls = true
    this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
    //console.log(this.UpdatedArray)
    this.employeeUploadListDataSource.splice(0)
    let counter = 0;
    for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: 0,
        employerContribution: 0,
        compensation: ((this.compensationPercent / 100) * el.memberSalary),
        //amountContributed: ((this.compensationPercent / 100) * el.memberSalary),
        amountContributed: 0,
        amountContributedG: ((this.compensationPercent / 100) * el.memberSalary)
      });
    }
 
  }
  else if(e.value == 4 && this.contributionYear < 2023)
  {
    this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
    //console.log(this.UpdatedArray)
    this.employeeUploadListDataSource.splice(0)
    let counter = 0;

    for (const el of this.UpdatedArray) {
      this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
      this.employeeUploadListDataSource.push({
        id: ++counter,
        correctName: el.correctName,
        isMemberNumberValid: el.isMemberNumberValid,
        isMemberNamesValid: el.isMemberNamesValid,
        memberNames: el.memberNames,
        employerNumber: el.employerNumber,
        memberSalary: el.memberSalary,
        memberNumber: el.memberNumber,
        memberContribution: ((this.memberPercent / 100) * el.memberSalary),
        employerContribution: ((this.employerPercent / 100) * el.memberSalary),
        compensation: 0,
        amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
        amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary)
      });
    }
  }
  else 
  {

  this.UpdatedArray = JSON.parse(sessionStorage.getItem("employeeUploadListDataSource"))
  //console.log(this.UpdatedArray)
  this.employeeUploadListDataSource.splice(0)
  let counter = 0;
  for (const el of this.UpdatedArray) {
    this.lastContributionTotalAmount = +((this.memberPercent / 100) * el.BaseAmount) + ((this.employerPercent / 100) * el.BaseAmount);
    this.employeeUploadListDataSource.push({
      id: ++counter,
      correctName: el.correctName,
      isMemberNumberValid: el.isMemberNumberValid,
      isMemberNamesValid: el.isMemberNamesValid,
      memberNames: el.memberNames,
      employerNumber: el.employerNumber,
      memberSalary: el.memberSalary,
      memberNumber: el.memberNumber,
      memberContribution: ((this.memberPercent / 100) * el.memberSalary),
      employerContribution: ((this.employerPercent / 100) * el.memberSalary),
      compensation: ((this.compensationPercent / 100) * el.memberSalary),
      amountContributed: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary),
      amountContributedG: ((this.memberPercent / 100) * el.memberSalary) + ((this.employerPercent / 100) * el.memberSalary) + ((this.compensationPercent / 100) * el.memberSalary)
    });
  }

  }
 
 if (this.selectedContributionMonths.length > 0) {
  // tslint:disable-next-line: max-line-length

  if(`${this.userGroup}`.match('INDIVIDUAL_CONTRIBUTOR')) {
    this.descriptionString = `Monthly individual contribution for ${this.currentCustomerName}, for ${this.monthInText.join(', ')} ${this.selectedContributionYear}.`;
  } else {
    this.descriptionString = `Monthly ${this.getContributionTypeName(e.value)} for ${this.currentCustomerName}, for ${this.monthInText.join(', ')} ${this.selectedContributionYear}.`;
  }

  this.invoiceForm.get('description').patchValue(this.descriptionString);
 }
  }

  getContributionTypeName(id) {
    let text = '';
    for (const iterator of this.contributionType) {
      if (iterator.id === id) {
        text = iterator.text;
        break;
      }
    }
    return text;
  }

  contributionInWords(month) {
    if (month == '1') {
      return 'January';
    } else if (month == '2') {
      return 'February';
    } else if (month == '3') {
      return 'March';
    } else if (month == '4') {
      return 'April';
    } else if (month == '5') {
      return 'May';
    } else if (month == '6') {
      return 'June';
    } else if (month == '7') {
      return 'July';
    } else if (month == '8') {
      return 'August';
    } else if (month == '9') {
      return 'September';
    } else if (month == '10') {
      return 'October';
    } else if (month == '11') {
      return 'November';
    } else if (month == '12') {
      return 'December';
    }
  }

   getUncontributedPeriods() {
    const data = {
      requestType: 'UNCONTRIBUTED_PERIODS',
      userType: this.authService.getUserDetails().userGroup,
      linkId: this.currrentEmployerNumber
    };

    this.spinner.show();
    this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
      const serverResponse = res;
      if (serverResponse.code == 2000) {
        this.customerDetails.push({
        customerId: serverResponse.data.customerId,
        customerNo: serverResponse.data.customerNo,
        customerType: serverResponse.data.customerType,
        customerName: serverResponse.data.customerName
        });
        this.uncontributedPeriod = serverResponse.data.uncontributedPeriods;
        let counter = 0;
          for (const iterator of serverResponse.data.uncontributedPeriods) {
            this.yearsMonths.push({
              id: ++counter,
              contributionMonth: this.contributionInWord(`${iterator.ContributingPeriod}`.substring(4)),
              contributionYear:  `${iterator.ContributingPeriod}`.substring(0, 4),
              description: `There is Uncontributed contribution for ${this.contributionInWord(`${iterator.ContributingPeriod}`.substring(4))} ${`${iterator.ContributingPeriod}`.substring(0, 4)}, please consider submitting or make payment (if you had already submitted a contribution but no payment was submitted until now) for the stated contribution first to clear this Contribution Gap.`
            });
          }
        if (this.yearsMonths.length > 0) {
          // if (this.yearsMonths.length > 1) {
            this.contributionMonthGapMessage = this.yearsMonths[this.yearsMonths.length - 1].description;
            // console.log(this.yearsMonths);
          // } else {
          //   this.contributionMonthGapMessage = this.yearsMonths[0].description;
          // }
          this.hideContributionMonthGap = false;
        } else {
          this.hideContributionMonthGap = true;
        }
        this.spinner.hide();
      } else {
       this.toastr.error(serverResponse.message);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  contributionInWord(month) {
    if (month == '01' || month == '1') {
      return 'January';
    } else if (month == '02' || month == '2') {
      return 'February';
    } else if (month == '03' || month == '3') {
      return 'March';
    } else if (month == '04' || month == '4') {
      return 'April';
    } else if (month == '05' || month == '5') {
      return 'May';
    } else if (month == '06' || month == '6') {
      return 'June';
    } else if (month == '07' || month == '7') {
      return 'July';
    } else if (month == '08' || month == '8') {
      return 'August';
    } else if (month == '09' || month == '9') {
      return 'September';
    } else if (month == '10' || month == '10') {
      return 'October';
    } else if (month == '11' || month == '11') {
      return 'November';
    } else if (month == '12' || month == '12') {
      return 'December';
    }
}



// upload excel(xlsx) file

parseXLXS = (event) => {
  this.employeeUploadListDataSource = [];
  let totalContributionsAmt = 0;
  this.uploadFailedMessage = 'Loading....';
  let reader = new FileReader();

  reader.onload = () => {
    let data = reader.result;
    let workbook = XLSX.read(data, {
        type: 'binary'
    });
    this.hideInfoAlert = false;
    notify('Please wait while system verify the correctness of the information provided.', 'info', 6000);
    workbook.SheetNames.forEach((sheetName) => {
      let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      let json = XL_row_object;
      this.uploadFailedMessage =
      'Converting excel data format to json format....';

    let memberSalaryConverted: any;
    let counter = 0;
    // tslint:disable-next-line: prefer-for-of
    this.spinner.show();

    for (let i = 0; i < json.length; i++) {
      // console.log('funck');
      if (!json[0].hasOwnProperty('memberNumber')) {
        // if (json.length < this.employeeUploadListDataSource.length) {
          this.showAlertDialog = true;
          this.alertReason = `Please include memberNumber header in your excelsheet on member numbers column.`;
          this.spinner.hide();
          return;
        // }
      }

      if (!json[0].hasOwnProperty('memberName')) {
        // if (json.length < this.employeeUploadListDataSource.length) {
          this.showAlertDialog = true;
          this.alertReason = `Please include memberName header in your excelsheet on member names column.`;
          this.spinner.hide();
          return;
        // }
      }

      if (!json[0].hasOwnProperty('memberSalary')) {
        // if (json.length < this.employeeUploadListDataSource.length) {
          this.showAlertDialog = true;
          this.alertReason = `Please include memberSalary header in your excelsheet on members salary column.`;
          // this.toastr.error('Please include memberName header in your excelsheet for members names column..');
          this.spinner.hide();
          return;
        // }
      }

      if (json[i].memberSalary == null || json[i].memberSalary == '' || json[i].memberSalary === undefined) {
        if (json.length <= this.employeeUploadListDataSource.length) {
          this.showAlertDialog = true;
          this.alertReason = `Member Salary is Missing, please update your member\'s salary in the excel sheet.`;
          // this.toastr.error('Member Salary is required, please update your member\'s salary in the excel sheet 2.');
          this.spinner.hide();
          return;
        }
      }

      if (json[i].memberName == null || json[i].memberName == '' || json[i].memberName == undefined) {
        if (json.length <= this.employeeUploadListDataSource.length) {
          this.showAlertDialog = true;
          this.alertReason = `MemberName column in your excelsheet is empty, please include it in your excelsheet.`;
          // this.toastr.error('Member Name is required, please include it in your excelsheet.');
          this.spinner.hide();
          return;
        }
      }

      if (isNaN(json[i].memberSalary) && json[i].memberSalary !== undefined && json[i].memberSalary != '') {
        memberSalaryConverted = json[i].memberSalary.toString();
        memberSalaryConverted = +memberSalaryConverted.replace(/,/g, '');
      } else {
        memberSalaryConverted = json[i].memberSalary;
      }
      if (!isNaN(memberSalaryConverted)) {
      if (memberSalaryConverted < 0) {
        // this.toastr.error(`Negative amount is not allowed for members salaries.`);
        this.showAlertDialog = true;
        this.alertReason = `Negative amount is not allowed for members salaries.`;
        this.spinner.hide();
        return;
      }
    }

    if (json.length < this.employeeUploadListDataSource.length) {
      if (!isNaN(memberSalaryConverted)) {
      if (memberSalaryConverted < this.thresholdAmount) {
        this.showAlertDialog = true;
        // tslint:disable-next-line: max-line-length
        this.alertReason = `One of your member has salary below the threshold amount (${this.thresholdAmount}), current entries has been filtered out to allow only members with salary above threshold amount (${this.thresholdAmount}). please update the your member salary in the excel sheet.`;
        this.spinner.hide();
        return;
      }
    }
  }

      let memberNumber = `${json[i].memberNumber}`;
      let memberNames = `${json[i].memberName}`;
      console.log(json[i].memberNumber);
      if (memberNumber === null || memberNumber === undefined) {
        memberNumber = "";
      }

      if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
        this.isMemberNamesMatch = false;
        memberNames = '';
      }

      const data =  {
        requestType: "MEMBERS_VERIFY",
        members: [
            {    
                memberNumber,
                memberNames
            }
        ]
    };

    //
    if (memberSalaryConverted >=  this.thresholdAmount) {
          
      if(this.contributionYear < 2023 ){
      
         this.employeeUploadListDataSource.push({
          id: ++counter,
          isMemberNumberValid: true,
          isMemberNamesValid: true,
          correctName: '',
          employerNumber: this.currrentEmployerNumber,
          memberNames: json[i].memberName,
          memberSalary: memberSalaryConverted,
          memberNumber: memberNumber == 'undefined' ? '':memberNumber,
          memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
          employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
          compensation: 0,
          amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
          amountContributed:
            (((this.memberPercent / 100) * memberSalaryConverted) +
            ((this.employerPercent / 100) * memberSalaryConverted) 
            ),
          
        });
        totalContributionsAmt +=
          (((this.memberPercent / 100) * +memberSalaryConverted) +
          ((this.employerPercent / 100) * memberSalaryConverted) 
          );
      }

      else if(this.contributionYear < 2023 && this.isEmployerGov == true) {
        this.employeeUploadListDataSource.push({
          id: ++counter,
          isMemberNumberValid: true,
          isMemberNamesValid: true,
          correctName: '',
          employerNumber: this.currrentEmployerNumber,
          memberNames: json[i].memberName,
          memberSalary: memberSalaryConverted,
          memberNumber: memberNumber == 'undefined' ? '':memberNumber,
          memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
          employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
          compensation: 0,
          amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
          amountContributed:
            (((this.memberPercent / 100) * memberSalaryConverted) +
            ((this.employerPercent / 100) * memberSalaryConverted) 
            ),
          
        });
        totalContributionsAmt +=
          (((this.memberPercent / 100) * +memberSalaryConverted) +
          ((this.employerPercent / 100) * memberSalaryConverted) 
          );
      }

      else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true && this.contributionTypeValue == 4 ){
        this.employeeUploadListDataSource.push({
          id: ++counter,
          isMemberNumberValid: true,
          isMemberNamesValid: true,
          correctName: '',
          employerNumber: this.currrentEmployerNumber,
          memberNames: json[i].memberName,
          memberSalary: memberSalaryConverted,
          memberNumber: memberNumber == 'undefined' ? '':memberNumber,
          memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
          employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
          compensation: 0,
          amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
          amountContributed:
            (((this.memberPercent / 100) * memberSalaryConverted) +
            ((this.employerPercent / 100) * memberSalaryConverted) 
            ),
          
        });
        totalContributionsAmt +=
          (((this.memberPercent / 100) * +memberSalaryConverted) +
          ((this.employerPercent / 100) * memberSalaryConverted) 
          );
      }

      else if(this.contributionYear == 2023 && this.contributionTypeValue == 4)
      {  
       
        this.employeeUploadListDataSource.push({
          id: ++counter,
          isMemberNumberValid: true,
          isMemberNamesValid: true,
          correctName: '',
          employerNumber: this.currrentEmployerNumber,
          memberNames: json[i].memberName,
          memberSalary: memberSalaryConverted,
          memberNumber: memberNumber == 'undefined' ? '':memberNumber,
          memberContribution: 0,
          employerContribution: 0,
          compensation: ((this.compensationPercent / 100) * memberSalaryConverted), 
          //amountContributed:(((this.compensationPercent / 100) * memberSalaryConverted)),
          amountContributed: 0,
          amountContributedG: ((this.compensationPercent / 100) * memberSalaryConverted),
          
        });
        totalContributionsAmt +=(((this.compensationPercent / 100) * memberSalaryConverted))
        }

        else if(this.contributionYear == 2023 && this.isEmployerGov == true && this.compensationZeroGov == true )
        {
         
          this.employeeUploadListDataSource.push({
            id: ++counter,
            isMemberNumberValid: true,
            isMemberNamesValid: true,
            correctName: '',
            employerNumber: this.currrentEmployerNumber,
            memberNames: json[i].memberName,
            memberSalary: memberSalaryConverted,
            memberNumber: memberNumber == 'undefined' ? '':memberNumber,
            memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
            employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
            compensation: 0,
            amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted),  
            amountContributed:
              (((this.memberPercent / 100) * memberSalaryConverted) +
              ((this.employerPercent / 100) * memberSalaryConverted) 
              ),
            
          });
          totalContributionsAmt +=
            (((this.memberPercent / 100) * +memberSalaryConverted) +
            ((this.employerPercent / 100) * memberSalaryConverted) 
            );

           // this.compensationZeroGov = false;
        }
       
       else{
      
        this.employeeUploadListDataSource.push({
          id: ++counter,
          isMemberNumberValid: true,
          isMemberNamesValid: true,
          correctName: '',
          employerNumber: this.currrentEmployerNumber,
          memberNames: json[i].memberName,
          memberSalary: memberSalaryConverted,
          memberNumber: memberNumber == 'undefined' ? '':memberNumber,
          memberContribution: ((this.memberPercent / 100) * memberSalaryConverted),
          employerContribution: ((this.employerPercent / 100) * memberSalaryConverted),
          compensation: ((this.compensationPercent / 100) * memberSalaryConverted),
          amountContributedG: ((this.memberPercent / 100) * memberSalaryConverted) + ((this.employerPercent / 100) * memberSalaryConverted) + ((this.compensationPercent / 100) * memberSalaryConverted),  
          amountContributed:
            (((this.memberPercent / 100) * memberSalaryConverted) +
            ((this.employerPercent / 100) * memberSalaryConverted) 
            // ((this.compensationPercent / 100) * memberSalaryConverted)
            ),
          
        });
        totalContributionsAmt +=
          (((this.memberPercent / 100) * +memberSalaryConverted) +
          ((this.employerPercent / 100) * memberSalaryConverted) +
          ((this.compensationPercent / 100) * memberSalaryConverted)
          );
      }
      
      // sessionStorage.removeItem("employeeUploadListDataSource")
      // //console.log(this.employeeUploadListDataSource)
      // sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSource))
     


        if (`${memberNames}`.trim() === '' || memberNames === null || memberNames === undefined) {
          this.isMemberNamesMatch = false;
        }

        const data =  {
          requestType: "MEMBERS_VERIFY",
          members: [
              {
                  memberNumber,
                  memberNames
              }
          ]
      };

    this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
      this.spinner.show();
      this.hideInfoAlert = false;
      
      const serverRes = res;
      
      if (serverRes.code == 2000) {
         for (const el of serverRes.data) {
           if (el.status == 2015) {  // invalid member number
            this.isMemberNumberValid = false;
            this.isMemberNamesMatch = false;
            this.employeeUploadListDataSource[i].isMemberNumberValid = false;
            this.employeeUploadListDataSource[i].isMemberNamesValid = false;
           }

           if (el.status == 2016) {  // Difference in names
            this.isMemberNamesMatch = false;
            this.isMemberNumberValid = true;
            this.employeeUploadListDataSource[i].isMemberNumberValid = true;
            this.employeeUploadListDataSource[i].isMemberNamesValid = false;
            this.employeeUploadListDataSource[i].correctName = `${el.registeredName}`;
           }

           if (el.status == 2000) {  // Validation Successful / Empty Member Number
            this.isMemberNumberValid = true;
            this.isMemberNamesMatch = true;
            this.employeeUploadListDataSource[i].isMemberNumberValid = true;
            this.employeeUploadListDataSource[i].isMemberNamesValid = true;
            this.employeeUploadListDataSource[i].correctName = `${el.registeredName}`;
           }
         }

         sessionStorage.removeItem("employeeUploadListDataSource")
         //console.log(this.employeeUploadListDataSource)
         sessionStorage.setItem("employeeUploadListDataSource",JSON.stringify(this.employeeUploadListDataSource))
       }
      this.spinner.hide();

    }, err => {
     this.toastr.info("Something went wrong while validating the correctness of the information given, please make sure you have internet connection, or procced without validations.");
     this.isMemberNumberValid = true;
     this.isMemberNamesMatch = true;

     this.spinner.hide();
    });
    }
      // this.employeeUploadListDataSource = json;
      this.uploadFailedMessage = 'Conversion completed....';
      }
    this.spinner.hide();
    })
  };

  reader.onloadend = () => {
    this.uploadFailedMessage = 'Data uploaded successfully....';
    this.openFileUploadDialog = false;
  };

  reader.onerror = (ex) => {
  };

  reader.readAsBinaryString(event.file);
  this.hideEmployeeUploadForm = true;
  this.hideEmployeeListDataGrid = false;
};


}
