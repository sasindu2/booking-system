import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './booking.css'; 

const UserForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [startDate, setStartDate] = React.useState(null);

  const onSubmit = (data) => {
    data.bookingDate = startDate;
    console.log(data);
  };

  return (
    <div className="PageContainer">
      <div className="FormContainer">
        <h1>St'anns service</h1>
        <h2>Book your vehicle</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='InputContainer'>User Name</label>
          
          <input
            className="Input"
            type="text"
            {...register('userName', { required: true })}
          />
          {errors.userName && <span className="ErrorMessage">User Name is required</span>}
          <br />
          <label className='InputContainer'>Vehicle Number</label>
          <input
            className="Input"
            type="text"
            {...register('vehicleNumber', { required: true })}
            placeholder="ex, ABC-1234"
          />
          {errors.vehicleNumber && <span className="ErrorMessage">Vehicle Number is required</span>}
          <br />
          <label className='InputContainer'>Phone Number</label>
          <input
            className="Input"
            type="tel"
            {...register('phoneNumber', { required: true, pattern: /^[0-9]{10}$/ })}
          />
          {errors.phoneNumber && <span className="ErrorMessage">Phone Number is required and should be 10 digits</span>}
          <br />
          <label className='InputContainer'>Booking Date</label>
          <DatePicker
            className="StyledDatePicker"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
          />
          <br />
          {startDate === null && <span className="ErrorMessage">Booking Date is required</span>}
          <br />
          <div className="ButtonContainer">
            <button className="Button" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
