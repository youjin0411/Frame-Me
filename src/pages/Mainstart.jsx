import React from 'react';
import logo from '../img/frameloginsmall.png';
import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
// import image from '../img/framelogo'
import image2 from '../img/whitelogo.png'
import mainimg from '../img/backimg.png'
import { useNavigate } from "react-router-dom";

function Mainstart(){
  const navigate = useNavigate();
  localStorage.clear();
  function handleClick() {
     navigate("/frame");
     
  }
   return (
	  <body style={{height: '100%', width: '100%',position: 'absolute', backgroundSize: 'cover', backgroundImage: `url(${mainimg})`}}>
<Container>
		 <Nav>
			<Bars />
			<NavMenu>
			   <Logo to='/'>
               <LogoImage src={image2} alt="logo" />
			   </Logo>
			   <Blank/>
			   		<Wrapper>
							<Links href="/frame">PHOTO</Links>
							<Links href="/Gallery">네컷갤러리</Links>
		            </Wrapper>
			   </NavMenu>
		 </Nav>
	  </Container>
		 <div id="backdrop">
				<div id="logo">
					<img src={image2} width="275" height="125" alt="logo"/>
				</div>
				<div id="btnSt" onClick={handleClick}>사진 촬영하기</div>
			</div>
	  </body>
   );
}
const Container = styled.div`
  height: 8%;
  width: 98%;
  margin: 0 auto;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  column-gap: 3%;
  color: white;
  font-size: 1.5vw;
  width: 22%;
`;

const Links = styled.a`
  font-family: "Noto Serif";
  text-decoration: none;
  color: white;
  font-size: 0.7vw;
  width: 27%;
  display: block;
  text-align: center;
  border-radius: 2vw;
  background-blend-mode: overlay;
  background: linear-gradient(297.97deg, rgba(255, 255, 255, 0.15) 6.99%, rgba(255, 255, 255, 0.35) 94.43%);
   box-shadow: 0px 4px 36px rgba(0, 0, 0, 0.05);
   backdrop-filter: blur(15px);
  padding: 0.2vw 0.1vw;
    &:hover {
      transition: all 0.3s;
      border: 0.2vw solid #abbf98;
    }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 8%;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  z-index: 12;
`;

const Logo = styled(Link)`
  color: #000000;
  text-decoration: none;
  margin-top: 1%;
  width: 5%;
  height: auto;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 1%;
`;

const Blank = styled.div`
`
const NavMenu = styled.div`
		display: flex;
    justify-content: space-evenly;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    column-gap: 19%;
`;

const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;
export default Mainstart;