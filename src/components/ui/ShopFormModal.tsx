import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { FiShoppingBag, FiUploadCloud, FiFileText, FiGlobe, FiPhone, FiClock, FiCheck } from 'react-icons/fi';
import ModalHeader from './ModalHeader';
import GoogleMapLocationPicker from './GoogleMapLocationPicker';
import { ShopInfo } from '../../features/profile/profileApi';
import { useCreateShopMutation, useUpdateShopMutation } from '../../features/shop/shopApi';
import { baseURL } from '../../utils/BaseURL';

interface ShopFormModalProps {
    open: boolean;
    initialData?: ShopInfo | null;
    onClose: () => void;
    onSuccess: (msg: string) => void;
}

export const ShopFormModal = ({
    open,
    initialData,
    onClose,
    onSuccess,
}: ShopFormModalProps) => {
    const isEdit = Boolean(initialData && initialData._id);

    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const [latitude, setLatitude] = useState('23.7461');
    const [longitude, setLongitude] = useState('90.3742');

    const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');

    const [createShop, { isLoading: isCreating }] = useCreateShopMutation();
    const [updateShop, { isLoading: isUpdating }] = useUpdateShopMutation();
    const isLoading = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setBusinessName(initialData.businessName || '');
            setDescription(initialData.description || '');
            setWebsite(initialData.website || '');
            setPhone(initialData.phone || '');
            setAddress(initialData.address || '');
            setWorkingHours(initialData.workingHours || '');
            setLatitude(initialData.latitude ? String(initialData.latitude) : '23.7461');
            setLongitude(initialData.longitude ? String(initialData.longitude) : '90.3742');
            if (initialData.image) {
                const img = initialData.image.startsWith('http')
                    ? initialData.image
                    : `${baseURL}/${initialData.image.replace(/\\/g, '/')}`;
                setImagePreview(img);
            } else {
                setImagePreview('');
            }
        } else {
            setName('');
            setBusinessName('');
            setDescription('');
            setWebsite('');
            setPhone('');
            setAddress('');
            setWorkingHours('');
            setLatitude('23.7461');
            setLongitude('90.3742');
            setTradeLicenseFile(null);
            setImageFile(null);
            setImagePreview('');
        }
        setErrorMessage('');
    }, [initialData, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTradeLicenseFile(file);
        }
    };

    const handleLocationChange = (newLat: string, newLng: string, newAddress?: string) => {
        setLatitude(newLat);
        setLongitude(newLng);
        if (newAddress) {
            setAddress(newAddress);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!name.trim()) {
            setErrorMessage('Shop Name is required');
            return;
        }
        if (!businessName.trim()) {
            setErrorMessage('Business Name is required');
            return;
        }
        if (!address.trim()) {
            setErrorMessage('Address is required');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('businessName', businessName);
        if (description) formData.append('description', description);
        if (website) formData.append('website', website);
        if (phone) formData.append('phone', phone);
        formData.append('address', address);
        if (workingHours) formData.append('workingHours', workingHours);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        if (tradeLicenseFile) {
            formData.append('tradeLicense', tradeLicenseFile);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (isEdit && initialData?._id) {
                const res = await updateShop({ shopId: initialData._id, data: formData }).unwrap();
                onSuccess(res?.message || 'Shop updated successfully!');
            } else {
                const res = await createShop(formData).unwrap();
                onSuccess(res?.message || 'Shop created successfully!');
            }
            onClose();
        } catch (err: any) {
            console.error('Failed to save shop:', err);
            setErrorMessage(err?.data?.message || err?.message || 'Failed to save shop details. Please try again.');
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={680}
            className="custom-modal"
            styles={{
                content: {
                    background: '#2A0007',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                },
            }}
        >
            <ModalHeader
                title={isEdit ? 'Edit Shop Details' : 'Create Your Shop'}
                subtitle={isEdit ? 'Update your store business details and information' : 'Fill in the information below to set up your store'}
                onClose={onClose}
            />

            {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-2 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Logo / Image Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Shop Preview" className="w-full h-full object-cover" />
                        ) : (
                            <FiShoppingBag size={28} className="text-white/40" />
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <label className="text-xs font-semibold text-white/80 block mb-1">
                            Shop Image / Logo
                        </label>
                        <p className="text-[11px] text-white/40 mb-2">JPG, PNG or WEBP up to 5MB</p>
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer transition-colors border border-white/10">
                            <FiUploadCloud size={14} />
                            <span>{imageFile ? imageFile.name : 'Choose File'}</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Shop Name */}
                    <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                            Shop Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Fresh Mart"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72]"
                        />
                    </div>

                    {/* Business Name */}
                    <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                            Business Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Fresh Mart Trading LLC"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                            className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Website */}
                    <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                            <FiGlobe size={13} className="text-white/60" />
                            <span>Website URL</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://freshmart.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72]"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                            <FiPhone size={13} className="text-white/60" />
                            <span>Phone Number</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 021548654"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72]"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="A short description of your store and services offered..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72] resize-none"
                    />
                </div>

                {/* Physical Address & Google Map Location */}
                <GoogleMapLocationPicker
                    address={address}
                    setAddress={setAddress}
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={handleLocationChange}
                />

                {/* Working Hours */}
                <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                        <FiClock size={13} className="text-white/60" />
                        <span>Working Hours</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 9am - 10pm"
                        value={workingHours}
                        onChange={(e) => setWorkingHours(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72]"
                    />
                </div>

                {/* Trade License Upload */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <label className="block text-xs font-semibold text-white/80 mb-1 flex items-center gap-1.5">
                        <FiFileText size={14} className="text-white/70" />
                        <span>Trade License (PDF / Image)</span>
                    </label>
                    <p className="text-[11px] text-white/40 mb-3">Upload official trade license document for store verification</p>
                    <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer transition-colors border border-white/10">
                            <FiUploadCloud size={16} />
                            <span>{tradeLicenseFile ? tradeLicenseFile.name : 'Upload License File'}</span>
                            <input
                                type="file"
                                accept=".pdf,image/*"
                                onChange={handleLicenseChange}
                                className="hidden"
                            />
                        </label>
                        {tradeLicenseFile && (
                            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                <FiCheck size={14} /> Ready to upload
                            </span>
                        )}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="h-10 px-5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors border border-white/10 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-6 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #46000B, #6B000F)' }}
                    >
                        {isLoading ? 'Saving...' : isEdit ? 'Update Shop' : 'Create Shop'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ShopFormModal;
