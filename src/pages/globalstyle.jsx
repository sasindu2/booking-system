import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
   
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }

  h1 {
    text-align: center;
    color: black;
    margin-bottom: 20px;
  }
`;

export default GlobalStyle;
