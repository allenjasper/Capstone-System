import React, { useEffect, useState } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "./ProductionsPage.css";

const ProductionPage = () => {
  const [productions, setProductions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProductions();

    // Pusher Setup
    const pusher = new Pusher("YOUR_PUSHER_KEY", {
      cluster: "YOUR_PUSHER_CLUSTER",
    });

    const channel = pusher.subscribe("production-channel");
    channel.bind("production-updated", () => {
      fetchProductions();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const fetchProductions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/productions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductions(response.data);
      setFiltered(response.data);
    } catch (err) {
      console.error("Failed to fetch productions:", err);
    }
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filteredData = productions.filter((prod) =>
      prod.product_name.toLowerCase().includes(query) ||
      prod.date.includes(query)
    );
    setFiltered(filteredData);
  };

  const stageData = ['Preparation', 'Assembly', 'Finishing', 'Quality Control'].map(stage => ({
    name: stage,
    value: productions.filter(p => p.stage === stage).length,
  }));

  const dailyOutput = Object.values(
    productions.reduce((acc, prod) => {
      const date = prod.date;
      acc[date] = acc[date] || { date, quantity: 0 };
      acc[date].quantity += prod.quantity;
      return acc;
    }, {})
  );

  const colors = ['#f39c12', '#2980b9', '#8e44ad', '#27ae60'];

  return (
    <div className="productions-container">
      <h2>Production Timeline for Unick Furniture</h2>
      <input
        type="text"
        value={search}
        onChange={handleFilter}
        placeholder="Search by product name or date..."
        className="filter-input"
      />

      <div className="timeline">
        {filtered.map((prod) => (
          <div className="timeline-item" key={prod.id}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <p className="date">{new Date(prod.date).toLocaleDateString()}</p>
              <h3>{prod.product_name}</h3>
              <p><strong>Stage:</strong> <span className={`stage stage-${prod.stage.toLowerCase().replace(/\s/g, "-")}`}>{prod.stage}</span></p>
              <p><strong>Quantity:</strong> {prod.quantity} units</p>
              <p><strong>Resources:</strong> {prod.resources_used || "N/A"}</p>
              <p className={`status status-${prod.status.toLowerCase().replace(/\s/g, "-")}`}>{prod.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <h3>📊 Daily Product Output</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyOutput}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>

        <h3> Production by Stage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={stageData} dataKey="value" nameKey="name" outerRadius={100} label>
              {stageData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionPage;