export interface Transaction {
    key: string;
    txnId: string;
    partyName: string;
    type: 'Wallet Top-up' | 'Withdrawal' | 'Gift Payment';
    amount: string;
    date: string;
    status: 'Completed' | 'Pending';
}
