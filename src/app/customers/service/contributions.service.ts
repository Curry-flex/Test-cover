import { Injectable } from '@angular/core';
import csv2json from 'csvjson-csv2json/csv2json';

import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ContributionsService {

  employeeUploadListDataSource = {};
  private paymentTypeID: any;
  private contributionYear: any;
  private contributionMonth: any;
  private totalAmount: any;
  private narration: any;
  private employerNumber: any;
  private contributions: '';

  monthsDataset = [
    {
      id: 1,
      text: 'January'
    },
    {
      id: 2,
      text: 'February'
    },
    {
      id: 3,
      text: 'March'
    },
    {
      id: 4,
      text: 'April'
    },
    {
      id: 5,
      text: 'May'
    },
    {
      id: 6,
      text: 'June'
    },
    {
      id: 7,
      text: 'July'
    },
    {
      id: 8,
      text: 'August'
    },
    {
      id: 9,
      text: 'September'
    },
    {
      id: 10,
      text: 'October'
    },
    {
      id: 11,
      text: 'November'
    },
    {
      id: 12,
      text: 'December'
    }
  ];

  private data = {
    paymentTypeID: 1,
    contributionYear: '',
    contributionMonth: '',
    totalAmount: '',
    narration: '',
    employerNumber: '',
    contributions: ''
  };

  getPaymentTypeID(): any {
    return this.paymentTypeID;
  }

  public setPaymentTypeID(value: any) {
    this.paymentTypeID = value;
  }

  getContributionYear(): any {
    return this.contributionYear;
  }

  public setContributionYear(value: any) {
    this.contributionYear = value;
  }

  getContributionMonth(): any {
    return this.contributionMonth;
  }

  public setContributionMonth(value: any) {
    this.contributionMonth = value;
  }

  getTotalAmount(): any {
    return this.totalAmount;
  }

  setTotalAmount(value: any) {
    this.totalAmount = value;
  }

  getNarration(): any {
    return this.narration;
  }

  public setNarration(value: any) {
    this.narration = value;
  }
  setEmployerNumber(employerNumber) {
    this.employerNumber = employerNumber;
  }
  getEmployerNumber() {
    return this.employerNumber;
 }
  getContributions() {
    return this.contributions;
  }

  public setContributions(contributions: any) {
    this.contributions = contributions;
  }

  constructor() { }

  public set setEmployeeUploadList(file) {

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const json = csv2json(text, {parseNumbers: true});
        this.employeeUploadListDataSource = {
          data: json
        };
      };
      reader.readAsText(file);
    }

  public get getEmployeeUploadListDataSource() {
    return this.employeeUploadListDataSource;
  }

  public getMonthsDataset() {
    return this.monthsDataset;
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

  public getContributionData() {
    this.data.paymentTypeID = this.getPaymentTypeID();
    this.data.contributionYear = this.getContributionYear();
    this.data.contributionMonth = this.getContributionMonth();
    this.data.totalAmount = this.getTotalAmount();
    this.data.narration = this.getNarration();
    this.data.employerNumber = this.getEmployerNumber();
    this.data.contributions = this.getContributions();

    return this.data;
  }

}

export class Contribution {
  employerNumber: any;
  memberNumber: any;
  memberNames: string;
  memberSalary: number;
  memberContribution: number;
  employerContribution: number;
  amountContributed: number;
}
