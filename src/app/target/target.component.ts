import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent extends SharedClassComponent implements OnInit {
  rtlEnabled = true;
  currencyFormat: string;
  balance = 0;
  revenueDataDource = [
    {
      id: 1,
      text: 'Rent'
    },
    {
      id: 2,
      text: 'On Time Purchase'
    },
    {
      id: 3,
      text: 'Contributions'
    }
  ];
  targetDataSource = [];
  years = [];
  targetForm: FormGroup;

  now = new Date().getFullYear();

  ngOnInit() {
    this.currencyFormat = '$ #.##';
    for (let index = this.now; index < this.now + 5; index++) {
      this.years.push({
        year: index
      });
    }
    this.targetForm = new FormGroup({
      revenueSource: new FormControl(null, Validators.compose([Validators.required])),
      financialYear: new FormControl(null, Validators.compose([Validators.required])),
      balance: new FormControl(null, Validators.compose([])),
      jan: new FormControl(null, Validators.compose([])),
      feb: new FormControl(null, Validators.compose([])),
      mar: new FormControl(null, Validators.compose([])),
      apr: new FormControl(null, Validators.compose([])),
      may: new FormControl(null, Validators.compose([])),
      jun: new FormControl(null, Validators.compose([])),
      jul: new FormControl(null, Validators.compose([])),
      aug: new FormControl(null, Validators.compose([])),
      sep: new FormControl(null, Validators.compose([])),
      oct: new FormControl(null, Validators.compose([])),
      nov: new FormControl(null, Validators.compose([])),
      dec: new FormControl(null, Validators.compose([]))
    });
  }
  onSubmitTargetData() {
    this.toastr.info('Submitted.');
  }

  updateBalanceOnContentChange(e) {
  }

  onClearTargetData() {
    this.targetForm.reset();
  }

}
