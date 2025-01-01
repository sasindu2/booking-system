import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Booking.css";
import Swal from "sweetalert2";

const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [startDate, setStartDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchBlockedDates();
  }, []);
  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(
        "https://stannsserviceabackend.vercel.app/api/bookings/blocked-dates"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blocked dates");
      }
      const data = await response.json();
      setBlockedDates(data.map((date) => new Date(date)));
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
      setSubmitError("Failed to load blocked dates. Please try again later.");
    }
  };
  const isAvailableDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false; // Check if the date is valid
    const day = date.getDay();
    const isSunday = day === 0;
    const isBlocked = blockedDates.includes(dateString);
    return !isSunday && !isBlocked;
  };

  const onSubmit = async (data) => {
    if (!startDate) {
      setSubmitError("Please select a booking date.");
      return;
    }
    if (!isAvailableDate(startDate)) {
      setSubmitError("Selected date is not available for booking.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formattedBookingDate = startDate.toISOString();
    const submissionTime = new Date().toISOString();

    data.bookingDate = formattedBookingDate;
    data.submissionTime = submissionTime;

    try {
      const response = await fetch(
        "https://stannsserviceabackend.vercel.app/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success",
        });
        reset();
        setStartDate(null);
        // Fetch updated blocked dates after successful booking
        fetchBlockedDates();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        error.message ||
          "An error occurred while creating the booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="PageContainer">
        <div className="FormContainer">
          <h1>St'Anns Service</h1>
          <h2>
            <strong>Booking system</strong>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* User Name */}
            <label className="InputContainer">User Name</label>
            <input
              className="Input"
              type="text"
              {...register("userName", { required: true })}
            />
            {errors.userName && (
              <span className="ErrorMessage">User Name is required</span>
            )}

            {/* Vehicle Number */}
            <label className="InputContainer">Vehicle Number</label>
            <input
              className="Input"
              type="text"
              placeholder="ex, ABC-1234"
              {...register("vehicleNumber", { required: true })}
            />
            {errors.vehicleNumber && (
              <span className="ErrorMessage">Vehicle Number is required</span>
            )}

            {/* Phone Number */}
            <label className="InputContainer">Phone Number</label>
            <input
              className="Input"
              type="tel"
              {...register("phoneNumber", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
            />
            {errors.phoneNumber && (
              <span className="ErrorMessage">
                Phone Number is required and should be 10 digits
              </span>
            )}

            {/* Booking Date */}
            <label className="InputContainer">Booking Date</label>
            <DatePicker
              className="StyledDatePicker"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              filterDate={isAvailableDate}
              excludeDates={blockedDates}
              minDate={new Date()}
              placeholderText="Select a date"
            />
            {startDate === null && (
              <span className="ErrorMessage">Booking Date is required</span>
            )}
            <div style={{ marginTop: "20px" }}></div>

            {/* Submit Button */}
            <div className="ButtonContainer">
              <button
                className="Button"
                type="submit"
                disabled={isSubmitting || !isAvailableDate(startDate)}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Footer */}
            <div className="condition-footer">
              <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
