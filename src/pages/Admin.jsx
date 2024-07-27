import React from "react";
import GlobalStyle from "./globalstyle";

export default function Admin() {
  return (
    <>
      <GlobalStyle />
      <div>
        <h1>Admin Page</h1>

        <table style={{ color: "black" }}>
          <thead>
            <tr>
              <th>Booking Date</th>
              <th>User Name</th>
              <th>Vehicle Number</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-07-10</td>
              <td>John Doe</td>
              <td>ABC1234</td>
              <td>9876543210</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
