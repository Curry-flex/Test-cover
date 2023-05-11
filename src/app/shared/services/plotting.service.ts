import { Injectable } from '@angular/core';


class Complaints {
  complaint: string;
  count: number;
}

export class ComplaintsWithPercent {
  complaint: string;
  count: number;
  cumulativePercent: number;
}

export class PaymentsByPspBanks {
  psp: string;
  val: number;
}
export class Collections {
  month: string;
  banks: number;
  mno: number;
  pos: number;
}
export class BillInfo {
  month: string;
  paid: number;
  pending: number;
  defected: number;
}

export class BillDescription {
  value: string;
  name: string;
}

export class TotalInvoicesPerType {
  invoiceType: string;
  total: number;
}

const totals: TotalInvoicesPerType[] = [{
  invoiceType: 'contribution Invoices',
  total: 500
}, {
  invoiceType: 'sales Invoices',
  total: 600
}, {
  invoiceType: 'penalty Invoices',
  total: 1700
}];

const totalPaidInvoices: TotalInvoicesPerType[] = [{
  invoiceType: 'contribution Invoices',
  total: 400
}, {
  invoiceType: 'sales Invoices',
  total: 200
}, {
  invoiceType: 'penalty Invoices',
  total: 700
}];

const billTypes: BillDescription[] = [
  { value: 'paid', name: 'Paid Bills' },
  { value: 'pending', name: 'Pending Bills' },
  { value: 'defected', name: 'Defected Bills' }
];

const billsInfo: BillInfo[]  = [
{
month: 'Jan',
paid: 180,
pending: 3220,
defected: 5
}, {
month: 'Feb',
paid: 190,
pending: 152,
defected: 10
}, {
month: 'Mar',
paid: 200,
pending: 10,
defected: 0
}, {
month: 'Apr',
paid: 450,
pending: 30,
defected: 19
}, {
month: 'May',
paid: 380,
pending: 80,
defected: 40
},
{
month: 'Jun',
paid: 301,
pending: 21,
defected: 3
},
{
month: 'Jul',
paid: 201,
pending: 11,
defected: 2
},
{
month: 'Aug',
paid: 451,
pending: 39,
defected: 9
},
{
month: 'Sep',
paid: 441,
pending: 35,
defected: 8
},
{
month: 'Oct',
paid: 431,
pending: 29,
defected: 7
},
{
month: 'Nov',
paid: 497,
pending: 41,
defected: 17
},
{
month: 'Dec',
paid: 407,
pending: 59,
defected: 9
}
];

const collectionData: Collections[] = [{"month":"Jan","banks":966295341.68,"mno":0,"pos":0},{"month":"Feb","banks":128244372.97000001,"mno":0,"pos":0},{"month":"Mar","banks":205823123.55999997,"mno":0,"pos":0},{"month":"Apr","banks":18630000,"mno":0,"pos":0},{"month":"May","banks":0,"mno":0,"pos":0},{"month":"Jun","banks":0,"mno":0,"pos":0},{"month":"Jul","banks":0,"mno":0,"pos":0},{"month":"Aug","banks":0,"mno":0,"pos":0},{"month":"Sep","banks":0,"mno":0,"pos":0},{"month":"Oct","banks":0,"mno":0,"pos":0},{"month":"Nov","banks":0,"mno":0,"pos":0},{"month":"Dec","banks":0,"mno":0,"pos":0}];

const complaintsData: Complaints[] = [
  { complaint: 'Contribution', count: 780 },
  { complaint: 'Payment', count: 120 },
  { complaint: 'Investment', count: 52 },
  { complaint: 'Registration', count: 123 },
  { complaint: 'Improvement', count: 321 },
  { complaint: 'Suggestion', count: 89 },
  { complaint: 'System Bug', count: 222 },
  { complaint: 'Others', count: 22 }
];

const PaymentByBanks: PaymentsByPspBanks[] = [{
  psp: 'CRDB',
  val: 0
}, {
  psp: 'NMB',
  val: 0
}, {
  psp: 'PBZ',
  val: 0
}];
@Injectable({
  providedIn: 'root'
})
export class PlottingService {

 formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  formatCurrency(number) {
    let val =  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    val = val.replace('$', '');
    return val;
  }

  getComplaintsData(): ComplaintsWithPercent[] {
    const data = complaintsData.sort((a, b) => {
            return b.count - a.count;
        });
    const totalCount = data.reduce((prevValue, item) =>  {
            return prevValue + item.count;
        }, 0);
    let cumulativeCount = 0;
    return data.map((item, index) => {
        cumulativeCount += item.count;
        return {
            complaint: item.complaint,
            count: item.count,
            cumulativePercent: Math.round(cumulativeCount * 100 / totalCount)
        };
    });
}

getPaymentByBanks(): PaymentsByPspBanks[] {
  return PaymentByBanks;
}

getCollectionData(): Collections[] {
  return collectionData;
}

getBillsInfo(): BillInfo[] {
  return billsInfo;
}
getBillTypes(): BillDescription[] {
  return billTypes;
}

getInvoices(): TotalInvoicesPerType[] {
  return totals;
}
getPaidInvoices(): TotalInvoicesPerType[] {
  return totalPaidInvoices;
}
}
