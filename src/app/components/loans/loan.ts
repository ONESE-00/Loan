import { ArrayType } from "@angular/compiler";

export interface Loan {

    loanid: number;
    principal_amount: number;
    interestRate: number;
    repayment_period: number;
    duedate: string;
    startdate: string;
    frequency: string;
    status: string;
    repayments: ArrayType;
    amount: number;
    startDate: string;
    //principalAmount: number;

}
