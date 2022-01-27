/* eslint-disable */
import "./App.css";
import Room from "./Room.js";
import Notice from "./Notice.js";
import Login from "./Login";
import Logout from "./Logout";
import Signup from "./Signup";
import Mypage from "./Mypage";
import Main from "./Main";
import Test from "./Test";
import EditProfile from "./EditProfile";

import IMG from "./img/a.png";
import React, { useContext, useState, lazy, Suspense } from "react";
import {
  Button,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Carousel,
  Row,
  Col,
} from "react-bootstrap";
import { Link, Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand eventKey="link-0" as={Link} to="/">
            HomeLanDrink
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link eventKey="link-1" as={Link} to="/notice">
                공지사항
              </Nav.Link>
              <Nav.Link eventKey="link-2" as={Link} to="/room">
                참가
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link eventKey="link-3" as={Link} to="/login">
                로그인
              </Nav.Link>
              <Nav.Link eventKey="link-4" as={Link} to="/logout">
                로그아웃
              </Nav.Link>
              <Nav.Link eventKey="link-5" as={Link} to="/signup">
                회원가입
              </Nav.Link>
              <Nav.Link eventKey="link-6" as={Link} to="/mypage">
                마이페이지
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Route path="/editProfile">
        <EditProfile></EditProfile>
      </Route>
      <Route exact path="/">
        <Main></Main>
      </Route>
      <Route path="/notice">
        <Notice></Notice>
      </Route>
      <Route path="/room">
        <Room></Room>
      </Route>
      <Route path="/login">
        <Login></Login>
      </Route>
      <Route path="/logout">
        <Logout></Logout>
      </Route>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <Route path="/mypage">
        <Mypage></Mypage>
      </Route>
      <Route path="/test">
        <Test></Test>
      </Route>
    </div>
  );
}

export default App;
