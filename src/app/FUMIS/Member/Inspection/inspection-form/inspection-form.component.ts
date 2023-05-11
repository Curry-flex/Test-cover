import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-inspection-form',
  templateUrl: './inspection-form.component.html',
  styleUrls: ['./inspection-form.component.scss']
})
export class InspectionFormComponent extends SharedClassComponent implements OnInit {
  inspectionCreateForm: any;
  underPaymentStatus = 0
  demandNotice = 0
  verbalInstructions = 0
  dishouredCheck = 0
  payrollCheck = 0
  suspenceCleareance = 0
  newEmployerAdded = 0
  newEmployerFound = 0
  noticeProvided = 0
  newMemberAdded =0


  
  emplyerID: any
  inspectionTypeList = [];
  groupLeadersList = []

  

  

  ngOnInit() {

    this.groupLeader()

    this.inspectionCreateForm = new FormGroup({
      
      empNo: new FormControl('', Validators.compose([Validators.required])),
      inspectionDate: new FormControl(this.today, Validators.compose([Validators.required])),
      empName: new FormControl('', Validators.compose([Validators.required])),
      inspectionType: new FormControl('', Validators.compose([Validators.required])),
      inspectionLeader: new FormControl('', Validators.compose([Validators.required])),
      contactPerson: new FormControl('', Validators.compose([])),
      rank: new FormControl('', Validators.compose([])),
      contactPersonPhone: new FormControl('', Validators.compose([])),
      arrivalTime: new FormControl('', Validators.compose([])),
      deptTime: new FormControl('', Validators.compose([])),
      payrollCheck: new FormControl('', Validators.compose([])),
      susClearance: new FormControl('', Validators.compose([])),
      ucheck: new FormControl('', Validators.compose([])),
      dcheck: new FormControl('', Validators.compose([])),
      routine: new FormControl('', Validators.compose([])),
      routineOtherS: new FormControl('', Validators.compose([])),
      newemployer: new FormControl('', Validators.compose([])),
      newemployerNum: new FormControl('', Validators.compose([])),
      empMemberContr: new FormControl('', Validators.compose([])),
      verbalInst: new FormControl('', Validators.compose([])),
      notice: new FormControl('', Validators.compose([])),
      demandNotice: new FormControl('', Validators.compose([])),
      courtAction: new FormControl('', Validators.compose([])),
      newEmpAdd: new FormControl('', Validators.compose([])),
      newMemAdd: new FormControl('', Validators.compose([])),
      refNo: new FormControl('', Validators.compose([])),
      nextAppointment: new FormControl('', Validators.compose([])),
      remark: new FormControl('', Validators.compose([])),
      
    });

    this.inspectionType()
  }


  createForm()
  {
    if(this.inspectionCreateForm.get("empNo").invalid)
    {
      this.toastr.error("Please enter employer number")
      return
    }

    if(this.inspectionCreateForm.get("inspectionDate").invalid)
    {
      this.toastr.error("Please enter inspection date")
      return
    }


    // if(this.inspectionCreateForm.get("empName").invalid)
    // {
    //   this.toastr.error("Please enter employer name")
    //   return
    // }

    if(this.inspectionCreateForm.get("inspectionType").invalid)
    {
      this.toastr.error("Please enter inspection type")
      return
    }

    // if(this.inspectionCreateForm.get("inspectionLeader").invalid)
    // {
    //   this.toastr.error("Please enter inspection leader")
    //   return
    // }

    


    let inspectionDate
    let appointment

   

    const registrationDate = new Date(this.inspectionCreateForm.get('inspectionDate').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionCreateForm.get('inspectionDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionCreateForm.get('inspectionDate').value).getDate()).slice(-2);
    const nextAppointment = new Date(this.inspectionCreateForm.get('nextAppointment').value).getFullYear() + "-"+  ("0"+(new Date(this.inspectionCreateForm.get('nextAppointment').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.inspectionCreateForm.get('nextAppointment').value).getDate()).slice(-2);



    if(registrationDate.trim() == "NaN-aN-aN")
    {
      inspectionDate = ""
    }
    else{
      inspectionDate = registrationDate
    }

    if(nextAppointment.trim() == "NaN-aN-aN")
    {
      appointment = ""
    }
    else{
      appointment = nextAppointment
    }
   

      const data = {

        "requestType":"INSPECTION_FORM",
        "employerID": this.emplyerID,
        "inspectionTypeID": this.inspectionCreateForm.get("inspectionType").value,
        "inspectionDate": inspectionDate,
        "inspLeader": this.inspectionCreateForm.get("inspectionLeader").value,
        "contactPerson": this.inspectionCreateForm.get("contactPerson").value,
        "rank": this.inspectionCreateForm.get("rank").value,
        "contactPersonPhoneNumber": this.inspectionCreateForm.get("contactPersonPhone").value,
        "arriveTime":this.inspectionCreateForm.get("arrivalTime").value,
        "depatureTime": this.inspectionCreateForm.get("deptTime").value,
        "payRollCheck": this.payrollCheck,
        "suspenceClearance": this.suspenceCleareance,
        "underPaymentCheck": this.underPaymentStatus,
        "routineOthers": this.inspectionCreateForm.get("routine").value,
        "dishournedCheque": this.dishouredCheck,
        "routineOthersSpecify": this.inspectionCreateForm.get("routineOtherS").value,
        "newEmployers": this.newEmployerAdded,
        "newEmployerNumber": "",
        "employerMembersContributions": this.inspectionCreateForm.get("empMemberContr").value,
        "verbalInstructions": this.verbalInstructions,
        "notice": this.noticeProvided,
        "demandNotice": this.demandNotice,
        "courtAction": this.inspectionCreateForm.get("courtAction").valu,
        "newEmployerAdd": this.newEmployerAdded,
        "newMemberAded": this.newMemberAdded,
        "refenceNumber": this.inspectionCreateForm.get("refNo").value,
        "nextAppoINTment": appointment,
        "remarks": this.inspectionCreateForm.get("remark").value

      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.inspectionCreateForm.reset()
          //this.inspectionSummury = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }
    
      
  



  onCheckChange(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
    console.log(event)
    if(ischecked)
    {
     this.underPaymentStatus=1;
    }
    else{
     this.underPaymentStatus=0;
    }
  }

 

  
  onCheckChangeUP(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
    
    if(ischecked)
    {
     this.underPaymentStatus=1;
    }
    else{
     this.underPaymentStatus=0;
    }
  }

  onCheckChangeDN(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.demandNotice=1;
    }
    else{
     this.demandNotice=0;
    }
  }

  onCheckChangeVI(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.verbalInstructions=1;
    }
    else{
     this.verbalInstructions=0;
    }
  }


  onCheckChangeDC(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.dishouredCheck=1;
    }
    else{
     this.dishouredCheck=0;
    }
  }

  onCheckChangePY(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.payrollCheck=1;
    }
    else{
     this.payrollCheck=0;
    }
  }

  onCheckChangeSC(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.suspenceCleareance=1;
    }
    else{
     this.suspenceCleareance=0;
    }
  }

  onCheckChangeNEA(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.newEmployerAdded=1;
    }
    else{
     this.newEmployerAdded=0;
    }
  }

  onCheckChangeNEF(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.newEmployerFound=1;
    }
    else{
     this.newEmployerFound=0;
    }
  }

  onCheckChangeNP(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.noticeProvided=1;
    }
    else{
     this.noticeProvided=0;
    }
  }

  onCheckChangeNMA(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
   
    if(ischecked)
    {
     this.newMemberAdded=1;
    }
    else{
     this.newMemberAdded=0;
    }
  }

  fetchEmployerID(e)
  {
    
    const data = {
      "requestType": "EMPLOYERS_GET",
      "employerNumber": e.value
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.emplyerID = response.data.EmployerID;
          console.log(this.emplyerID)
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


  inspectionType()
  {
    
    const data = {
      "requestType": "INSPECTION_TYPES",
      
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.inspectionTypeList = response.data;
          
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



  groupLeader()
  {
    
    const data = {
      "requestType": "SYSTEM_USERS",
      
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.groupLeadersList = response.data;
          
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
