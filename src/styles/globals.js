import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

* {
  padding: 0;
  margin: 0;
  outline: none;
  list-style-type: none;
  text-decoration: none;
  box-sizing: border-box; 
}

input,
select {
  -webkit-appearance: none;
  border-radius: 0;
}

button {
  cursor: pointer;
}
img {
  display: block;
}

@font-face {
    font-family: 'gothamextra_light';
    src: url('/fonts/gotham-extralight.woff2') format('woff2'),
         url('/fonts/gotham-extralight.woff') format('woff'),
         url('/fonts/gotham-extralight.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'gotham_light';
    src: url('/fonts/gotham-light.woff2') format('woff2'),
         url('/fonts/gotham-light.woff') format('woff'),
         url('/fonts/gotham-light.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'gothambold';
    src: url('/fonts/gotham-bold.woff2') format('woff2'),
         url('/fonts/gotham-bold.woff') format('woff'),
         url('/fonts/gotham-bold.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'gotham_roundedbook';
    src: url('/fonts/gothamrounded-book.woff2') format('woff2'),
         url('/fonts/gothamrounded-book.woff') format('woff'),
         url('/fonts/gothamrounded-book.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'gotham_roundedbold';
    src: url('/fonts/gothamrounded-bold.woff2') format('woff2'),
         url('/fonts/gothamrounded-bold.woff') format('woff'),
         url('/fonts/gothamrounded-bold.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
`;

export default GlobalStyles;
