import React, { useState } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import GlobalStyle from "../globalstyle";

const data = [
  {
    id: 1,
    bookingDate: "2024-07-10",
    userName: "John Doe",
    vehicleNumber: "ABC1234",
    phoneNumber: "9876543210",
  },
  {
    id: 2,
    bookingDate: "2024-07-11",
    userName: "Jane Smith",
    vehicleNumber: "XYZ5678",
    phoneNumber: "8765432109",
  },
  {
    id: 3,
    bookingDate: "2024-07-12",
    userName: "Alice Johnson",
    vehicleNumber: "LMN2345",
    phoneNumber: "7654321098",
  },
  {
    id: 4,
    bookingDate: "2024-07-13",
    userName: "Bob Brown",
    vehicleNumber: "QRS6789",
    phoneNumber: "6543210987",
  },
  {
    id: 5,
    bookingDate: "2024-07-14",
    userName: "Charlie Davis",
    vehicleNumber: "TUV3456",
    phoneNumber: "5432109876",
  },
  {
    id: 6,
    bookingDate: "2024-07-15",
    userName: "Diana Evans",
    vehicleNumber: "WXY7890",
    phoneNumber: "4321098765",
  },
  {
    id: 7,
    bookingDate: "2024-07-16",
    userName: "Evan Foster",
    vehicleNumber: "JKL8901",
    phoneNumber: "3210987654",
  },
  {
    id: 8,
    bookingDate: "2024-07-17",
    userName: "Fiona Green",
    vehicleNumber: "MNO9012",
    phoneNumber: "2109876543",
  },
  {
    id: 9,
    bookingDate: "2024-07-18",
    userName: "George Harris",
    vehicleNumber: "PQR0123",
    phoneNumber: "1098765432",
  },
  {
    id: 10,
    bookingDate: "2024-07-19",
    userName: "Hannah Irvine",
    vehicleNumber: "STU1234",
    phoneNumber: "0987654321",
  },
];

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
