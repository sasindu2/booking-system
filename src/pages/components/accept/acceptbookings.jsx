import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header = styled.div`
  display: flex;
  justify-content: center; // Center the buttons
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

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
`;

const TableHeader = styled.div`
  height: 400px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0px;
  }

  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  -ms-overflow-style: none;

  .rdt_TableHeadRow {
    background-color: #4caf50;
  }
  .rdt_TableCol {
    color: white;
  }
`;

const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  left: 10px;
  right: 10px;
  bottom: 0;
  padding: 20px;
  background-color: #fff;
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

export default function AcceptPage() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/accepted"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching accepted bookings:", error);
      }
    };

    fetchData();
  }, []);

  const handleDone = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      // Update the state to remove the done booking
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((booking) => booking._id !== id));
        alert("Booking deleted successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(error.message || "An error occurred while deleting the booking");
    }
  };

  const handleStatusChange = (status) => {
    navigate(`/status/${status}`);
  };

  const columns = [
    {
      name: "Booking Date",
      selector: (row) =>
        row.bookingDate
          ? format(new Date(row.bookingDate), "yyyy-MM-dd")
          : "N/A",
      sortable: true,
    },
    {
      name: "Submission Time",
      selector: (row) =>
        row.submissionTime
          ? format(new Date(row.submissionTime), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Vehicle Number",
      selector: (row) => row.vehicleNumber,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleDone(row._id)}>Done</button>
          <button onClick={() => handleDelete(row._id)}>Delete</button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.bookingDate.includes(filterText) ||
      item.userName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.vehicleNumber.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phoneNumber.includes(filterText) ||
      (item.submissionTime &&
        format(new Date(item.submissionTime), "yyyy-MM-dd HH:mm:ss").includes(
          filterText
        ))
  );

  return (
    <FixedContainer>
      <div style={{ width: "100%" }}>
        <h1>Accepted Bookings</h1>
        <Header>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Header>
        <Header>
          <CenteredButtonContainer>
            <button onClick={() => handleStatusChange("done")}>Done</button>
            <button onClick={() => handleStatusChange("delete")}>Delete</button>
          </CenteredButtonContainer>
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
