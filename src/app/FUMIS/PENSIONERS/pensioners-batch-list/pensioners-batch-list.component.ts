import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-pensioners-batch-list',
  templateUrl: './pensioners-batch-list.component.html',
  styleUrls: ['./pensioners-batch-list.component.scss']
})
export class PensionersBatchListComponent extends SharedClassComponent implements OnInit {

   batchListDatasource = []

  ngOnInit() {
    this.batchList()
  }

  batchList() {
    const data = {
      "requestType": "PENSIONERS_BATCHES_LIST"
    };

    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.batchListDatasource = response.data;
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

  previewDetailsu($event)
  {
    
  }

}
