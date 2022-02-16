import * as React from 'react';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout2';
import TextField from '@mui/material/TextField';
import mg from './stayhome.png'
// import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import { Container,Row, Col } from "react-bootstrap";
import './ProductHero.css'



export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        // backgroundImage: `url(${mg})`,
        backgroundColor: 'rgb(247,235,239)', // Average color of the background image.
        backgroundPosition: 'right',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      {/* <img
        style={{ display: 'none' }}
        src={mg}
        alt="increase priority"
      /> */}
      
      {/* <Typography
        color="black"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        <Container maxWidth="sm">
        <Box sx={{ bgcolor: '', height: '30vh',width:'30vw' }} >
        <div className='dbox'>hihi</div>
        
        <h1>여기내용</h1>
</Box>
      </Container>
      </Typography> */}




<Container>
 
  <Row>

    <Col>
    
    <Typography
        color="black"
        align="center"
        variant="h3"
        sx={{ mb: 2, mt: { sx: 4, sm: 10 } }}
      >
       랜선 술자리   
      </Typography>
      <Typography
        color="black"
        align="center"
        variant="h5"
        sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
      >
         코로나로 집밖에 나가기 힘든지금...<br></br>
         집에서 술자리를 가져봐용
      </Typography>
    
      </Col>
    
    <Col>
    
    <Typography
        color="black"
        align="center"
        variant="h3"
        sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
      >
       {/* 여기다 이미지박아용 */}
       <img src="https://line.me/static/5a383cb3cc7f3d63e2483c96eb3ec114/bd486/e75d07a92e15fff9c7a1a9ed0cddc3f9.png" width="600vw"></img>
      
      </Typography></Col>
  </Row>
</Container>
      
      
    </ProductHeroLayout>
  );
}
