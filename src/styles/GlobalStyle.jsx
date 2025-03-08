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
--color-main-inactive: #999999; 
--color-badge: #FF647C;

--color-calendar-group-1: #FF5733;
--color-calendar-group-2: #FFC300;
--color-calendar-group-3: #36D1DC;
--color-calendar-group-4: #C70039;
--color-calendar-group-5: #900C3F;
--color-calendar-group-6: #581845;
--color-calendar-group-7: #DAF7A6;
--color-calendar-group-8: #FF33F6;
--color-calendar-group-9: #3382FF;
--color-calendar-group-10: #6AFF33;

--color-todo-1: #A6E22E;
--color-todo-2: #66D9EF;
--color-todo-3: #F92672;
--color-todo-4: #FD971F;
--color-todo-5: #AE81FF;
  }


  body {
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
