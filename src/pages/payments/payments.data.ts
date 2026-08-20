import { Transaction } from './payments.types';

export const MOCK_TRANSACTIONS: Transaction[] = [
    { key: '1',  txnId: 'TXN-5401', partyName: 'Sarah Johnson',   type: 'Wallet Top-up', amount: '$150.00',   date: '2026-06-05', status: 'Completed' },
    { key: '2',  txnId: 'TXN-5402', partyName: 'Blossom Flowers',  type: 'Withdrawal',    amount: '$1,250.00', date: '2026-06-05', status: 'Pending' },
    { key: '3',  txnId: 'TXN-5403', partyName: 'Mike Chen',        type: 'Gift Payment',  amount: '$89.99',    date: '2026-06-04', status: 'Completed' },
    { key: '4',  txnId: 'TXN-5404', partyName: 'Sweet Delights',   type: 'Withdrawal',    amount: '$890.50',   date: '2026-06-04', status: 'Completed' },
    { key: '5',  txnId: 'TXN-5405', partyName: 'Emily Davis',      type: 'Wallet Top-up', amount: '$200.00',   date: '2026-06-03', status: 'Completed' },
    { key: '6',  txnId: 'TXN-5406', partyName: 'James Lee',        type: 'Gift Payment',  amount: '$120.00',   date: '2026-06-03', status: 'Pending' },
    { key: '7',  txnId: 'TXN-5407', partyName: 'Petal & Co',       type: 'Withdrawal',    amount: '$3,400.00', date: '2026-06-02', status: 'Completed' },
    { key: '8',  txnId: 'TXN-5408', partyName: 'Rachel Green',     type: 'Wallet Top-up', amount: '$75.00',    date: '2026-06-01', status: 'Completed' },
    { key: '9',  txnId: 'TXN-5409', partyName: 'Carlos Mendez',    type: 'Gift Payment',  amount: '$200.00',   date: '2026-05-30', status: 'Completed' },
    { key: '10', txnId: 'TXN-5410', partyName: 'Lily Thompson',    type: 'Wallet Top-up', amount: '$50.00',    date: '2026-05-29', status: 'Pending' },
];
