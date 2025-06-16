import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/inventory", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInventory(response.data);
            } catch (err) {
                console.error("Failed to fetch inventory:", err);
            }
        };

        fetchInventory();
    }, []);

    return (
        <div>
            <h2>Inventory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryPage;
