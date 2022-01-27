/* eslint-disable */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const handleId = (event) => {
    setId(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const onLogin = () => {
    fetch("#", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        password: password,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("jwt", res.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="mt-3">로그인 페이지 입니다.</h1>
      <Container className="loginForm">
        <Form>
          <Form.Group className="mb-3" controlId="FormID">
            <Form.Label>ID</Form.Label>
            <Form.Control
              value={id}
              onChange={handleId}
              type="text"
              placeholder="ID를 입력하세요."
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              value={password}
              onChange={handlePassword}
              type="password"
              placeholder="비밀번호를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <Button variant="primary" type="submit" onClick={onLogin}>
              로그인
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
