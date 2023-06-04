import styled from 'styled-components';

export const MenuNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  border-left: 1px solid #4771ae;
  margin-left: 20px;
  padding-left: 20px;
  flex: 1;
  @media ${(props) => props.theme.breakpoints.w1000} {
    position: fixed;
    bottom: 10px;
    background: #fff;
    border-radius: 20px;
    width: calc(100% - 30px);
    margin: 0 auto;
    padding: 0;
    z-index: 1;
    left: 0;
    right: 0;
    height: 56px;
    border: 1px solid #7aaff9;
  }
`;

export const MenuContainer = styled.ul`
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 30px;
  @media ${(props) => props.theme.breakpoints.w1000} {
    justify-content: space-between;
    padding: 0 30px;
    gap: 0;
  }
  @media ${(props) => props.theme.breakpoints.w400} {
    padding: 0 10px;
  }
`;
export const MenuItem = styled.li`
  a {
    color: #7aaff9;
    font-size: 16px;
    font-family: ${(props) =>
      props.active ? 'gothambold' : 'gothamextra_light'};
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    padding: 0 0.64px;
    img {
      filter: invert(57%) sepia(6%) saturate(7%) hue-rotate(333deg)
        brightness(87%) contrast(85%);
      display: none;
    }
    @media ${(props) => props.theme.breakpoints.w1000} {
      color: #3766a1;
      img {
        display: flex;
      }
      &::before {
        display: none;
      }
    }
    @media ${(props) => props.theme.breakpoints.w400} {
      padding: 0 10px;
      font-size: 12px;
    }
  }
  ${({ active }) =>
    active &&
    `
        a{
          padding: 0;   
          &::before{
            content: "";
            width: 6px;
            height: 6px;
            background: #7aaff9;
            border-radius: 50%;
            bottom: -6px;
            left: 0;
            right: 0;
            margin: auto;
            position: absolute;        
          }
        img{
          filter: invert(41%) sepia(7%) saturate(4995%) hue-rotate(175deg) brightness(83%) contrast(81%);
        }
        }
      `}
`;
