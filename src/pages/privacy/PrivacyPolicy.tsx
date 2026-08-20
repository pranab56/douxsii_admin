import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../features/settings/settingsApi';
import toast from 'react-hot-toast';

const PrivacyPolicy = () => {
    const [content, setContent] = useState('');

    const { data: settingsResponse } = useGetSettingsQuery({
        key: 'privacyPolicy',
        value: 'privacyPolicy',
    });
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

    useEffect(() => {
        if (settingsResponse?.data?.privacyPolicy !== undefined) {
            setContent(settingsResponse.data.privacyPolicy || '');
        }
    }, [settingsResponse]);



    const handleSave = async () => {
        try {
            // Sends ONLY privacyPolicy property in request body
            const res = await updateSettings({ privacyPolicy: content }).unwrap();
            toast.success(res?.message || 'Privacy Policy saved successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to save Privacy Policy');
        }
    };

    return (
        <div className="space-y-6 pb-6 relative">

            <PageHeader
                title="Privacy Policy"
                subtitle="Manage the privacy policy visible to all users on the platform."
            />
            <RichTextEditor value={content} onChange={setContent} />

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 px-6 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none disabled:opacity-50"
                style={{ background: '#ff2150' }}
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default PrivacyPolicy;
