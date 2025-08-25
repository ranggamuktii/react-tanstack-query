import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // gunakan react-router-dom
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../../api";

export default function ProductEdit() {
  // State form
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState({});

  // Preview URL untuk file yang baru dipilih
  const [previewUrl, setPreviewUrl] = useState(null);
  const prevUrlRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch detail produk
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await Api.get(`/api/products/${id}`);
      return res.data?.data ?? {};
    },
  });

  // Sync state dari data API
  useEffect(() => {
    if (data && data.id) {
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setPrice(data.price ?? "");
      setStock(data.stock ?? "");
    }
  }, [data]);

  // Handle pilih file + preview aman untuk StrictMode
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    const url = URL.createObjectURL(file);
    prevUrlRef.current = url;
    setImage(file);
    setPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  // Helper ambil error per-field
  const getError = (key) => {
    const v = errors?.[key];
    if (!v) return null;
    return Array.isArray(v) ? v[0] : String(v);
  };

  // Mutasi update produk (method override)
  const mutationProduct = useMutation({
    mutationFn: async (formData) => {
        try {
        // Coba PUT multipart langsung
        return await Api.put(`/api/products/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        } catch (err) {
        // Fallback untuk server yang butuh method override
        if (err?.response?.status === 405 || err?.response?.status === 404) {
            if (!formData.has || !formData.has("_method")) {
            try { formData.has && formData.has("_method"); } catch {err}
            }
            if (!formData.has || !formData.has("_method")) {
            formData.append("_method", "PUT");
            }
            return await Api.post(`/api/products/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
        }
        throw err;
        }
    },
    onSuccess: () => {
        navigate("/products");
    },
    onError: (err) => {
        setErrors(err?.response?.data ?? { general: "Gagal memperbarui produk." });
        if (!err?.response) {
        console.error("Network/Client error:", err?.message, err?.code);
        } else {
        console.error("API error:", err.response.status, err.response.data);
        }
    },
    });

  const updateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    
    mutationProduct.mutate(formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Product</h1>

        <section className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/60">
          {/* Loading */}
          {isLoading && (
            <div className="mb-4 flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Loading product...
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              Error: {error?.message ?? "Gagal memuat data"}
            </div>
          )}

          {/* Form */}
          {!isLoading && !isError && (
            <form onSubmit={updateProduct} className="space-y-6">
              {errors.general && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                  {errors.general}
                </div>
              )}

              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Image
                </label>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-start">
                  <div className="sm:col-span-2">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={mutationProduct.isPending}
                      className="block w-full rounded-xl border border-slate-300 bg-white/90 text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:file:bg-slate-800 dark:hover:file:bg-slate-700"
                    />
                    {getError("image") && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getError("image")}</p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <div className="aspect-video overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : data?.image ? (
                        <img src={data.image} alt={data.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm text-slate-400 dark:text-slate-500">No image</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Title Product"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={mutationProduct.isPending}
                  aria-invalid={!!getError("title")}
                  className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                />
                {getError("title") && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getError("title")}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Description Product"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={mutationProduct.isPending}
                  aria-invalid={!!getError("description")}
                  className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                />
                {getError("description") && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getError("description")}</p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    placeholder="Price Product"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={mutationProduct.isPending}
                    aria-invalid={!!getError("price")}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                  />
                  {getError("price") && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getError("price")}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    placeholder="Stock Product"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    disabled={mutationProduct.isPending}
                    aria-invalid={!!getError("stock")}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                  />
                  {getError("stock") && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getError("stock")}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={mutationProduct.isPending}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 disabled:opacity-50"
                >
                  {mutationProduct.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={mutationProduct.isPending}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:ring-slate-700/60 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
