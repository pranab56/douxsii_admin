import { useEffect, useRef, useState } from 'react';
import { Modal, Form, ConfigProvider, Select } from 'antd';
import { FiCamera, FiChevronDown, FiShield, FiUserCheck } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import { FormInput } from './FormInput';
import { SupportMember } from '../../features/support_team/supportApi';

import { getLoadingText } from '../../utils/loadingText';

interface SupportAgentModalProps {
    open: boolean;
    editingAgent: SupportMember | null;
    onClose: () => void;
    onSubmit: (values: AgentFormValues, avatar: string | null) => Promise<void>;
    isLoading?: boolean;
}

export interface AgentFormValues {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'support_manager' | 'support_agent' | string;
}

const fieldLabel = (text: string) => (
    <span className="text-white text-sm font-medium">{text}</span>
);

export const SupportAgentModal = ({ open, editingAgent, onClose, onSubmit, isLoading = false }: SupportAgentModalProps) => {
    const [form] = Form.useForm();
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            form.setFieldsValue(
                editingAgent
                    ? {
                        fullName: editingAgent.fullName || '',
                        email: editingAgent.email || '',
                        phone: editingAgent.phone || '',
                        password: '',
                        role: editingAgent.role || 'support_agent',
                    }
                    : {
                        fullName: '',
                        email: '',
                        phone: '',
                        password: '',
                        role: 'support_agent',
                    }
            );
            setAvatarPreview(editingAgent?.profile ?? null);
        }
    }, [open, editingAgent, form]);

    const handleClose = () => {
        form.resetFields();
        setAvatarPreview(null);
        onClose();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        }
    };

    const handleFinish = async (values: AgentFormValues) => {
        await onSubmit(values, avatarPreview);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={500}
            styles={{
                content: {
                    background: '#46000B',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 24,
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                    background: 'rgba(0,0,0,0.55)',
                },
            }}
        >
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: '#560e18',
                        colorText: '#ffffff',
                        colorTextPlaceholder: '#b7868b',
                        colorBorder: 'transparent',
                        borderRadius: 10,
                    },
                    components: {
                        Input: {
                            colorBgContainer: '#560e18',
                            colorText: '#ffffff',
                            colorTextPlaceholder: '#b7868b',
                        },
                        Select: {
                            colorBgContainer: '#560e18',
                            colorText: '#ffffff',
                            colorTextPlaceholder: '#b7868b',
                            optionSelectedBg: 'rgba(255, 75, 114, 0.2)',
                            colorBgElevated: '#46000B',
                            controlHeight: 48,
                        },
                    },
                }}
            >
                <div className="flex flex-col gap-5">
                    <ModalHeader
                        title={editingAgent ? 'Edit Support Member' : 'Add New Support Member'}
                        onClose={handleClose}
                    />

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-20 h-20">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff4b72]/30 bg-[#560e18] flex items-center justify-center">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-3xl font-bold">
                                        {editingAgent?.fullName?.charAt(0) ?? '?'}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-0 outline-none"
                                style={{ background: '#ff2150' }}
                            >
                                <FiCamera size={12} color="#fff" />
                            </button>
                        </div>
                        <span className="text-white/40 text-xs">Upload profile photo</span>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    {/* Form */}
                    <Form form={form} layout="vertical" onFinish={handleFinish} className="flex flex-col gap-1">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                name="fullName"
                                label={fieldLabel('Full Name')}
                                placeholder="Enter your full name"
                                rules={[{ required: true, message: 'Please enter full name!' }]}
                            />
                            <FormInput
                                name="email"
                                label={fieldLabel('Email')}
                                placeholder="Enter your email address"
                                rules={[{ required: true, message: 'Please enter email!' }, { type: 'email', message: 'Invalid email' }]}
                                type="email"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                name="phone"
                                label={fieldLabel('Phone Number')}
                                placeholder="Enter your phone number"
                                rules={[{ required: true, message: 'Please enter phone number!' }]}
                            />
                            <FormInput
                                name="password"
                                label={fieldLabel('Password')}
                                placeholder="At least 8 characters"
                                rules={editingAgent ? [] : [{ required: true, message: 'Please enter password!' }]}
                                type="password"
                            />
                        </div>

                        {/* Modern Role Select */}
                        <Form.Item
                            name="role"
                            label={fieldLabel('Role')}
                            rules={[{ required: true, message: 'Please select a role!' }]}
                        >
                            <Select
                                className="w-full h-12"
                                suffixIcon={<FiChevronDown className="text-white/60" size={16} />}
                                popupMatchSelectWidth={false}
                                dropdownStyle={{
                                    background: 'linear-gradient(135deg, #46000B, #2d0007)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: 12,
                                    padding: '6px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                <Select.Option value="support_manager">
                                    <div className="flex items-center gap-2.5 py-1">
                                        <div className="w-7 h-7 rounded-lg bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center shrink-0">
                                            <FiShield className="text-[#ff4b72]" size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white text-xs sm:text-sm">Support Manager</span>
                                        </div>
                                    </div>
                                </Select.Option>

                                <Select.Option value="support_agent">
                                    <div className="flex items-center gap-2.5 py-1">
                                        <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/30 flex items-center justify-center shrink-0">
                                            <FiUserCheck className="text-[#38bdf8]" size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white text-xs sm:text-sm">Support Agent</span>
                                        </div>
                                    </div>
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: '#7a0015' }}
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                    {getLoadingText(editingAgent ? 'Update Member' : 'Create Member')}
                                </>
                            ) : (
                                editingAgent ? 'Update Member' : 'Create Member'
                            )}
                        </button>
                    </Form>
                </div>
            </ConfigProvider>
        </Modal>
    );
};

export default SupportAgentModal;
