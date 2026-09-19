import { useState } from 'react';
import { FiEye, FiTrash2, FiBox, FiEdit2 } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import ProductDetailsModal from '../../components/ui/ProductDetailsModal';
import CreateProductModal from '../../components/ui/CreateProductModal';
import EditProductModal from '../../components/ui/EditProductModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllProductQuery, useDeleteProductMutation, ProductItem } from '../../features/shop/productApi';
import { baseURL } from '../../utils/BaseURL';

const Products = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Modals State
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllProductQuery();

    // Filtered Query for Table Data & Search
    const { data: productsResponse, isLoading } = useGetAllProductQuery({
        page,
        searchTerm: search,
    });

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const allProductsList: ProductItem[] = statsResponse?.data || [];
    const productsList: ProductItem[] = productsResponse?.data || [];
    const meta = productsResponse?.meta;

    // Fixed Stats Card Computation
    const totalProducts = statsResponse?.meta?.total ?? allProductsList.length;
    const flowerProducts = allProductsList.filter(p => p.type?.toLowerCase() === 'flower').length;
    const otherProducts = allProductsList.filter(p => p.type?.toLowerCase() !== 'flower').length;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? productsList.length;

    const handleOpenDetails = (productId: string) => {
        setSelectedProductId(productId);
        setDetailsOpen(true);
    };

    const handleOpenEdit = (productId: string) => {
        setEditingProductId(productId);
        setEditModalOpen(true);
    };

    const handleDeleteRequest = (productId: string) => {
        setDeletingId(productId);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            const res = await deleteProduct(deletingId).unwrap();
            toast.success(res?.message || 'Product deleted successfully!');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to delete product');
        } finally {
            setConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const stats = [
        {
            label: 'Total Products',
            value: isStatsLoading ? '...' : totalProducts.toLocaleString(),
            iconBg: '#46000B',
        },
        {
            label: 'Flower Products',
            value: isStatsLoading ? '...' : flowerProducts.toLocaleString(),
            iconBg: '#46000B',
        },
        {
            label: 'Other Products',
            value: isStatsLoading ? '...' : otherProducts.toLocaleString(),
            iconBg: '#46000B',
        }
    ];

    const columns = [
        {
            title: 'Product',
            key: 'name',
            render: (record: ProductItem) => {
                const mainImage = record.images?.[0];
                const imageUrl = mainImage
                    ? (mainImage.startsWith('http') ? mainImage : `${baseURL}/${mainImage.replace(/\\/g, '/')}`)
                    : null;

                return (
                    <div
                        className="flex items-center gap-3 cursor-pointer select-none group"
                        onClick={() => handleOpenDetails(record._id)}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={record.name}
                                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/vite.svg';
                                }}
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] font-bold shrink-0 text-xs border border-white/10">
                                <FiBox size={18} />
                            </div>
                        )}
                        <div className="max-w-[220px]">
                            <span className="text-white text-sm font-semibold group-hover:text-[#ff4b72] transition-colors block line-clamp-1">
                                {record.name}
                            </span>
                            <span className="text-white/40 text-[11px] block mt-0.5 uppercase tracking-wider">
                                {record.type || 'other'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Shop / Store',
            key: 'shop',
            render: (record: ProductItem) => (
                <span className="text-white text-sm font-medium">
                    {record.shopId?.name || 'Store Product'}
                </span>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (val: number, record: ProductItem) => (
                <div className="flex items-center gap-2">
                    <span className="text-[#ff4b72] text-sm font-bold font-sans">
                        ${val ?? 0}
                    </span>
                    {record.discount ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-500/15 text-[#10b981] border border-green-500/20">
                            -{record.discount}%
                        </span>
                    ) : null}
                </div>
            )
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (val?: number) => (
                <span className="text-amber-400 text-sm font-medium">
                    ★ {val ? val.toFixed(1) : '0.0'}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: ProductItem) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenDetails(record._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[#ff4b72]/20 text-[#ff4b72] transition-colors border border-white/10 cursor-pointer"
                        title="View Details"
                    >
                        <FiEye size={16} />
                    </button>
                    <button
                        onClick={() => handleOpenEdit(record._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-[#38bdf8] transition-colors border border-white/10 cursor-pointer"
                        title="Edit / Update Product"
                    >
                        <FiEdit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteRequest(record._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors border border-white/10 cursor-pointer"
                        title="Delete Product"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader
                title="Product Management"
                subtitle="Manage all products from all vendors and store catalogue"
                extra={
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 shadow-sm"
                        style={{ background: '#ff2150' }}
                    >
                        <AiOutlinePlus size={16} />
                        <span>Add Product</span>
                    </button>
                }
            />

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <span className="text-white/60 text-sm font-medium">{stat.label}</span>
                        <h2 className="text-white text-4xl font-bold mt-2 font-sans">{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Content Table Area */}
            <div
                className="p-6 rounded-2xl flex flex-col gap-6"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <Search
                        value={search}
                        onChange={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        placeholder="Search products by name..."
                    />
                </div>

                <div className="overflow-x-auto relative">
                    {isLoading ? (
                        <LoadingSpinner text="Loading products..." />
                    ) : productsList.length === 0 ? (
                        <div className="py-16 text-center text-white/50 text-base">
                            No products found.
                        </div>
                    ) : (
                        <Table
                            dataSource={productsList}
                            columns={columns}
                            rowKey="_id"
                        />
                    )}
                </div>

                {totalItems > pageSize && (
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(p) => setPage(p)}
                    />
                )}
            </div>

            {/* Create Product Modal */}
            <CreateProductModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />

            {/* Edit / Update Product Modal */}
            <EditProductModal
                open={editModalOpen}
                productId={editingProductId}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingProductId(null);
                }}
            />

            {/* Details Modal */}
            <ProductDetailsModal
                open={detailsOpen}
                productId={selectedProductId}
                onClose={() => setDetailsOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={confirmOpen}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                type="danger"
                isLoading={isDeleting}
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    if (!isDeleting) {
                        setConfirmOpen(false);
                        setDeletingId(null);
                    }
                }}
            />
        </div>
    );
};

export default Products;
