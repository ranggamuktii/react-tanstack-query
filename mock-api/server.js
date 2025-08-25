// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// simpan file ke ./uploads
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });


// serve file statis
app.use("/uploads", express.static(uploadDir));

// db in-memory sederhana
let products = [];
const findIndex = (id) => products.findIndex((p) => String(p.id) === String(id));

/** GET /api/products -> { data: { data: [...] } } */
app.get("/api/products", (_req, res) => {
  res.json({ data: { data: products } });
});

/** POST /api/products (multipart) */
app.post("/api/products", upload.single("image"), (req, res) => {
  const { title, description, price, stock } = req.body;
  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  const product = {
    id: Date.now(),
    title: title ?? "",
    description: description ?? "",
    price: price ? Number(price) : 0,
    stock: stock ? Number(stock) : 0,
    image: imgPath,
  };
  products.unshift(product);
  res.status(201).json({ data: product });
});

/** DETAIL: GET /api/products/:id */
app.get("/api/products/:id", (req, res) => {
  const idx = findIndex(req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  res.json({ data: products[idx] });
});

/** UPDATE: PUT /api/products/:id  (dukung _method=PUT juga) */
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const idx = findIndex(req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const { title, description, price, stock } = req.body;
  const old = products[idx];
  const imgPath = req.file ? `/uploads/${req.file.filename}` : old.image;

  const updated = {
    ...old,
    title: title ?? old.title,
    description: description ?? old.description,
    price: price != null ? Number(price) : old.price,
    stock: stock != null ? Number(stock) : old.stock,
    image: imgPath,
  };

  products[idx] = updated;
  res.json({ data: updated });
});

/** DELETE: DELETE /api/products/:id */
app.delete("/api/products/:id", (req, res) => {
  const idx = findIndex(req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = products.splice(idx, 1);
  res.json({ data: removed });
});

// start di 8000 biar cocok sama FE
const PORT = 8000;
app.listen(PORT, () => console.log(`Mock API running at http://127.0.0.1:${PORT}`));
