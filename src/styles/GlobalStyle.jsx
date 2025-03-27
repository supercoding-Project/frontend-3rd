import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
--font-xxl: 30px; 
--font-xl: 22px; 
--font-lg: 18px; 
--font-md: 16px; 
--font-sm: 12px; 
--font-xs: 9px;  

--color-text-primary: #000000; 
--color-text-secondary: #ffffff; 
--color-text-disabled: #999999; 

--color-border: #D9D9D9;

--color-bg-primary: #F5F5F5;
--color-bg-hover: #F1F1F1;

--color-main-active: #6A79F8; 
--color-main-active-light: #6A79F810; 
--color-main-inactive: #999999; 
--color-badge: #FF647C;

--color-calendar-1: #E36B15;
--color-calendar-1-light: #E36B1520;
--color-calendar-2: #F5A623;
--color-calendar-2-light: #F5A62320;
--color-calendar-3: #17A589;
--color-calendar-3-light: #17A58920;
--color-calendar-4: #145A32;
--color-calendar-4-light: #145A3220;
--color-calendar-5: #1F7A8C;
--color-calendar-5-light: #1F7A8C20;
--color-calendar-6: #3B5998;
--color-calendar-6-light: #3B599820;
--color-calendar-7: #AE81FF;
--color-calendar-7-light: #AE81FF20;
--color-calendar-8: #7D3C98;
--color-calendar-8-light: #7D3C9820;
--color-calendar-9: #5D6D7E;
--color-calendar-9-light: #5D6D7E20;
--color-calendar-10: #6E2C00;
--color-calendar-10-light: #6E2C0020;

  }


  body, button, input {
    font-size: var(--font-lg);
    color: var(--color-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
        "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
        "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    sans-serif;
  font-weight: 300;
  }
`;

export default GlobalStyle;
