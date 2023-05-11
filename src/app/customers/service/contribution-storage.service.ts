import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ContributionStorageService {

  constructor() { }

  private isMultipleContribution = false;

  private cotributionInvoicesListDatasource = [];

  decryptString(data) {
    if (data === null || data === undefined) {
      return data;
    }
    const bytes  = CryptoJS.AES.decrypt(data, AppSettings.XPR_TOS_PST_TEST);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

  decryptNumberString(data) {
    if (data === null || data === undefined) {
      return data;
    }
    const bytes  = CryptoJS.AES.decrypt(data, AppSettings.XPR_TOS_PST_TEST);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }

  encryptString(data): string {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), AppSettings.XPR_TOS_PST_TEST).toString();
    return ciphertext;
    }

  public setSingleInvoiceDetails(invoiceId, invoiceDetailId, invoiceNo,
                                 amountPaid, contributionYear, contributionMonth,
                                 employerId, invoiceTrackNo) {
    const invoice = {
      invoiceId,
      invoiceDetailId,
      invoiceNo,
      amountPaid,
      contributionYear,
      contributionMonth,
      employerId,
      invoiceTrackNo
  };
    // tslint:disable-next-line: max-line-length
    this.cotributionInvoicesListDatasource = this.decryptString(sessionStorage.getItem(AppSettings.invoiceStorageKey)) == null ? [] : this.decryptString(sessionStorage.getItem(AppSettings.invoiceStorageKey));
    this.cotributionInvoicesListDatasource.push(invoice);
    sessionStorage.setItem(AppSettings.invoiceStorageKey, this.encryptString(this.cotributionInvoicesListDatasource));
  }

  public getCotributionInvoicesListDatasource() {
    this.cotributionInvoicesListDatasource = this.decryptString(sessionStorage.getItem(AppSettings.invoiceStorageKey));
    return this.cotributionInvoicesListDatasource;
  }

  public setIsMultipleContribution(param: boolean) {
    this.isMultipleContribution = param;
  }

  public getIsMultipleContribution() {
    return this.isMultipleContribution;
  }
}
