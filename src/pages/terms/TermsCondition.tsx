import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../features/settings/settingsApi';
import toast from 'react-hot-toast';

const TermsCondition = () => {
    const [content, setContent] = useState('');

    const { data: settingsResponse } = useGetSettingsQuery({
        key: 'termsOfService',
        value: 'termsOfService',
    });
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

    useEffect(() => {
        if (settingsResponse?.data?.termsOfService !== undefined) {
            setContent(settingsResponse.data.termsOfService || '');
        }
    }, [settingsResponse]);

    const handleSave = async () => {
        try {
            // Sends ONLY termsOfService property in request body
            const res = await updateSettings({ termsOfService: content }).unwrap();
            toast.success(res?.message || 'Terms & Conditions saved successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to save Terms & Conditions');
        }
    };

    return (
        <div className="space-y-6 pb-6 relative">

            <PageHeader
                title="Terms & Conditions"
                subtitle="Manage the terms and conditions visible to all users on the platform."
            />


            <RichTextEditor value={content} onChange={setContent} />

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 px-6 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#ff2150' }}
            >
                {isSaving ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </button>


        </div>
    );
};

export default TermsCondition;
