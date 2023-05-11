import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-compensation-claim-info',
  templateUrl: './compensation-claim-info.component.html',
  styleUrls: ['./compensation-claim-info.component.scss']
})
export class CompensationClaimInfoComponent extends SharedClassComponent implements OnInit {

  claimInfo: any = [];
  showCalculate = false

  tab_paneldata: any = [{
    ID: 1,
    icon: '',
    name: 'Employer Details',
}, {
    ID: 2,
    icon: '',
    name: 'Incident Details',
}, {
  ID: 3,
  icon: '',
  name: 'Medical Details',
},
{
  ID: 4,
  icon: '',
  name: 'Payment Details',
},
{
  ID: 5,
  icon: '',
  name: 'Claim Details',
},

{
  ID: 6,
  icon: '',
  name: 'Uploads',
},

{
  ID: 7,
  icon: '',
  name: 'Actions',
}

];
  calculateDatasource: any = [];

 

  ngOnInit() {
    this.claimInfo =JSON.parse(sessionStorage.getItem("compensationClaimData"))
  }


  reject(e) {
    console.log(e)
    const data = {
      "requestType": "COMPENSATION_CLAIM_REJECT",
      "id": e,
      "remarks": "Checked Successfully"
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message)
          setTimeout(()=>{
            this.router.navigateByUrl("compensation-claim-list");
          },3000);
          
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

  foward(e) {
    const data = {
      "requestType": "COMPENSATION_CLAIM_FORWARD",
        "id": e,
        "remarks": "Checked Successfully"
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message)
          setTimeout(()=>{
            this.router.navigateByUrl("compensation-claim-list");
          },3000);
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


  close(e) {
    const data = {
      "requestType": "COMPENSATION_CLAIM_FORWARD",
        "id": e,
        "remarks": "Checked Successfully"
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message)
          setTimeout(()=>{
            this.router.navigateByUrl("compensation-claim-list");
          },3000);
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

  calculate(e) {
    const data = {
      "requestType": "COMPENSATION_CLAIM_CALCULATE",
        "id": e,
        "remarks": "Checked Successfully"
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
              this.calculateDatasource.push(res.data)
              this.showCalculate = true
              console.log(this.calculateDatasource)
          //this.toastr.success(response.message)
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
