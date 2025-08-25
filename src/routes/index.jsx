// Import React Router
import { Routes, Route } from "react-router-dom";

// Import view HomePage
import Home from "../views/home";

//import view ProductIndex
import ProductIndex from "../views/products/index";

// Import view ProductCreate
import ProductCreate from "../views/products/create";

// Import view ProductEdit
import ProductEdit from "../views/products/edit";

// Definisikan component dengan (Functional Component)
const RoutesIndex = () => {
    return (
        <Routes>
            {/* Route untuk halaman utama */}
            <Route path="/" element={<Home />} />

            {/* Route untuk halaman produk */}
            <Route path="/products" element={<ProductIndex />} />

            {/* Route untuk halaman tambah produk */}
            <Route path="/products/create" element={<ProductCreate />} />

            {/* Route untuk halaman edit produk */}
            <Route path="/products/edit/:id" element={<ProductEdit />} />
        </Routes>
    );
};

export default RoutesIndex;