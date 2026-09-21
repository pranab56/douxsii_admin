import { useEffect } from 'react';
import { Modal, Form, Select, ConfigProvider } from 'antd';
import { FiChevronDown } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import { FormInput } from './FormInput';
import { getLoadingText } from '../../utils/loadingText';
import { CategoryItem } from '../../features/category/categoryApi';

interface CategoryModalProps {
    open: boolean;
    editingCategory: CategoryItem | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: { name: string; type: string }) => void;
}

export const CategoryModal = ({
    open,
    editingCategory,
    isSubmitting = false,
    onClose,
    onSubmit
}: CategoryModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.setFieldsValue(
                editingCategory
                    ? {
                        name: editingCategory.name,
                        type: editingCategory.type || 'flower'
                    }
                    : {
                        name: '',
                        type: 'flower'
                    }
            );
        }
    }, [open, editingCategory, form]);

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
            width={480}
            styles={{
                content: {
                    background: '#46000B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
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
                        Select: {
                            colorBgContainer: '#560e18',
                            colorBgElevated: '#46000B',
                            colorText: '#ffffff',
                            colorTextPlaceholder: '#b7868b',
                            colorBorder: '#7a101b',
                            colorPrimaryHover: '#b02636',
                            colorPrimary: '#b02636',
                            selectorBg: '#560e18',
                            optionSelectedBg: 'rgba(255, 75, 114, 0.2)',
                        },
                        Form: {
                            labelColor: '#ffffff',
                        },
                    },
                }}
            >
                <div className="flex flex-col gap-6">
                    <ModalHeader
                        title={editingCategory ? 'Edit Category' : 'Add New Category'}
                        onClose={handleClose}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onSubmit}
                        className="flex flex-col gap-4"
                    >
                        <FormInput
                            name="name"
                            label={<span className="text-white text-sm font-medium">Category Name</span>}
                            placeholder="e.g. Tulips, Roses, Lilies..."
                            rules={[{ required: true, message: 'Please enter category name!' }]}
                        />

                        <Form.Item
                            name="type"
                            label={<span className="text-white text-sm font-medium">Category Type</span>}
                            rules={[{ required: true, message: 'Please select category type!' }]}
                            initialValue="flower"
                        >
                            <Select
                                className="w-full h-11"
                                placeholder="Select category type"
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
                                <Select.Option value="flower">
                                    <div className="flex items-center gap-2 py-0.5">
                                        <span className="text-base">🌸</span>
                                        <span className="font-medium text-white">Flower</span>
                                    </div>
                                </Select.Option>
                                <Select.Option value="other">
                                    <div className="flex items-center gap-2 py-0.5">
                                        <span className="text-base">📦</span>
                                        <span className="font-medium text-white">Other</span>
                                    </div>
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <div className="flex items-center gap-3 pt-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 h-11 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: '#ff2150' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                        {getLoadingText(editingCategory ? 'Update' : 'Save')}
                                    </>
                                ) : (
                                    editingCategory ? 'Update Category' : 'Save Category'
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

export default CategoryModal;
