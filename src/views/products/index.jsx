import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // gunakan react-router-dom
import Api from "../../api";

export default function ProductIndex() {
  // Fetch data from API using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await Api.get("/api/products");
      return res.data?.data?.data ?? [];
    },
  });

  const products = data ?? [];

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
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span>Loading...</span>
              </div>
            )}

            {/* Error State */}
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
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Image</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Title</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Description</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Price</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Stock</th>
                      <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">Actions</th>
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
                                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
                                onClick={() => alert("Implement delete handler")}
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
    </main>
  );
}
