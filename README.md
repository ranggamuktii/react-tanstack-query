# React + TanStack Query CRUD (Tailwind)

UI sederhana untuk demo CRUD produk menggunakan **React + React Router DOM + TanStack Query + Axios** dan **Tailwind CSS**. Termasuk **modal konfirmasi Delete**, **preview gambar** (Create/Edit), dan dukungan **dark mode**.

---

## ✨ Fitur

- Halaman **Products** (list) dengan tabel Tailwind, hover, dan dark mode.
- **Delete modal** dengan konfirmasi & spinner status.
- **Create** & **Edit**: form rapi, focus ring, validasi error per-field, preview gambar aman di React 18.
- **Navbar** responsif (hamburger), gaya Tailwind.
- **Home** (hero) dengan dekorasi lembut.
- **React Query** untuk fetch/cache + invalidasi otomatis setelah Delete/Update.

---

## 🧰 Teknologi

- **React 18** + **Vite**
- **react-router-dom**
- **@tanstack/react-query**
- **Axios**
- **Tailwind CSS** (termasuk dark mode)

---

## 🚀 Mulai Cepat

### 1) Prasyarat

- Node.js LTS (≥ 18) & npm / pnpm / yarn

### 2) Install depedensi

```bash
npm install
# atau
pnpm install
# atau
yarn
```

### 3) Jalankan FE (Vite)

```bash
npm run dev
```

Secara default berjalan di `http://localhost:5173`.

> **Penting**: Aplikasi ini memanggil API `/api/...`. Saat dev, gunakan **proxy Vite** atau pastikan backend tersedia di `http://127.0.0.1:8000` dengan CORS aktif.

---

## 🔌 Konfigurasi API (Axios)

**Direkomendasikan (dev)**: pakai **proxy Vite** agar bebas CORS.

**vite.config.(js|ts)**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
```

**src/api/index.js**

```js
import axios from "axios";

const Api = axios.create({
  baseURL: "/api", // lewat proxy Vite
  timeout: 10000,
});

export default Api;
```

Jika **tanpa proxy**, set langsung ke backend (pastikan CORS & URL benar):

```js
const Api = axios.create({ baseURL: "http://127.0.0.1:8000/api" });
// lalu panggilan menjadi Api.get("/products") dst.
```

---

## 🗂️ Struktur Direktori (ringkas)

```
src/
  api/
    index.js            # Axios instance
  routes/
    index.jsx           # Route mapping
  views/
    home.jsx            # Hero/landing
    products/
      index.jsx         # List + delete modal
      create.jsx        # Form create + preview
      edit.jsx          # Form edit + preview
```

---

## 🧭 Routing

Gunakan **react-router-dom** (bukan `react-router`). Contoh route:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<ProductIndex />} />
  <Route path="/products/create" element={<ProductCreate />} />
  <Route path="/products/edit/:id" element={<ProductEdit />} />
</Routes>
```

---

## 🧠 Pola React Query

- **List**: `useQuery(["products"], ...)`
- **Delete**: `useMutation(deleteFn, { onSuccess: () => invalidate ["products"] })`
- **Detail** (Edit): `useQuery(["product", id], ...)`
- **Update**: coba `PUT` multipart; fallback `POST` + `_method=PUT` jika diperlukan server.

---

## 🖼️ Preview Gambar Aman (React 18)

- Gunakan `URL.createObjectURL(file)` saat user memilih file.
- **Revoke hanya URL sebelumnya** atau saat unmount (hindari revoke URL yang baru dibuat—Strict Mode memanggil cleanup ganda).

Contoh pola singkat:

```js
const prevUrlRef = useRef(null);
const [previewUrl, setPreviewUrl] = useState(null);

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
  const url = URL.createObjectURL(file);
  prevUrlRef.current = url;
  setPreviewUrl(url);
};

useEffect(
  () => () => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
  },
  []
);
```

---

## 🗃️ Backend

Anda bisa memakai:

### Opsi A — Backend pribadi (mis. Laravel)

- Siapkan route resource: `Route::apiResource('products', ProductController::class);`
- Endpoint minimal:

  - `GET /api/products` (list)
  - `POST /api/products` (create, multipart untuk image)
  - `GET /api/products/{id}` (detail)
  - `PUT /api/products/{id}` (update; atau terima `POST` + `_method=PUT`)
  - `DELETE /api/products/{id}` (hapus)

- Pastikan **CORS** mengizinkan origin FE (5173).

### Opsi B — Mock server (Express) untuk dev cepat

- Jalankan server kecil di port **8000** yang melayani endpoint di atas.
- Dukung upload (multer), method override (`_method`), dan static file `/uploads` untuk gambar.

> Kalau Anda butuh contoh `server.js` Express, tinggal bilang—naskah siap tempel sudah tersedia.

---

## 🧪 Skrip NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## ⚠️ Catatan & Tips

- **Import router** selalu dari `react-router-dom` (Link, NavLink, Routes, Route, useNavigate, useParams).
- **Mixed content**: jika FE di `https`, backend harus `https` juga atau pakai proxy.
- **ID detail 404**: pastikan `product.id` yang dipakai di link Edit sama dengan ID yang diterima endpoint detail.

---

## 📜 Lisensi

MIT — bebas pakai, mohon pertahankan atribusi seperlunya.
