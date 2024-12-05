import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation
import Swal from "sweetalert2";

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
const LimitContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LimitInput = styled.input`
  width: 60px;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UpdateButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
const LimitDisplay = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  color: black;
`;

const LimitForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export default function Admin() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const [bookingLimit, setBookingLimit] = useState(5);
  const [newLimit, setNewLimit] = useState("");
  const navigate = useNavigate();
  const handleStatusChange = (status) => {
    navigate(`/status/${status}`); // Navigate to a specific page based on status
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/pending"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchBookingLimit = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/limit"
        );
        const result = await response.json();
        setBookingLimit(result.limit);
      } catch (error) {
        console.error("Error fetching booking limit:", error);
      }
    };

    fetchData();
    fetchBookingLimit();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accept" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      // Update the state to remove the accepted booking
      setData((prevData) => prevData.filter((item) => item._id !== id));

      Swal.fire({
        title: "Accepted!",
        text: "The booking has been accepted successfully.",
        icon: "success",
        confirmButtonText: "Cool",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to accept the booking.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdateLimit = async () => {
    // Validate input
    if (!newLimit || isNaN(parseInt(newLimit)) || parseInt(newLimit) <= 0) {
      Swal.fire({
        title: "Invalid Input",
        text: "Please enter a valid positive number for the booking limit.",
        icon: "warning",
        confirmButtonText: "Got it",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings/limit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: parseInt(newLimit) }),
      });
      const result = await response.json();
      if (response.ok) {
        setBookingLimit(result.limit);
        setNewLimit("");
        Swal.fire({
          title: "Success!",
          text: "Booking limit updated successfully!",
          icon: "success",
          confirmButtonText: "Great",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error updating booking limit:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update booking limit. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog before deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((booking) => booking._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The booking has been deleted successfully.",
          icon: "success",
          confirmButtonText: "Cool",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while deleting the booking",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const columns = [
    {
      name: "Booking Date",
      selector: (row) =>
        row.bookingDate
          ? format(new Date(row.bookingDate), "yyyy-MM-dd")
          : "N/A", // Check for valid date
      sortable: true,
    },
    {
      name: "Submission Time",
      selector: (row) => row.submissionTime,
      sortable: true,
      format: (row) =>
        row.submissionTime
          ? format(new Date(row.submissionTime), "yyyy-MM-dd HH:mm:ss")
          : "N/A", // Check for valid submission time
    },

    { name: "User Name", selector: (row) => row.userName, sortable: true },

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
          <button onClick={() => handleAccept(row._id)}>Accept</button>
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
        <h1>Admin Page</h1>
        <Header>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "20px",
            }}
          >
            <button onClick={() => handleStatusChange("accept")}>Accept</button>
            <button onClick={() => handleStatusChange("done")}>Done</button>
            <button onClick={() => handleStatusChange("completed")}>
              Complete
            </button>
          </div>
          <LimitContainer>
            <LimitDisplay>Current Booking Limit: {bookingLimit}</LimitDisplay>
            <LimitInput
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="New limit"
              min="1"
            />
            <UpdateButton onClick={handleUpdateLimit}>
              Update Limit
            </UpdateButton>
          </LimitContainer>
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
