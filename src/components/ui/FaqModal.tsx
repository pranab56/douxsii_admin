import { useEffect } from 'react';
import { Modal, Form, ConfigProvider } from 'antd';
import { FaqItem } from '../../pages/faqs/faqs.types';
import ModalHeader from './ModalHeader';
import { FormInput } from './FormInput';

import { getLoadingText } from '../../utils/loadingText';

interface FaqModalProps {
    open: boolean;
    editingFaq: FaqItem | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: { question: string; answer: string }) => void;
}

export const FaqModal = ({ open, editingFaq, isSubmitting = false, onClose, onSubmit }: FaqModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.setFieldsValue(
                editingFaq
                    ? { question: editingFaq.question, answer: editingFaq.answer }
                    : { question: '', answer: '' }
            );
        }
    }, [open, editingFaq, form]);

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={520}
            styles={{
                content: {
                    background: '#46000B',
                    border: '1px solid rgba(255,255,255,0.05)',
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
                            activeBorderColor: '#b02636',
                            hoverBorderColor: '#7a101b',
                            colorBgContainer: '#560e18',
                            colorText: '#ffffff',
                            colorTextPlaceholder: '#b7868b',
                        },
                        Form: {
                            labelColor: '#ffffff',
                        },
                    },
                }}
            >
                <div className="flex flex-col gap-6">
                    <ModalHeader
                        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
                        onClose={handleClose}
                    />

                    <Form form={form} layout="vertical" onFinish={onSubmit} className="flex flex-col gap-4">
                        <FormInput
                            name="question"
                            label={<span className="text-white text-sm font-medium">Question</span>}
                            placeholder="e.g. How old are you?"
                            rules={[{ required: true, message: 'Please enter the question!' }]}
                        />
                        <FormInput
                            name="answer"
                            label={<span className="text-white text-sm font-medium">Answer</span>}
                            placeholder="e.g. 22 years old, and you?"
                            rules={[{ required: true, message: 'Please enter the answer!' }]}
                        />
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 h-11 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: '#ff2150' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                        {getLoadingText(editingFaq ? 'Update' : 'Save')}
                                    </>
                                ) : (
                                    editingFaq ? 'Update' : 'Save'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 h-11 rounded-xl text-white font-semibold transition-all hover:bg-white/5 active:scale-95 cursor-pointer border border-white/10 bg-transparent outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                </div>
            </ConfigProvider>
        </Modal>
    );
};

export default FaqModal;
