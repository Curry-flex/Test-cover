import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-aggregate-statement',
  templateUrl: './employer-aggregate-statement.component.html',
  styleUrls: ['./employer-aggregate-statement.component.scss']
})
export class EmployerAggregateStatementComponent extends SharedClassComponent implements OnInit {
  statementForm: FormGroup;
  statementDatasource: any = []
  showSummury = false;
  empName:any
  empNumber:any

  

  ngOnInit() {

    this.statementForm = new FormGroup({
     
      empNo: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }


  filterStetement()
  {
    if(this.statementForm.invalid)
    {
      this.toastr.error("Enter employer number")
      return
    }

    const data = {
      "requestType": "AGGREGATE_EMPLOYER_STATEMENT",
        "employerNumber": this.statementForm.get("empNo").value,
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.statementDatasource = response.data;
           this.empName = this.statementDatasource[0].EmployerName;
           this.empNumber = this.statementDatasource[0].EmployerNumber
           
          this.showSummury =true
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
