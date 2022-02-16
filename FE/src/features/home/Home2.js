import { useEffect, useState } from 'react';
import { Container,Row, Col } from "react-bootstrap";
import './Home2.css'


function Home2() {

  return (
<div>
<Container>
  <Row>
    <Col></Col>
    <Col xs={5}>설명</Col>
    <Col xs={5}>
    <div className='dboxleft'>
      <img src="https://line.me/static/5a383cb3cc7f3d63e2483c96eb3ec114/bd486/e75d07a92e15fff9c7a1a9ed0cddc3f9.png" width="600vw"></img>
      </div>
    </Col>
    <Col></Col>
  </Row>

</Container>
  </div>

  );
}

export default Home2;