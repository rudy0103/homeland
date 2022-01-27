import { Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function EditProfile() {
  return (
    <div>
      <h1 className="mt-3">회원정보 수정</h1>
      <Form className="container mypage-form">
        <Form.Group className="mb-3" controlId="formGroupChangeNickname">
          <Form.Label>닉네임 변경</Form.Label>
          <Form.Control type="text" placeholder="닉네임 변경" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCurrentPassword">
          <Form.Label>기존 비밀번호 입력</Form.Label>
          <Form.Control type="password" placeholder="기존 비밀번호 입력" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupNewPassword">
          <Form.Label>새 비밀번호 입력</Form.Label>
          <Form.Control type="password" placeholder="새 비밀번호 입력" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckNewPassword">
          <Form.Label>새 비밀번호 확인</Form.Label>
          <Form.Control type="password" placeholder="새 비밀번호 확인" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCurrentEmail">
          <Form.Label>기존 e-mail</Form.Label>
          <Form.Control type="email" placeholder="기존 e-mail 입력" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupNewEmail">
          <Form.Label>e-mail 변경</Form.Label>
          <Form.Control type="email" placeholder="변경할 e-mail 입력" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckNewEmail">
          <Form.Label>인증코드 입력</Form.Label>
          <InputGroup>
            <Form.Control type="email" placeholder="인증번호 입력" />
            <Button>인증하기</Button>
          </InputGroup>
          <Form.Text className="text-muted">
            이메일 인증을 통해 비밀번호를 찾을 수 있습니다.
          </Form.Text>
        </Form.Group>
        <Form.Group className="d-flex justify-content-between">
          <Form.Text>이메일이 도착하지 않았나요?</Form.Text>
          <Link to="#">다시 보내기</Link>
        </Form.Group>
        <Form.Group className="d-flex justify-content-center mt-3">
          <Button type="submit">확인</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default EditProfile;
