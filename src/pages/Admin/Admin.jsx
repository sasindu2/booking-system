import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
// import GlobalStyle from "../globalstyle";

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
const SearchInput = styled.input`
  width: 300px;
  padding: 10px 40px 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 0px;
  background-color: #f0f0f0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: black;

  &:focus {
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &::placeholder {
    color: #999;
  }

  /* Add a search icon */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
`;

const TableHeader = styled.div`
  height: 400px; /* Define a fixed height for the table container */
  overflow-y: auto;

  /* Hide scrollbar icon for Chrome, Safari, and Opera */
  ::-webkit-scrollbar {
    width: 0px; /* Hides the scrollbar width */
  }

  /* Hide scrollbar icon for Firefox */
  scrollbar-width: thin; /* Makes the scrollbar very thin */
  scrollbar-color: transparent transparent; /* Makes the scrollbar invisible */

  /* Hide scrollbar icon for IE, Edge */
  -ms-overflow-style: none; /* Hides the scrollbar icon for IE and Edge */

  .rdt_TableHeadRow {
    background-color: #4caf50; /* Change this color to your preference */
  }
  .rdt_TableCol {
    color: white; /* Change text color to your preference */
  }
`;
const FixedContainer = styled.div`
  position: fixed;

  top: 0;
  left: 10px;
  right: 10px;
  bottom: 0;
  // overflow-y: auto;
  padding: 20px;
  background-color: #fff; // Add a background color to ensure content below doesn't show through
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
    <FixedContainer>
      <div style={{ width: "100%" }}>
        <h1>Admin Page</h1>
        <Header>
          <SearchInput
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
    </FixedContainer>
  );
}
