import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-registraton-performance',
  templateUrl: './member-registraton-performance.component.html',
  styleUrls: ['./member-registraton-performance.component.scss']
})
export class MemberRegistratonPerformanceComponent extends SharedClassComponent implements OnInit {
  fetchForm: FormGroup;
  registrationPerformanceDataSource =[]
  disableDate = true;
  disableMonthYear = true;
  disableQota = true

  qotaList = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}]

  
  month = [
    {name:"January",value:"1"},
    {name:"February",value:"2"},
    {name:"March",value:"3"},
    {name:"April",value:"4"},
    {name:"May",value:"5"},
    {name:"June",value:"6"},
    {name:"July",value:"7"},
    {name:"August",value:"8"},
    {name:"September",value:"9"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]
  
  year: any;

  // constructor() { }

  ngOnInit() {
    this.fetchForm = new FormGroup({
      requestType: new FormControl('', Validators.compose([])),
      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      qota: new FormControl('', Validators.compose([])),
      month: new FormControl('', Validators.compose([])),
      year: new FormControl('', Validators.compose([])),
      fiscalyear: new FormControl('', Validators.compose([])),
    });

    this.fetchForm.reset()
  }


  getData() {

    let sDate
    let eDate

    if (this.fetchForm.get('startDate').value == null) {
      this.fetchForm.get('startDate').patchValue("");
    }

    if (this.fetchForm.get('endDate').value == null) {
      this.fetchForm.get('endDate').patchValue("");
    }

    const startDatestring = new Date(this.fetchForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.fetchForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('endDate').value).getDate()).slice(-2);

    if (new Date(startDatestring) > new Date(endDatestring)) {
      this.toastr.error("Start Date is greater than end Date.");
      this.spinner.hide();
      return;
    }

    if(startDatestring.trim() == "NaN-aN-aN")
    {
      sDate = ""
    }
    else{
      sDate = startDatestring
    }

    if(endDatestring.trim() == "NaN-aN-aN")
    {
      eDate = ""
    }
    else{
      eDate = endDatestring
    }
   

      const data = {
        "requestType":"MEMBER_REGISTRATION_PERFOMANCE",
        "fromDate": sDate,
        "toDate": eDate,
        "month": this.fetchForm.get("month").value,
        "year": this.fetchForm.get("year").value,
        "quarter": this.fetchForm.get("qota").value,
        "fiscalYear": this.fetchForm.get("fiscalyear").value

      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        //console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.registrationPerformanceDataSource = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }

    getFiscalYear(e){
    
      const fyStartYear = +e.value ;
      const fyEndYear = fyStartYear + 1;
      
      this.year = `${fyStartYear}/${fyEndYear}`
      //return `${fyStartYear}/${fyEndYear}`;
    }


    onCheckChangeDate(e)
  {
    
    
    const ischecked = (<HTMLInputElement>e.target).checked
    
    if(ischecked)
    {
      this.disableDate = false;
      this.disableMonthYear = true;
      this.disableQota = true
    }
  
  }

  onCheckChangeMonthYear(e)
  {
    
    
    const ischecked = (<HTMLInputElement>e.target).checked
    
    if(ischecked)
    {
      this.disableMonthYear = false;
      this.disableDate = true
      this.disableQota = true
    }
   
  }

  onCheckChangeQota(e)
  {
    const ischecked = (<HTMLInputElement>e.target).checked
    
    if(ischecked)
    {
      this.disableQota = false;
      this.disableDate = true
      this.disableMonthYear = true
    }
  }


}
