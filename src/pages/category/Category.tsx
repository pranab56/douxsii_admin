import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BiCategory } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CategoryModal from '../../components/ui/CategoryModal';
import {
    useGetAllCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    CategoryItem
} from '../../features/category/categoryApi';
import { baseURL } from '../../utils/BaseURL';

const Category = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    // Modal States
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // RTK Query Hooks
    const { data: categoryResponse, isLoading, isFetching } = useGetAllCategoryQuery({
        page,
        searchTerm: search
    });
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const categoryList: CategoryItem[] = categoryResponse?.data || [];
    const meta = categoryResponse?.meta;
    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? categoryList.length;

    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanPath = url.replace(/\\/g, '/');
        return `${baseURL}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (item: CategoryItem) => {
        setEditingCategory(item);
        setModalOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;

        try {
            const res = await deleteCategory(deletingId).unwrap();
            toast.success(res?.message || 'Category deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to delete category');
        } finally {
            setConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            if (editingCategory) {
                const res = await updateCategory({
                    id: editingCategory._id,
                    data: { name: values.name }
                }).unwrap();
                toast.success(res?.message || 'Category updated successfully');
            } else {
                const res = await createCategory({
                    name: values.name
                }).unwrap();
                toast.success(res?.message || 'Category created successfully');
            }
            setModalOpen(false);
            setEditingCategory(null);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to save category');
        }
    };

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader
                title="Category Management"
                subtitle="Organize and manage product categories in card layout"
                extra={
                    <button
                        onClick={handleAdd}
                        className="h-11 px-5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                        style={{ background: '#ff2150' }}
                    >
                        <AiOutlinePlus size={16} />
                        Add Category
                    </button>
                }
            />

            {/* Top Bar: Search & Category Stats Counter */}
            <div
                className="p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <Search
                    value={search}
                    onChange={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}
                    placeholder="Search category by name..."
                />

                <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <span>Total Categories:</span>
                    <span className="px-3 py-1 rounded-full bg-[#ff4b72]/15 text-[#ff4b72] font-bold text-xs border border-[#ff4b72]/20">
                        {isLoading ? '...' : totalItems}
                    </span>
                </div>
            </div>

            {/* Category Cards Section */}
            {isLoading ? (
                <div
                    className="p-12 rounded-2xl flex items-center justify-center"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <LoadingSpinner text="Loading categories..." />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {/* Create Category Card Button */}


                        {/* Category Items List */}
                        {categoryList.map((item) => {
                            const imageUrl = getImageUrl(item.image);
                            return (
                                <div
                                    key={item._id}
                                    className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-[#ff4b72]/40 group min-h-[150px] relative overflow-hidden"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.name}
                                                    className="w-11 h-11 rounded-xl object-cover border border-white/10 bg-white/5 shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-xl bg-[#ff4b72]/15 border border-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] shrink-0 group-hover:bg-[#ff4b72]/25 transition-colors">
                                                    <BiCategory size={22} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#ff4b72]/20 text-white/70 hover:text-[#ff4b72] transition-all flex items-center justify-center border-0 cursor-pointer outline-none"
                                                title="Edit Category"
                                            >
                                                <FiEdit2 size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRequest(item._id)}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all flex items-center justify-center border-0 cursor-pointer outline-none"
                                                title="Delete Category"
                                            >
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-white text-base font-bold m-0 group-hover:text-[#ff4b72] transition-colors truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-white/40 text-[11px] font-mono m-0 mt-1 truncate">
                                            ID: #{item._id ? item._id.slice(-6) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {categoryList.length === 0 && (
                        <div className="py-16 text-center text-white/50 text-base">
                            No categories found matching your search.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalItems > pageSize && (
                <div
                    className="p-4 rounded-2xl flex justify-center"
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(p) => setPage(p)}
                    />
                </div>
            )}

            {/* Create / Edit Modal */}
            <CategoryModal
                open={modalOpen}
                editingCategory={editingCategory}
                isSubmitting={isCreating || isUpdating}
                onClose={() => {
                    setModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmit}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={confirmOpen}
                title="Delete Category"
                subtitle="Are you sure you want to delete this category? This action cannot be undone."
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                onClose={() => {
                    setConfirmOpen(false);
                    setDeletingId(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default Category;
