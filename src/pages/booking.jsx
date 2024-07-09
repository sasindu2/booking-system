import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  
  background-color: white;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  color: black;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);


  @media (max-width: 600px) {
    padding: 10px;
    max-width: 100%;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    border-color: #4caf50;
  }
    @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px;
  }

`;

const Button = styled.button`
  padding: 10px;
  
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const UserForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [startDate, setStartDate] = React.useState(null);

  const onSubmit = (data) => {
    data.bookingDate = startDate;
    console.log(data);
  };

  return (
    <PageContainer>
    <FormContainer>
      <h1>St'anns service</h1>
      <h2>Book your vehicle</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>User Name</label>
        <Input
          type="text"
          {...register('userName', { required: true })}
        />
        <br></br>
        {errors.userName && <ErrorMessage>User Name is required</ErrorMessage>}
        <br></br>
        <label>Vehicle Number</label>
        <Input
          type="text"
          {...register('vehicleNumber', { required: true })}
          placeholder="ex, ABC-1234"
        />
        <br></br>
        {errors.vehicleNumber && <ErrorMessage>Vehicle Number is required</ErrorMessage>}
        <br></br>
        <label>Phone Number</label>
        <Input
          type="tel"
          {...register('phoneNumber', { required: true, pattern: /^[0-9]{10}$/ })}
        />
        <br></br>
        {errors.phoneNumber && <ErrorMessage>Phone Number is required and should be 10 digits</ErrorMessage>}
        <br></br>
        <label>Booking Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy/MM/dd"
        />
        <br></br>
        {startDate === null && <ErrorMessage>Booking Date is required</ErrorMessage>}
        <br></br>
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
    </PageContainer>
  );
};

export default UserForm;
