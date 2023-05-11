import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-pensioners-list',
  templateUrl: './pensioners-list.component.html',
  styleUrls: ['./pensioners-list.component.scss']
})
export class PensionersListComponent extends SharedClassComponent implements OnInit {

  pensionersStatus = [{name:"active",val:1},{name:"inactive",val:0}]
  pensionersListForm: FormGroup;
  pensionersDatasource = []


  ngOnInit() {

    this.pensionersListForm = new FormGroup({
     
      status: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }


  getList()
  {
    if(this.pensionersListForm.invalid)
    {
      this.toastr.error("Please choose status to proceed")
      return
    }

    const data = {
      "requestType": "PENSIONERS_LIST",
      "status": this.pensionersListForm.get("status").value
    };

    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
           this.pensionersDatasource = response.data;
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

      "requestType": "PENSIONERS_GET",
      "pensionerNo": e.data.PensionerNo

    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("pensionData")
          sessionStorage.setItem("pensionData", JSON.stringify(response.data))
          this.router.navigateByUrl('fumis-pansioners-info')
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
