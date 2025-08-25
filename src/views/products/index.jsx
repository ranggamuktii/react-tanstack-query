import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Api from "../../api/index";

export default function ProductIndex() {
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await Api.get("/api/products");
      return res.data?.data?.data ?? [];
    },
  });
  const products = data ?? [];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null); // { id, title, image }
  const cancelBtnRef = useRef(null);

  // Delete mutation
  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      await Api.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
  });

  const openModal = (product) => {
    setToDelete(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setToDelete(null);
  };

  const confirmDelete = () => {
    if (!toDelete?.id) return;
    deleteProduct.mutate(toDelete.id);
  };

  // A11y: Esc to close, focus cancel by default
  useEffect(() => {
    if (modalOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
    const onKeyDown = (e) => e.key === "Escape" && setModalOpen(false);
    if (modalOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  const deleting = deleteProduct.isPending;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
          <Link
            to="/products/create"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
          >
            Add New Product
          </Link>
        </div>

        {/* Card */}
        <section className="overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/60">
          <div className="p-4 sm:p-6">
            {/* Mutation error */}
            {deleteProduct.isError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                {deleteProduct.error?.response?.data?.message || deleteProduct.error?.message || "Failed to delete product."}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span>Loading...</span>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                Error: {error?.message ?? "Gagal memuat data"}
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Image</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Stock</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white/70 dark:divide-slate-800 dark:bg-slate-900/40">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="h-24 w-32 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                />
                              ) : (
                                <div className="flex h-24 w-32 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700">
                                  No Image
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-slate-800 dark:text-slate-100">{product.title}</td>
                          <td className="px-4 py-3 align-top text-sm text-slate-600 dark:text-slate-300">{product.description}</td>
                          <td className="px-4 py-3 align-top text-sm font-medium text-slate-800 dark:text-slate-100">
                            {typeof product.price === "number"
                              ? product.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
                              : product.price ?? "-"}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-slate-800 dark:text-slate-100">{product.stock}</td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/products/edit/${product.id}`}
                                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                onClick={() => openModal(product)}
                                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-6">
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                            Tidak ada data.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal Confirm Delete */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          aria-labelledby="confirm-title"
          role="dialog"
          aria-modal="true"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          {/* panel */}
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                {/* trash icon */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 6v-.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V6M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 id="confirm-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                  Delete this product?
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  This action cannot be undone. You are about to delete{" "}
                  <span className="font-medium text-slate-900 dark:text-white">“{toDelete?.title ?? "this item"}”</span>.
                </p>

                {/* preview */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-14 w-20 overflow-hidden rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    {toDelete?.image ? (
                      <img src={toDelete.image} alt={toDelete.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{toDelete?.title}</div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">ID: {toDelete?.id}</div>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    ref={cancelBtnRef}
                    type="button"
                    onClick={closeModal}
                    disabled={deleting}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:ring-slate-700/60 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deleting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                          <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
