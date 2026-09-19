import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, ConfigProvider } from 'antd';
import { FiUploadCloud, FiX, FiBox, FiDollarSign, FiTag, FiTruck } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalHeader from './ModalHeader';
import { useGetSingleProductQuery, useUpdateProductMutation } from '../../features/shop/productApi';
import { useGetAllCategoryQuery } from '../../features/category/categoryApi';
import LoadingSpinner from './LoadingSpinner';
import { baseURL } from '../../utils/BaseURL';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Option } = Select;

interface EditProductModalProps {
    open: boolean;
    productId: string | null;
    onClose: () => void;
}

export const EditProductModal = ({ open, productId, onClose }: EditProductModalProps) => {
    const [form] = Form.useForm();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // 1. Fetch single product data
    const { data: singleProductResponse, isLoading: isProductLoading } = useGetSingleProductQuery(
        productId || '',
        { skip: !open || !productId }
    );
    const prod = singleProductResponse?.data;

    // 2. Fetch categories
    const { data: categoryResponse, isLoading: isCategoryLoading } = useGetAllCategoryQuery({ limit: 100 });
    const categories = categoryResponse?.data || [];

    // 3. Update Product Mutation
    const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();

    useEffect(() => {
        if (open && prod) {
            // Find category id if categoryName is present
            const matchedCategory = categories.find(
                (c) => c.name?.toLowerCase() === prod.categoryName?.toLowerCase()
            );

            form.setFieldsValue({
                name: prod.name,
                description: prod.description || '',
                categoryId: matchedCategory?._id || categories[0]?._id,
                type: prod.type || 'other',
                price: prod.price ?? 0,
                discount: prod.discount ?? 0,
                stock: prod.availableStock ?? prod.stock ?? 0,
                deliveryTime: prod.deliveryTime || '3 days',
                weight: prod.weight ?? 0,
                length: prod.length ?? 0,
                width: prod.width ?? 0,
                height: prod.height ?? 0,
                isAvailableForSale: prod.isAvailableForSale ?? true,
                isGiftWrappingFree: prod.isGiftWrappingFree ?? false,
            });
        }
    }, [open, prod, categories, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const handleRemoveNewFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleClose = () => {
        form.resetFields();
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviewUrls([]);
        onClose();
    };

    const handleSubmit = async (values: any) => {
        if (!productId) return;

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            if (values.categoryId) {
                formData.append('categoryId', values.categoryId);
            }
            formData.append('price', String(values.price));
            formData.append('discount', String(values.discount || 0));
            formData.append('stock', String(values.stock || 0));
            formData.append('deliveryTime', values.deliveryTime || '3 days');
            formData.append('type', values.type || 'other');
            formData.append('weight', String(values.weight || 0));
            formData.append('length', String(values.length || 0));
            formData.append('height', String(values.height || 0));
            formData.append('width', String(values.width || 0));
            formData.append('isAvailableForSale', String(!!values.isAvailableForSale));
            formData.append('isGiftWrappingFree', String(!!values.isGiftWrappingFree));

            // Append new images if selected
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            const res = await updateProduct({ productId, data: formData }).unwrap();
            toast.success(res?.message || 'Product updated successfully!');
            handleClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to update product');
        }
    };

    const existingImages = prod?.images || [];

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={720}
            styles={{
                content: {
                    background: '#46000B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    padding: 24,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                    background: 'rgba(0,0,0,0.6)',
                },
            }}
        >
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#ff2150',
                        colorBgContainer: '#560e18',
                        colorBgElevated: '#46000B',
                        colorText: '#ffffff',
                        colorTextPlaceholder: 'rgba(255, 255, 255, 0.4)',
                        colorBorder: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 10,
                    },
                    components: {
                        Switch: {
                            colorPrimary: '#ff2150',
                            colorPrimaryHover: '#ff4b72',
                        },
                        Input: {
                            colorBgContainer: '#560e18',
                            colorText: '#ffffff',
                            colorTextPlaceholder: 'rgba(255, 255, 255, 0.4)',
                            activeBorderColor: '#ff4b72',
                            hoverBorderColor: '#ff4b72',
                        },
                        InputNumber: {
                            colorBgContainer: '#560e18',
                            colorText: '#ffffff',
                            colorTextPlaceholder: 'rgba(255, 255, 255, 0.4)',
                            activeBorderColor: '#ff4b72',
                            hoverBorderColor: '#ff4b72',
                        },
                        Select: {
                            colorBgContainer: '#560e18',
                            colorBgElevated: '#46000B',
                            colorText: '#ffffff',
                            colorTextPlaceholder: 'rgba(255, 255, 255, 0.4)',
                            colorBorder: 'rgba(255, 255, 255, 0.1)',
                            colorPrimary: '#ff4b72',
                            colorPrimaryHover: '#ff4b72',
                            selectorBg: '#560e18',
                            optionSelectedBg: '#ff2150',
                            optionActiveBg: 'rgba(255, 255, 255, 0.08)',
                        },
                        Form: {
                            labelColor: '#ffffff',
                        },
                    },
                }}
            >
                <div className="flex flex-col gap-5">
                    <ModalHeader title="Edit Product" onClose={handleClose} />

                    {isProductLoading ? (
                        <LoadingSpinner text="Loading product details..." />
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {/* Section 1: Basic Information */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-[#ff4b72] m-0 flex items-center gap-1.5">
                                    <FiBox size={14} /> Basic Information
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Form.Item
                                        name="name"
                                        label={<span className="text-white text-xs font-medium">Product Name</span>}
                                        rules={[{ required: true, message: 'Please enter product name!' }]}
                                        className="m-0"
                                    >
                                        <Input placeholder="e.g. Wedding Flowers" className="h-10" />
                                    </Form.Item>

                                    <Form.Item
                                        name="categoryId"
                                        label={<span className="text-white text-xs font-medium">Category</span>}
                                        className="m-0"
                                    >
                                        <Select
                                            placeholder={isCategoryLoading ? 'Loading categories...' : 'Select category'}
                                            loading={isCategoryLoading}
                                            className="h-10"
                                            popupClassName="dark-select-dropdown"
                                        >
                                            {categories.map((cat) => (
                                                <Option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Form.Item
                                        name="type"
                                        label={<span className="text-white text-xs font-medium">Product Type</span>}
                                        className="m-0"
                                    >
                                        <Select className="h-10" popupClassName="dark-select-dropdown">
                                            <Option value="other">Other</Option>
                                            <Option value="flower">Flower</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="deliveryTime"
                                        label={<span className="text-white text-xs font-medium">Delivery Time</span>}
                                        className="m-0"
                                    >
                                        <Input placeholder="e.g. 3 days" className="h-10" prefix={<FiTruck className="text-white/40" />} />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="description"
                                    label={<span className="text-white text-xs font-medium">Description</span>}
                                    rules={[{ required: true, message: 'Please enter product description!' }]}
                                    className="m-0"
                                >
                                    <TextArea rows={3} placeholder="Provide details about the product..." />
                                </Form.Item>
                            </div>

                            {/* Section 2: Pricing & Inventory */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-[#ff4b72] m-0 flex items-center gap-1.5">
                                    <FiDollarSign size={14} /> Pricing & Inventory
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Form.Item
                                        name="price"
                                        label={<span className="text-white text-xs font-medium">Price ($)</span>}
                                        rules={[{ required: true, message: 'Enter price!' }]}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="0.00" />
                                    </Form.Item>

                                    <Form.Item
                                        name="discount"
                                        label={<span className="text-white text-xs font-medium">Discount (%)</span>}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} max={100} className="w-full h-10" placeholder="0" />
                                    </Form.Item>

                                    <Form.Item
                                        name="stock"
                                        label={<span className="text-white text-xs font-medium">Available Stock</span>}
                                        rules={[{ required: true, message: 'Enter stock!' }]}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="Stock qty" />
                                    </Form.Item>
                                </div>
                            </div>

                            {/* Section 3: Dimensions & Options */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-[#ff4b72] m-0 flex items-center gap-1.5">
                                    <FiTag size={14} /> Dimensions & Options
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Form.Item
                                        name="weight"
                                        label={<span className="text-white text-xs font-medium">Weight</span>}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="Weight" />
                                    </Form.Item>

                                    <Form.Item
                                        name="length"
                                        label={<span className="text-white text-xs font-medium">Length</span>}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="Length" />
                                    </Form.Item>

                                    <Form.Item
                                        name="width"
                                        label={<span className="text-white text-xs font-medium">Width</span>}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="Width" />
                                    </Form.Item>

                                    <Form.Item
                                        name="height"
                                        label={<span className="text-white text-xs font-medium">Height</span>}
                                        className="m-0"
                                    >
                                        <InputNumber min={0} className="w-full h-10" placeholder="Height" />
                                    </Form.Item>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                                        <div className="flex flex-col pr-2">
                                            <span className="text-white text-xs font-semibold">Available for Sale</span>
                                            <span className="text-white/40 text-[11px] mt-0.5">Enable product for purchase</span>
                                        </div>
                                        <Form.Item name="isAvailableForSale" valuePropName="checked" className="m-0">
                                            <Switch />
                                        </Form.Item>
                                    </div>

                                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                                        <div className="flex flex-col pr-2">
                                            <span className="text-white text-xs font-semibold">Free Gift Wrapping</span>
                                            <span className="text-white/40 text-[11px] mt-0.5">Offer free wrapping service</span>
                                        </div>
                                        <Form.Item name="isGiftWrappingFree" valuePropName="checked" className="m-0">
                                            <Switch />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Images */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-[#ff4b72] m-0 flex items-center gap-1.5">
                                        <FiUploadCloud size={14} /> Product Images
                                    </h4>
                                    <span className="text-white/40 text-[11px]">
                                        {existingImages.length + previewUrls.length} total images
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Existing Images */}
                                    {existingImages.map((img, idx) => {
                                        const url = img.startsWith('http')
                                            ? img
                                            : `${baseURL}/${img.replace(/\\/g, '/')}`;
                                        return (
                                            <div
                                                key={`exist-${idx}`}
                                                className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 bg-black/30 shadow-md shrink-0"
                                            >
                                                <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                                <span className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[8px] text-white/80 uppercase font-semibold">
                                                    Current
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Newly Added Previews */}
                                    {previewUrls.map((url, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#ff4b72]/40 bg-black/30 shadow-md shrink-0 group"
                                        >
                                            <img src={url} alt={`New Preview ${idx}`} className="w-full h-full object-cover" />
                                            <span className="absolute top-1 left-1 px-1 rounded bg-[#ff2150] text-[8px] text-white font-semibold">
                                                New
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewFile(idx)}
                                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all cursor-pointer border-0 shadow-md"
                                                title="Remove image"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* "Add More" Upload Card */}
                                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#ff4b72]/60 hover:border-[#ff4b72] bg-[#ff4b72]/10 hover:bg-[#ff4b72]/20 flex flex-col items-center justify-center cursor-pointer transition-all group select-none shrink-0">
                                        <AiOutlinePlus size={20} className="text-[#ff4b72] group-hover:scale-110 transition-transform" />
                                        <span className="text-[#ff4b72] text-[11px] font-semibold mt-1">Add More</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-11 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ background: '#ff2150' }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                            <span>Updating Product...</span>
                                        </>
                                    ) : (
                                        <span>Update Product</span>
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
                    )}
                </div>
            </ConfigProvider>
        </Modal>
    );
};

export default EditProductModal;
