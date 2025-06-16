import React, { useState } from "react";
import AdminProductsTable from "./AdminProductsTable";
import OrdersTable from "./OrdersTable";
import axios from "axios";
import { motion } from "framer-motion";
import "./product_page.css";

const ProductPage = () => {
    const [view, setView] = useState("products");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [loading, setLoading] = useState(false);
    const [refreshProducts, setRefreshProducts] = useState(false); // ✅ Track refresh state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8000/api/products", newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewProduct({ name: "", description: "", price: "", stock: "", image: "" });
            setRefreshProducts((prev) => !prev); // ✅ Toggle state to refresh table
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (

        
        <div className="container mt-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="text-center mb-4">
                    <h2 style={{ color: 'black' }} >Employee Dashboard</h2>
                    <p style={{ color: 'red' }}>Manage your products</p>
                    </div>

                    <div className="dashboard-nav">
                    <div className="nav-buttons">
                        <button className={`tab-button ${view === "products" ? "active" : ""}`} onClick={() => setView("products")}>Products</button>
                        <button className={`tab-button ${view === "orders" ? "active" : ""}`} onClick={() => setView("orders")}>Orders</button>
                    </div>
                    {view === "products" && (
                        <button className="add-button" onClick={() => setShowAddModal(true)}>
                            + Add Shoe
                        </button>
                    )}
                </div>
                    
                <div className="dashboard-content">
                {view === "products" ? <AdminProductsTable key={refreshProducts} /> : <OrdersTable />}
                </div>


                

                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <div className="modal-header">
                                <h5>Add Shoe</h5>
                                <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-input" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Shoe Name" />
                                <input type="text" className="form-input" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
                                <input type="number" className="form-input" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" />
                                <input type="number" className="form-input" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" />
                                <input type="text" className="form-input" name="image" value={newProduct.image} onChange={handleInputChange} placeholder="Image URL" />
                            </div>
                            <div className="modal-footer">
                                <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="submit-button" onClick={handleAddProduct} disabled={loading}>{loading ? "Adding..." : "Add Shoe"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProductPage; 