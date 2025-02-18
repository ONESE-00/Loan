import { ArrayType } from "@angular/compiler";

export interface Loan {

    id: number;
    customerId: number;
    principalAmount: number;
    interestRate: number;
    repaymentPeriod: number;
    duedate: string;
    startdate: string;
    frequency: string;
    status: string;
    repayments: ArrayType;
    amount: number;
    startDate: string;
    //principalAmount: number;

}
