import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetMyProfileQuery, useUpdateProfileMutation } from '../../features/profile/profileApi';
import { baseURL } from '../../utils/BaseURL';

const EditProfile: React.FC = () => {
    const [profileForm] = Form.useForm();
    const [imgURL, setImgURL] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data: profileResponse, isLoading, isFetching } = useGetMyProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const profileData = profileResponse?.data?.result;

    useEffect(() => {
        if (profileData) {
            profileForm.setFieldsValue({
                fullName: profileData.fullName || '',
                email: profileData.email || '',
                role: profileData.role || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
            });

            const rawProfile = profileData.profile;
            if (rawProfile) {
                const fullUrl = rawProfile.startsWith('http')
                    ? rawProfile
                    : `${baseURL}/${rawProfile.replace(/\\/g, '/')}`;
                setImgURL(fullUrl);
            } else {
                setImgURL('/user.svg');
            }
        }
    }, [profileForm, profileData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImgURL(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onProfileFinish = async (values: { fullName: string; phone: string; address: string }) => {
        try {
            const formData = new FormData();
            formData.append('fullName', values.fullName || '');
            formData.append('phone', values.phone || '');
            formData.append('address', values.address || '');

            if (selectedFile) {
                formData.append('profile', selectedFile);
            }

            const res = await updateProfile(formData).unwrap();

            Swal.fire({
                title: 'Success',
                text: res?.message || 'Profile updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire({
                title: 'Update Failed',
                text: err?.data?.message || err?.message || 'Failed to update profile. Please try again.',
                icon: 'error',
            });
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="py-12">
                <LoadingSpinner text="Loading profile details..." />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-4">
            {/* Custom CSS override for disabled inputs to show crisp white text */}
            <style>{`
                .ant-input[disabled], 
                .ant-input-disabled,
                input[disabled] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    opacity: 1 !important;
                }
            `}</style>

            <Form name="update_profile" layout="vertical" onFinish={onProfileFinish} form={profileForm}>
                {/* Profile Picture Header */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative">
                        <input 
                            onChange={handleFileChange} 
                            type="file" 
                            id="profile_img_input" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                        />
                        <label 
                            htmlFor="profile_img_input" 
                            className="relative block w-28 h-28 cursor-pointer rounded-full group"
                        >
                            {/* Inner Circle Avatar Image */}
                            <div 
                                className="w-full h-full rounded-full bg-cover bg-center border-4 border-white/10 shadow-lg overflow-hidden" 
                                style={{ backgroundImage: `url(${imgURL || '/user.svg'})` }}
                            />

                            {/* Outer Edit Badge (Unclipped with z-index) */}
                            <div 
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-[#46000B] flex items-center justify-center shadow-md z-20 transition-transform group-hover:scale-110"
                                style={{ background: '#ff4b72' }}
                            >
                                <AiOutlineEdit size={16} className="text-white" />
                            </div>
                        </label>
                    </div>
                    <h3 className="text-white font-bold text-lg mt-3 font-sans m-0">{profileData?.fullName || 'User'}</h3>
                    <span className="text-[#ff4b72] text-xs font-semibold uppercase tracking-wider mt-0.5">
                        ROLE: {profileData?.role || 'super_admin'}
                    </span>
                </div>

                {/* 2-Column Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {/* Full Name */}
                    <Form.Item
                        name="fullName"
                        label={<span className="block text-white/80 font-medium text-sm mb-1">Full Name</span>}
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input 
                            placeholder="Enter your full name" 
                            className="h-11 bg-[#560e18] border-white/10 text-white rounded-xl placeholder:text-[#b7868b] focus:border-[#ff4b72]"
                        />
                    </Form.Item>

                    {/* Phone Number */}
                    <Form.Item
                        name="phone"
                        label={<span className="block text-white/80 font-medium text-sm mb-1">Phone Number</span>}
                    >
                        <Input 
                            placeholder="Enter phone number" 
                            className="h-11 bg-[#560e18] border-white/10 text-white rounded-xl placeholder:text-[#b7868b] focus:border-[#ff4b72]"
                        />
                    </Form.Item>

                    {/* Email Field (Disabled / Read Only - White Text) */}
                    <Form.Item
                        name="email"
                        label={<span className="block text-white/80 font-medium text-sm mb-1">Email (Read Only)</span>}
                    >
                        <Input 
                            disabled 
                            className="h-11 rounded-xl cursor-not-allowed font-medium"
                            style={{ color: '#ffffff' }}
                        />
                    </Form.Item>

                    {/* Role Field (Disabled / Read Only - White Text) */}
                    <Form.Item
                        name="role"
                        label={<span className="block text-white/80 font-medium text-sm mb-1">Role (Read Only)</span>}
                    >
                        <Input 
                            disabled 
                            className="h-11 rounded-xl cursor-not-allowed uppercase font-medium"
                            style={{ color: '#ffffff' }}
                        />
                    </Form.Item>

                    {/* Address Field (Spans across both columns) */}
                    <div className="md:col-span-2">
                        <Form.Item
                            name="address"
                            label={<span className="block text-white/80 font-medium text-sm mb-1">Address</span>}
                        >
                            <Input.TextArea 
                                rows={3} 
                                placeholder="Enter your address" 
                                className="bg-[#560e18] border-white/10 text-white rounded-xl placeholder:text-[#b7868b] focus:border-[#ff4b72]"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* Save Changes Button */}
                <Form.Item className="flex justify-center mt-6 mb-0">
                    <Button 
                        loading={isUpdating}
                        disabled={isUpdating}
                        style={{ 
                            height: 44, 
                            borderRadius: '10px', 
                            fontWeight: 600, 
                            paddingLeft: '36px', 
                            paddingRight: '36px',
                            background: '#ff2150',
                            borderColor: 'transparent',
                            color: '#ffffff'
                        }} 
                        type="primary" 
                        htmlType="submit"
                    >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfile;
