import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-statement',
  templateUrl: './member-statement.component.html',
  styleUrls: ['./member-statement.component.scss']
})
export class MemberStatementComponent extends SharedClassComponent implements OnInit {

  years =[]
  statementForm: FormGroup;
  statementDatasource: any = [];
  entriesList: any =[];
  // constructor() { }

  ngOnInit() {
   this.years = this.getYears()

   this.statementForm = new FormGroup({
     
    memberNo: new FormControl('', Validators.compose([Validators.required])),
    entryList: new FormControl('', Validators.compose([Validators.required])),
  
  });

  this.getEntries()
  }

  public getYears() {
    const years = [];
    const initialYear = 2017;
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = currentYear; i >= initialYear; i--) {
      years.push(i);
    }
    return years;
  }


  filterStetement()
  {
    if(this.statementForm.invalid)
    {
      this.toastr.error("Enter member number and year to proceed")
      return
    }

    const data = {
    
        "requestType": "MEMBER_STATEMENT",
        "memberNumber": this.statementForm.get("memberNo").value,
        "entryType": this.statementForm.get("entryList").value

    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.statementDatasource = response.data;
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

  getEntries() {
    const data = {
      requestType: "ENTRY_TYPES_LIST",
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.entriesList = response.data;
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
