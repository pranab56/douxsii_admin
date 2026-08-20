import { FaqItem } from './faqs.types';

export const MOCK_FAQS: FaqItem[] = [
    {
        id: '1',
        question: 'How do I schedule a service booking?',
        answer: 'To schedule a service, navigate to the Services menu in your admin panel, choose the appropriate class/category, select the customer details, and submit.'
    },
    {
        id: '2',
        question: 'Where can I update my profile details?',
        answer: 'Click on your profile avatar in the upper right header to access "My Profile". Under the Edit Profile tab, you can change your display name, login email, and upload a new profile photo.'
    },
    {
        id: '3',
        question: 'Can I change my admin password?',
        answer: 'Yes. In the Profile settings area, select the "Change Password" tab. Input your current password and define a secure new password of at least 8 characters.'
    }
];
