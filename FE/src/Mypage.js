/* eslint-disable */
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Mypage.css";

function Mypage() {
  const [profile, setProfile] = useState([]);
  const getProfile = async () => {
    const response = await fetch("http://localhost:8080/api/v1/users/me", {
      method: "get",
      headers: setToken(),
    });
    const json = await response.json();
    setProfile(json.data);
  };
  const setToken = () => {
//    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzc2FmeSIsImlzcyI6InNzYWZ5LmNvbSIsImV4cCI6MTY0NDY0MzIzOCwiaWF0IjoxNjQzMzQ3MjM4fQ.HzSVuC-X6aCkKIdzqPdV5pAoMIZrM9hlQH-tYqakCktWo9Yro6HD51wZnQ47WN7lk4uX0M4qTN-CQxUcMbrSAQ",
    };
    return config;
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <h1 className="mt-3">마이페이지</h1>
      <Container>
        <div>id: {profile.id}</div>
        <div>닉네임: {profile.nickname}</div>
        <div>이메일: {profile.email}</div>
      </Container>
      <Link to="/editProfile">
        <Button>내 정보 수정</Button>
      </Link>
    </div>
  );
}

export default Mypage;
