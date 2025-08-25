// Import React Router
import { Routes, Route } from "react-router";

// Import view HomePage
import Home from "../views/home";

//import view ProductIndex
import ProductIndex from "../views/products/index";

// Definisikan component dengan (Functional Component)
const RoutesIndex = () => {
    return (
        <Routes>
            {/* Route untuk halaman utama */}
            <Route path="/" element={<Home />} />

            {/* Route untuk halaman produk */}
            <Route path="/products" element={<ProductIndex />} />
        </Routes>
    );
};

export default RoutesIndex;