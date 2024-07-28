import React from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Booking/Booking.css";
import GlobalStyle from "../globalstyle";

const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [startDate, setStartDate] = React.useState(null);

  const onSubmit = async (data) => {
    data.bookingDate = startDate;

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Booking successfully created");
      } else {
        console.error("Error creating booking");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="PageContainer">
        <div className="FormContainer">
          <h1>St'Anns Service</h1>
          <h2>Booking system</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="InputContainer">User Name</label>
            <input
              className="Input"
              type="text"
              {...register("userName", { required: true })}
            />
            <br />
            {errors.userName && (
              <span className="ErrorMessage">User Name is required</span>
            )}
            <br />
            <label className="InputContainer">Vehicle Number</label>
            <input
              className="Input"
              type="text"
              {...register("vehicleNumber", { required: true })}
              placeholder="ex, ABC-1234"
            />
            <br />
            {errors.vehicleNumber && (
              <span className="ErrorMessage">Vehicle Number is required</span>
            )}
            <br />
            <label className="InputContainer">Phone Number</label>
            <input
              className="Input"
              type="tel"
              {...register("phoneNumber", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
            />
            <br />
            {errors.phoneNumber && (
              <span className="ErrorMessage">
                Phone Number is required and should be 10 digits
              </span>
            )}
            <br />
            <label className="InputContainer">Booking Date</label>
            <DatePicker
              className="StyledDatePicker"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
            />
            <br />
            {startDate === null && (
              <span className="ErrorMessage">Booking Date is required</span>
            )}
            <br />
            <div className="ButtonContainer">
              <button className="Button" type="submit">
                Submit
              </button>
            </div>
            <div className="condition-footer">
              <a href="#">Terms of Use | </a>
              <span className="privacy-policy"></span>
              <a href="#">Privacy Policy</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
