import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-member-age-group',
  templateUrl: './member-age-group.component.html',
  styleUrls: ['./member-age-group.component.scss']
})
export class MemberAgeGroupComponent extends SharedClassComponent implements OnInit {
  filterMemberForm: FormGroup;
  status: any  =0
  memberList: any =[];

 

  ngOnInit() {

    this.filterMemberForm = new FormGroup({

      age: new FormControl('', Validators.compose([])),
      active: new FormControl('', Validators.compose([])),
    });
  }


  onCheckChange(event: Event)
  {
    
    const ischecked = (<HTMLInputElement>event.target).checked
    
    if(ischecked)
    {
     this.status=1;
    }
    else{
     this.status=0;
    }
  }


  
  filterMember()
  {

  
    const data ={
      "requestType": "MEMBER_AGE_GROUPS",
      "ageGroupWidth": this.filterMemberForm.get("age").value,
      "isActive": this.status

    }

    this.spinner.show()

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
    this.spinner.hide()
      this.spinner.hide();
      if (res.code == 2000) {
        this.memberList = res.data
        this.toastr.success(res.message)
       
        
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });

  }

}
