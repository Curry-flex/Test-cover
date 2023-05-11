import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-compensation-claim-list',
  templateUrl: './compensation-claim-list.component.html',
  styleUrls: ['./compensation-claim-list.component.scss']
})
export class CompensationClaimListComponent extends SharedClassComponent implements OnInit {

  claimList = []

  ngOnInit() {
    this.contributionClaimList() 
  }


  contributionClaimList() {
    const data = {
      "requestType": "COMPENSATION_CLAIM_LIST"
    };

    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.claimList = response.data;
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
    

    const data = {
      "requestType": "COMPENSATION_CLAIM_GET",
        "id": e.data.id
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("compensationClaimData")
          sessionStorage.setItem("compensationClaimData", JSON.stringify(response.data))
          this.router.navigateByUrl('compensation-claim-info')
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
