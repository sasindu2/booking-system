import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

export default function DonePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings?status=done"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching done bookings:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Done Bookings</h1>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
