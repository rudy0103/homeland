/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import "./Signup.css";
import { Link, Redirect, useHistory } from "react-router-dom";

function Sign() {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const handleId = (event) => {
    setId(event.target.value);
  };
  const handleNickname = (event) => {
    setNickname(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handlePasswordConfirm = (event) => {
    setPasswordConfirm(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit = () => {
    if (password && password === passwordConfirm) {
      fetch("#", {
        method: "POST",
        body: JSON.stringify({
          id: id,
          nickname: nickname,
          password: password,
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          return <Redirect to="/login" />;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("비밀번호와 비밀번호 확인이 서로 다릅니다!");
    }
  };
  return (
    <div>
      <h1 className="mt-3">회원가입</h1>
      <Form className="container signup-form">
        <Form.Group className="mb-3" controlId="formGroupID">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            value={id}
            onChange={handleId}
            type="text"
            placeholder="아이디 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupNickname">
          <Form.Label>닉네임</Form.Label>
          <Form.Control
            value={nickname}
            onChange={handleNickname}
            type="text"
            placeholder="닉네임 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            value={password}
            onChange={handlePassword}
            type="password"
            placeholder="비밀번호 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckPassword">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            value={passwordConfirm}
            onChange={handlePasswordConfirm}
            type="password"
            placeholder="비밀번호 확인"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>e-mail</Form.Label>
          <Form.Control
            value={email}
            onChange={handleEmail}
            type="email"
            placeholder="e-mail 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckEmail">
          <Form.Label>인증코드 입력</Form.Label>
          <InputGroup>
            <Form.Control type="text" placeholder="인증번호 입력" />
            <Button>인증하기</Button>
          </InputGroup>
          <Form.Text className="text-muted">
            가입 이후 이메일 인증을 통해 비밀번호를 찾을 수 있습니다.
          </Form.Text>
        </Form.Group>
        <Form.Group className="d-flex justify-content-between">
          <Form.Text>이메일이 도착하지 않았나요?</Form.Text>
          <Link to="#">다시 보내기</Link>
        </Form.Group>
        <Form.Group className="d-flex justify-content-center mt-3">
          <Button type="submit" onClick={onSubmit}>
            가입하기
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Sign;
