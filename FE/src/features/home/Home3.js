import { useEffect, useState } from 'react';
import { Container,Row, Col } from "react-bootstrap";
import './Home2.css'


function Home2() {

  return (
<div>
<Container>
  <Row>
    <Col></Col>
    <Col xs={5}><div className='dboxright'>
    <img src="https://line.me/static/16b422b92ad19d0696b896ca95276ac2/bd486/61912b3a659c6234bfe90ed46d683d14.png" width='600vw'></img>
      </div></Col>
    <Col xs={5}>
      설명
    </Col>
    <Col></Col>
  </Row>

</Container>
  </div>

  );
}

export default Home2;