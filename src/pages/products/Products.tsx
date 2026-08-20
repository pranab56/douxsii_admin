import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import ProductDetailsModal from '../../components/ui/ProductDetailsModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetAllProductQuery } from '../../features/products/productsApi';
import { ProductRow } from './products.types';
import { baseURL } from '../../utils/BaseURL';

const Products = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Modals State
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Unfiltered Query for fixed Stats Cards
    const { data: statsResponse, isLoading: isStatsLoading } = useGetAllProductQuery();

    // Filtered Query for Table Data & Search
    const { data: productsResponse, isLoading, isFetching } = useGetAllProductQuery({
        page,
        searchTerm: search,
    });

    const allProductsList: ProductRow[] = (statsResponse?.data as any) || [];
    const productsList: ProductRow[] = (productsResponse?.data as any) || [];
    const meta = productsResponse?.meta;

    // Fixed Stats Card Computation
    const totalProducts = statsResponse?.meta?.total ?? allProductsList.length;
    const flowerProducts = allProductsList.filter(p => p.type === 'flower').length;
    const otherProducts = allProductsList.filter(p => p.type === 'other').length;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? productsList.length;

    const handleOpenDetails = (productId: string) => {
        setSelectedProductId(productId);
        setDetailsOpen(true);
    };

    const stats = [
        { label: 'Total Products', value: totalProducts },
        { label: 'Flower Products', value: flowerProducts },
        { label: 'Other Products', value: otherProducts }
    ];

    const columns = [
        {
            title: 'Product Name',
            key: 'name',
            render: (record: ProductRow) => {
                const mainImage = record.images?.[0];
                const imageUrl = mainImage 
                    ? (mainImage.startsWith('http') ? mainImage : `${baseURL}/${mainImage.replace(/\\/g, '/')}`)
                    : null;

                return (
                    <div 
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => handleOpenDetails(record._id)}
                    >
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={record.name} 
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#ff4b72]/20 flex items-center justify-center text-[#ff4b72] font-bold shrink-0 text-xs border border-white/10">
                                P
                            </div>
                        )}
                        <div>
                            <span className="text-white text-sm font-semibold hover:text-[#ff4b72] transition-colors block line-clamp-1">
                                {record.name}
                            </span>
                            <span className="text-white/40 text-[10px] block mt-0.5 uppercase tracking-wider">
                                Type: {record.type || 'other'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (val?: string) => (
                <span className="bg-white/[0.05] border border-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase inline-block">
                    {val || 'General'}
                </span>
            )
        },
        {
            title: 'Shop / Vendor',
            key: 'shop',
            render: (record: ProductRow) => (
                <span className="text-white text-sm font-medium">
                    {record.shopId?.name || 'N/A'}
                </span>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (val: number) => (
                <span className="text-white text-sm font-bold font-sans text-[#ff4b72]">
                    ${val ?? 0}
                </span>
            )
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (val: number) => <span className="text-white text-sm font-medium">{val ?? 0}</span>
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (val?: number) => (
                <span className="text-white text-sm">
                    ★ {val ? val.toFixed(1) : '0.0'}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: ProductRow) => (
                <div className="flex items-center gap-3">
                    <FiEye 
                        className="text-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer" 
                        size={18} 
                        title="View Details"
                        onClick={() => handleOpenDetails(record._id)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader title="Product Management" subtitle="Manage all products from all vendors" />

            {/* Stats Cards Section (Fixed & Unfiltered) */}
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
                        <h2 className="text-white text-4xl font-bold mt-2 font-sans">{isStatsLoading ? '...' : stat.value}</h2>
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
                    {isLoading || isFetching ? (
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

            {/* Details Modal */}
            <ProductDetailsModal
                open={detailsOpen}
                productId={selectedProductId}
                onClose={() => setDetailsOpen(false)}
            />
        </div>
    );
};

export default Products;
