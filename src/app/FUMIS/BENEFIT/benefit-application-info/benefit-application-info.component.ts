import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-benefit-application-info',
  templateUrl: './benefit-application-info.component.html',
  styleUrls: ['./benefit-application-info.component.scss']
})
export class BenefitApplicationInfoComponent extends SharedClassComponent implements OnInit {

  tab_paneldata: any = [{
    ID: 1,
    icon: '',
    name: 'Application Details',
}, {
    ID: 2,
    icon: '',
    name: 'Contribution Details',
}, {
  ID: 3,
  icon: '',
  name: 'Calculation Details',
},
{
  ID: 4,
  icon: '',
  name: 'Payment Details',
},

{
  ID: 5,
  icon: '',
  name: 'Pensions',
},
{
  ID: 6,
  icon: '',
  name: 'Processing Stage',
},





];
benefitData: any = [];
  

  ngOnInit() {

    this.benefitData =JSON.parse(sessionStorage.getItem("benefitData"))
  }

}
