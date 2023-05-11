import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-compensation-claim-register',
  templateUrl: './compensation-claim-register.component.html',
  styleUrls: ['./compensation-claim-register.component.scss']
})
export class CompensationClaimRegisterComponent extends SharedClassComponent implements OnInit {

   //@ViewChild('videoPlayer','') videoplayer: any;
   returnedList = [{val:1,name:"Yes"},{val:2,name:"No"}]
   employmentTypesList =[{name:"FULL TIME"},{name:"PART TIME"}]
   witnesses: any = []
   fileDatasource: any = []
   witnessForm: FormGroup
   compensationRegisterForm: FormGroup
   file: any
   districtList: any = [];
   districtListNew: any = [];
   regionList: any = [];
   data:any
   fileUpload: any
   base64file:any
   fileDescription: any
   fileExtension: any
   incidentOutcomeList: any = [];
   treatmenttypesList: any = [];
   paymentModes: any = [];
   bankList: any = [];
  
   ngOnInit() {
     this.getDistricts()
     this.getRegion()
     this.incidentOutcomes()
     this.treatmentTypes()
     this.paymentOptionGet()
     this.getBanks()
     this.witnessForm = new FormGroup({
       fullname: new FormControl('', Validators.compose([])),
       address: new FormControl('', Validators.compose([])),
       phone: new FormControl('', Validators.compose([])),
       position: new FormControl('', Validators.compose([])),
     });
 
     this.compensationRegisterForm = new FormGroup({
       empNo: new FormControl('', Validators.compose([])),
       memberNo: new FormControl('', Validators.compose([])),
       employmentType: new FormControl('', Validators.compose([])),
       dept: new FormControl('', Validators.compose([])),
       retunedWork: new FormControl('', Validators.compose([])),
       returnedDate: new FormControl('', Validators.compose([])),
       AntireturnedDate: new FormControl('', Validators.compose([])),
 
       dateLastWorked: new FormControl('', Validators.compose([])),
       incDate: new FormControl('', Validators.compose([])),
       incTime: new FormControl('', Validators.compose([])),
       region: new FormControl('', Validators.compose([])),
       district: new FormControl('', Validators.compose([])),
       accCause: new FormControl('', Validators.compose([])),
       injured: new FormControl('', Validators.compose([])),
       occupationWhenInjured: new FormControl('', Validators.compose([])),
 
       injuredBodyParts: new FormControl('', Validators.compose([])),
       moreDetails: new FormControl('', Validators.compose([])),
       facilityName: new FormControl('', Validators.compose([])),
       facilityAddress: new FormControl('', Validators.compose([])),
       facilityPhone: new FormControl('', Validators.compose([])),
       physicianName: new FormControl('', Validators.compose([])),
       physicianPosition: new FormControl('', Validators.compose([])),
       ableToWorkAgain: new FormControl('', Validators.compose([])),
 
       incOutCome: new FormControl('', Validators.compose([])),
       DOB: new FormControl('', Validators.compose([])),
       injuryNature: new FormControl('', Validators.compose([])),
       treatmentType: new FormControl('', Validators.compose([])),
       uploads: new FormControl('', Validators.compose([])),
       paymentMode: new FormControl('', Validators.compose([])),
       accNo: new FormControl('', Validators.compose([])),
       accName: new FormControl('', Validators.compose([])),
       bankID: new FormControl('', Validators.compose([])),
       bankReID: new FormControl('', Validators.compose([])),
 
       //FILES
       fileSource: new FormControl(null, Validators.compose([Validators.required])),
     });
 
     this.witnesses = []
   }
 
   addWitness()
   {
     this.witnesses.push({
       "fullName": this.witnessForm.get("fullname").value,
       "phone": this.witnessForm.get("phone").value,
       "address": this.witnessForm.get("address").value,
       "position": this.witnessForm.get("position").value
     })
     this.witnessForm.reset()
 
     console.log(this.witnesses)
   }
 
   onChange1(event:any) {
     if (event.target.files.length > 0) {
       
       this.fileUpload = event.target.files[0];
     
       // this.compensationRegisterForm.patchValue({
       //   fileSource: file
       // });
 
       const extension = event.target.files[0].name.split(".").pop()
       
     
 
        // console.log(this.fileDatasource)
      }
 }
 
 onChange(event) {
   const file = event.target.files[0];
   this.fileExtension = event.target.files[0].name.split(".").pop()
   this.fileDescription = event.target.files[0].name.split(".")[0]
   //console.log(this.fileDescription)
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => {
     this.base64file = reader.result;
       //console.log(reader.result);
   };
 }
 
 register()
 {
   const returnedWorkDate = new Date(this.compensationRegisterForm.get('returnedDate').value).getFullYear() + "-"+  ("0"+(new Date(this.compensationRegisterForm.get('returnedDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.compensationRegisterForm.get('returnedDate').value).getDate()).slice(-2);
   const anticipatedDate = new Date(this.compensationRegisterForm.get('AntireturnedDate').value).getFullYear() + "-"+  ("0"+(new Date(this.compensationRegisterForm.get('AntireturnedDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.compensationRegisterForm.get('AntireturnedDate').value).getDate()).slice(-2);
   const incDate = new Date(this.compensationRegisterForm.get('incDate').value).getFullYear() + "-"+  ("0"+(new Date(this.compensationRegisterForm.get('incDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.compensationRegisterForm.get('incDate').value).getDate()).slice(-2);
   const DOB = new Date(this.compensationRegisterForm.get('DOB').value).getFullYear() + "-"+  ("0"+(new Date(this.compensationRegisterForm.get('DOB').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.compensationRegisterForm.get('DOB').value).getDate()).slice(-2);
   const dateLastWorked = new Date(this.compensationRegisterForm.get('dateLastWorked').value).getFullYear() + "-"+  ("0"+(new Date(this.compensationRegisterForm.get('dateLastWorked').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.compensationRegisterForm.get('dateLastWorked').value).getDate()).slice(-2);
 
 
    const data ={
 
     "requestType": "COMPENSATION_CLAIM_REGISTER",
     "empNo": this.compensationRegisterForm.get('empNo').value,
     "memberNo": this.compensationRegisterForm.get('memberNo').value,
     "incDate": incDate,
     "incTime": this.compensationRegisterForm.get('incTime').value,
     "incRegion": this.compensationRegisterForm.get('region').value,
     "incDistrict": this.compensationRegisterForm.get('district').value,
     "injuredOnWork": this.compensationRegisterForm.get('injured').value,
     "employmentType": this.compensationRegisterForm.get('employmentType').value,
     "assignedDepartment":this.compensationRegisterForm.get('dept').value,
     "occupationWhenInjured": this.compensationRegisterForm.get('occupationWhenInjured').value,
     "ableToWorkAgain": this.compensationRegisterForm.get('ableToWorkAgain').value,
     "returnedToWork":this.compensationRegisterForm.get('retunedWork').value,
     "dateReturnedToWork": returnedWorkDate,
     "anticipatedReturnDate": anticipatedDate,
     
     "dateLastWorked": dateLastWorked,
     "incOutcomeId": this.compensationRegisterForm.get('incOutCome').value,
     "dateOfDeath": DOB,
     "witnesses": this.witnesses,
     "accidentCause": this.compensationRegisterForm.get('accCause').value,
     "injuredBodyParts": this.compensationRegisterForm.get('injuredBodyParts').value,
     "injuryNature": "Broken",
     "treatmentType": this.compensationRegisterForm.get('treatmentType').value,
     "moreDetails": this.compensationRegisterForm.get('moreDetails').value,
     "facilityName": this.compensationRegisterForm.get('facilityName').value,
     "facilityAddress": this.compensationRegisterForm.get('facilityAddress').value,
     "facilityPhone": this.compensationRegisterForm.get('facilityPhone').value,
     "physicianName": this.compensationRegisterForm.get('physicianName').value,
     "physicianPosition": this.compensationRegisterForm.get('physicianPosition').value,
     "paymentMode" :  this.compensationRegisterForm.get('paymentMode').value,
    "accNo" : this.compensationRegisterForm.get('accNo').value,
    "accName" : this.compensationRegisterForm.get('accName').value,
    "bankId" : this.compensationRegisterForm.get('bankID').value,
    "benRelationId" : this.compensationRegisterForm.get('bankReID').value,
     "uploads": [
         {
             "upDesc": this.fileDescription,
             "file": this.base64file,
             "extension" : this.fileExtension
         }
     ]
 
 
   }
 
  
 
   const formData = new FormData();
   //formData.append("data", JSON.stringify(data))
   //formData.append("uploads", this.fileUpload)
   //console.log(this.fileUpload)
    this.spinner.show()
   this.utilities.postServiceCallNew(data).subscribe(res => {
     this.spinner.hide()
     const serverResponse = res;
     this.spinner.hide();
     if (serverResponse.code == 2000) {
        this.toastr.success(serverResponse.message);
        this.compensationRegisterForm.reset()
     } else {
       this.toastr.error(serverResponse.message);
       // this.toastr.error(serverResponse.message, 'Failed to create invoice');
     }
   }, error => {
          this.spinner.hide();
          this.toastr.error('Something went wrong, please try again');
   });
 }
 
 
 getDistricts() {
   const data = {
     requestType: "DISTRICT_LIST",
     
     
   };
   this.spinner.show();
   this.utilities.postServiceCallNew(data).subscribe(
     (res) => {
       console.log(res.json);
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

 filterDistricts(e)
 {
  
   this.districtListNew =this.districtList.filter((res) => res.regionId == e.value)
   
   
 }
 
 incidentOutcomes() {
   const data = {
     requestType: "INCIDENT_OUTCOME_LIST", 
   };
   this.spinner.show();
   this.utilities.postServiceCallNew(data).subscribe(
     (res) => {
       const response = res;
       if (response.code == 2000) {
         this.incidentOutcomeList = response.data;
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
 
 
 treatmentTypes() {
   const data = {
     "requestType": "TREATMENT_TYPES_LIST"
   };
   this.spinner.show();
   this.utilities.postServiceCallNew(data).subscribe(
     (res) => {
       const response = res;
       if (response.code == 2000) {
         this.treatmenttypesList = response.data;
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
 
 paymentOptionGet() {
   const data = {
     requestType: "PAYMENT_MODES_LIST",
     
     
   };
   this.spinner.show();
   this.utilities.postServiceCallNew(data).subscribe(
     (res) => {
       const response = res;
       if (response.code == 2000) {
         this.paymentModes = response.data;
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
 
 
 getBanks() {
   const data = {
     requestType: "BANK_LIST",
     
     
   };
   this.spinner.show();
   this.utilities.postServiceCallNew(data).subscribe(
     (res) => {
       const response = res;
       if (response.code == 2000) {
         this.bankList = response.data;
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
