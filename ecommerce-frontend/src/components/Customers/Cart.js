import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import CartTable from "./CartTable";
import OrderTable from "../OrderTable";

const Cart = () => {
    const [view, setView] = useState("cart");
    const [showSummary, setShowSummary] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        alert("Order placed successfully!");
        setShowSummary(false);
    };

    return (
        <div className="container-fluid mt-4 ps-5">
            <div className="mb-3">
                <h3 className="text-start">My {view === "cart" ? "Cart" : "Orders"}</h3>
            </div>
            <div className="mb-3 d-flex gap-3">
            <button
                className={`btn ${view === "cart" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setView("cart")}
            >
                Cart
            </button>
            <button
                className={`btn ${view === "orders" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setView("orders")}
            >
                Orders
            </button>
            </div>



            <div className="card p-3 text-start w-100">
                {view === "cart" ? <CartTable /> : <OrderTable />}
            </div>

            {showSummary && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order Summary</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSummary(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CartTable summaryMode={true} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={handleCheckout}>Confirm Order</button>
                                <button className="btn btn-secondary" onClick={() => setShowSummary(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => navigate(-1)} className="btn btn-outline-dark mt-3">⬅ Back</button>
        </div>
    );
};

export default Cart;
