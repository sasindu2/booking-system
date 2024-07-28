import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import GlobalStyle from "../globalstyle";

const columns = [
  { name: "Booking Date", selector: (row) => row.bookingDate, sortable: true },
  { name: "User Name", selector: (row) => row.userName, sortable: true },
  {
    name: "Vehicle Number",
    selector: (row) => row.vehicleNumber,
    sortable: true,
  },
  { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
];

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableHeader = styled.div`
  .rdt_TableHeadRow {
    background-color: #4caf50; /* Change this color to your preference */
  }
  .rdt_TableCol {
    color: white; /* Change text color to your preference */
  }
`;

export default function Admin() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.bookingDate.includes(filterText) ||
      item.userName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.vehicleNumber.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phoneNumber.includes(filterText)
  );

  return (
    <>
      <GlobalStyle />
      <div style={{ width: "100%" }}>
        <h1>Admin Page</h1>
        <Header>
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Header>
        <TableHeader>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
          />
        </TableHeader>
      </div>
    </>
  );
}
