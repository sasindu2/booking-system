import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./complete.css";

export default function CompletePage() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const [activeButton, setActiveButton] = useState("completed");
  const navigate = useNavigate();

  const handleStatusChange = (status) => {
    setActiveButton(status);
    navigate(`/status/${status}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/completed"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching completed bookings:", error);
      }
    };

    fetchData();
  }, []);

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
          : "N/A",
      sortable: true,
    },
    {
      name: "Completion Time",
      selector: (row) =>
        row.completionTime
          ? format(new Date(row.completionTime), "yyyy-MM-dd HH:mm:ss")
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
          <button onClick={() => handleDelete(row._id)}>Details</button>
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
      (item.completionTime &&
        format(new Date(item.completionTime), "yyyy-MM-dd HH:mm:ss").includes(
          filterText
        ))
  );
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#4caf50",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
    headCells: {
      style: {
        color: "white",
      },
    },
  };
  return (
    <div className="fixed-container">
      <div style={{ width: "100%" }}>
        <h1>Completed Bookings</h1>

        <div className="header">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <button
              onClick={() => handleStatusChange("accept")}
              className={`status-btn ${
                activeButton === "accept" ? "active" : ""
              }`}
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange("done")}
              className={`status-btn ${
                activeButton === "done" ? "active" : ""
              }`}
            >
              Done
            </button>
            <button
              onClick={() => handleStatusChange("completed")}
              className={`status-btn ${
                activeButton === "completed" ? "active" : ""
              }`}
            >
              Complete
            </button>
          </div>
        </div>

        <div className="table-header">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}
