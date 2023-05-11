import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private controlNumber: any;
  private invoiceNumber: any;
  private invoiceID: any;
  private invoiceDetailID: any;
  private invoiceTrackNumber: any;
  private created: any;
  private totalAmountContributed: any;
  private employerName: any;
  private employerPhone: any;
  private employerEmail: any;
  private paymentType: any;
  private invoiceDescription: any;
  private contributionYear: any;
  private contributionMonth: any;
  private invoiceCurrency: any;
  private isInvoiceCreated: boolean = false;

  constructor() { }

  public setInvoiceDetails(invoiceNumber,
                           invoiceID, invoiceDetailID,
                           invoiceTrackNumber, created,
                           totalAmountContributed,
                           employerName, employerPhone,
                           employerEmail, paymentType,
                           invoiceDescription,
                           contributionYear,
                           contributionMonth,
                           invoiceCurrency,
                           isInvoiceCreated: boolean) {
    this.invoiceNumber = invoiceNumber;
    this.invoiceID = invoiceID;
    this.invoiceDetailID = invoiceDetailID;
    this.invoiceTrackNumber = invoiceTrackNumber;
    this.created = created;
    this.totalAmountContributed = totalAmountContributed;
    this.employerName = employerName;
    this.employerPhone = employerPhone;
    this.employerEmail = employerEmail;
    this.paymentType = paymentType;
    this.invoiceDescription = invoiceDescription;
    this.contributionYear = contributionYear;
    this.contributionMonth = contributionMonth;
    this.invoiceCurrency = invoiceCurrency;
    this.isInvoiceCreated = isInvoiceCreated;
  }

  setControlNumber(controlNumber) {
    this.controlNumber = controlNumber;
  }
  getControlNumber(): any {
    return this.controlNumber;
  }

  getInvoiceCurrency() {
    return this.invoiceCurrency;
  }
  getInvoiceNumber(): any {
    return this.invoiceNumber;
  }

  getInvoiceID(): any {
    return this.invoiceID;
  }

  getInvoiceDetailID(): any {
    return this.invoiceDetailID;
  }

  getInvoiceTrackNumber(): any {
    return this.invoiceTrackNumber;
  }

  getCreated(): any {
    return this.created;
  }

  getTotalAmountContributed(): any {
    return this.totalAmountContributed;
  }

  getEmployerName(): any {
    return this.employerName;
  }

  getEmployerPhone(): any {
    return this.employerPhone;
  }

  getEmployerEmail(): any {
    return this.employerEmail;
  }

  getPaymentType(): any {
    return this.paymentType;
  }

  getInvoiceDescription(): any {
    return this.invoiceDescription;
  }

  getContributionYear(): any {
    return this.contributionYear;
  }

  getContributionMonth(): any {
    return this.contributionMonth;
  }
  setIsInvoiceCreated(param: boolean) {
    this.isInvoiceCreated = param;
  }
  getIsInvoiceCreated() {
    return this.isInvoiceCreated;
  }
}
