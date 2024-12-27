import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./done.css";
import { Check } from "@mui/icons-material";

export default function DonePage() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const [activeButton, setActiveButton] = useState("done");
  const navigate = useNavigate();
  const handleStatusChange = (status) => {
    setActiveButton(status);
    navigate(`/status/${status}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/done");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching done bookings:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompleted = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      // Update the state to remove the done booking
      setData((prevData) => prevData.filter((item) => item._id !== id));
      Swal.fire({
        title: "Completed!",
        text: "The booking has been completed successfully.",
        icon: "success",
        confirmButtonText: "Cool",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to complete the booking.",
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
      selector: (row) => row.id,
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleCompleted(row._id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Check style={{ color: "green", fontSize: "20px" }} />
          </button>
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
        <h1>Done Bookings</h1>

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
              Arrived
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
          <div className="admin-nav">
            <button onClick={() => navigate("/BRRadmin")}>
              Admin Dashboard
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
