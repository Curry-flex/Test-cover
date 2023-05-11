import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-aggregate-statement',
  templateUrl: './member-aggregate-statement.component.html',
  styleUrls: ['./member-aggregate-statement.component.scss']
})
export class MemberAggregateStatementComponent extends SharedClassComponent implements OnInit {
  statementForm: FormGroup;
  statementDatasource = []
  empName: any;
  empNumber: any;
  showSummury = false;

  

  ngOnInit() {

    this.statementForm = new FormGroup({
     
      memberNo: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }


  filterStetement()
  {
    if(this.statementForm.invalid)
    {
      this.toastr.error("Enter member number")
      return
    }

    const data = {
     
        "requestType": "AGGREGATE_MEMBER_STATEMENT",
        "memberNumber": this.statementForm.get("memberNo").value

    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
         
          this.statementDatasource = response.data;
          // this.empName = this.statementDatasource[0].EmployerName;
          // this.empNumber = this.statementDatasource[0].EmployerNumber
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
