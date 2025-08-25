// Import React Router
import { Routes, Route } from "react-router";

// Import view HomePage
import Home from "../views/home";

// Definisikan component dengan (Functional Component)
const RoutesIndex = () => {
    return (
        <Routes>
            {/* Route untuk halaman utama */}
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

export default RoutesIndex;