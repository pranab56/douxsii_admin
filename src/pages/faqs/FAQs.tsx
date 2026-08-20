import { useState } from 'react';
import { GoQuestion } from 'react-icons/go';
import { CiEdit } from 'react-icons/ci';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlinePlus } from 'react-icons/ai';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FaqModal from '../../components/ui/FaqModal';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaqItem } from './faqs.types';
import {
    useGetAllFaqQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation
} from '../../features/faq/faqApi';
import toast from 'react-hot-toast';

const FAQs = () => {
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);



    // API Hooks
    const { data: faqResponse, isLoading, isFetching } = useGetAllFaqQuery({ page });
    const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
    const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
    const [deleteFaq] = useDeleteFaqMutation();

    const faqList: FaqItem[] = faqResponse?.data || [];
    const meta = faqResponse?.meta;

    const pageSize = meta?.limit || 10;
    const totalItems = meta?.total ?? faqList.length;

    const handleAdd = () => {
        setEditingFaq(null);
        setModalOpen(true);
    };

    const handleEdit = (item: FaqItem) => {
        setEditingFaq(item);
        setModalOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;

        try {
            const res = await deleteFaq(deletingId).unwrap();
            toast.success(res?.message || 'FAQ deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to delete FAQ');
        } finally {
            setConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const handleSubmit = async (values: { question: string; answer: string }) => {
        try {
            if (editingFaq) {
                const res = await updateFaq({
                    faqId: editingFaq._id || editingFaq.id || '',
                    question: values.question,
                    answer: values.answer
                }).unwrap();
                toast.success(res?.message || 'FAQ updated successfully');
            } else {
                const res = await createFaq({
                    question: values.question,
                    answer: values.answer
                }).unwrap();
                toast.success(res?.message || 'FAQ created successfully');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Failed to save FAQ');
        }
    };

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader
                title="Frequently Asked Questions"
                subtitle="Manage common questions and instructions visible to consumers."
                extra={
                    <button
                        onClick={handleAdd}
                        className="h-11 px-5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                        style={{ background: '#ff2150' }}
                    >
                        <AiOutlinePlus size={16} />
                        Add FAQ
                    </button>
                }
            />

            {/* FAQ List Area */}
            <div
                className="p-6 rounded-2xl flex flex-col gap-4 relative"
                style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                {isLoading || isFetching ? (
                    <LoadingSpinner text="Loading FAQs..." />
                ) : faqList.length === 0 ? (
                    <div className="py-16 text-center text-white/50 text-base">
                        No FAQ entries found. Click "Add FAQ" to create one.
                    </div>
                ) : (
                    faqList.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-2xl p-5 flex justify-between items-start gap-4 transition-all duration-300 hover:bg-white/[0.04]"
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-[#ff4b72]/10 border border-[#ff4b72]/20 flex items-center justify-center shrink-0 mt-0.5">
                                <GoQuestion color="#ff4b72" size={18} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white text-base font-semibold m-0 break-words">{item.question}</h3>
                                <p className="text-white/60 text-sm leading-relaxed mt-2 break-words m-0">{item.answer}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#38bdf8] hover:border-[#38bdf8]/30 transition-colors cursor-pointer bg-transparent border border-white/10 outline-none"
                                    title="Edit FAQ"
                                >
                                    <CiEdit size={17} />
                                </button>
                                <button
                                    onClick={() => handleDeleteRequest(item._id || item.id || '')}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#ef4444] hover:border-[#ef4444]/30 transition-colors cursor-pointer bg-transparent border border-white/10 outline-none"
                                    title="Delete FAQ"
                                >
                                    <RxCross2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {totalItems > pageSize && (
                    <div className="pt-4">
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={totalItems}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>

            <FaqModal
                open={modalOpen}
                editingFaq={editingFaq}
                isSubmitting={isCreating || isUpdating}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                open={confirmOpen}
                title="Delete FAQ"
                description="This FAQ entry will be removed permanently. Are you sure?"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default FAQs;
