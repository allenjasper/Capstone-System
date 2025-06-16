import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        Order #{order.id} - {order.customer_name} - {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderPage;
