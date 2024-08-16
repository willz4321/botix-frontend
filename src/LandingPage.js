import React from 'react';
import { Navbar, Nav, Container, Carousel, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <Navbar className='navbar botix_nav' expand="lg">
        <Container>
          <Row className='w-100'>
            <Col className='d-flex justify-content-between align-items-center'>
              <Navbar.Brand href="#">
                <img src="/FaviconBTW.svg" className='Favicon'/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav ">
                <Nav className="ms-auto nav-options">
                  <Nav.Link className='options_nav' href="#">Inicio</Nav.Link>
                  <Nav.Link className='options_nav' href="sobre-nosotros">Sobre Nosotros</Nav.Link>
                  <Nav.Link className='options_nav' href="planes">Planes</Nav.Link>
                  <Nav.Link className='options_nav' href="login">Iniciar Sesión</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/media/image/Banner nuevos paquetes de lanzamiento.png"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/media/image/Banner agenda una demostración gratuita.png"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/media/image/Banner nuevos paquetes de lanzamiento.png"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <Container className="container-fluid">
        <Row>
          <Col md={6} className="text-column position-relative m-0">
            <img src="/media/image/Texto principal (Transforma la atención al cliente con nuestro chatbot) con descripción.png" alt="Descripción de la imagen" className="responsive-image"/>
            <Button className="cta-button" href="#">Solicita Demostración Gratuita.</Button>
          </Col>
          <Col md={6} className="image-column">
            <img src="/media/image/elemento celular agentes.png" alt="Descripción de la imagen" className="responsive-image p-5"/>
          </Col>
        </Row>
      </Container>
      <Container className="container-fluid justify-center pb-3">
        <Col md={7} className="image-column ms-auto me-auto">
              <img src="/media/image/Celular whatsAp chatbot.png" alt="Descripción de la imagen" className="responsive-image"/>
        </Col>
      </Container>
      <Container fluid className="p-0">
        <Row noGutters>
          <Col xs={12} className="px-0 py-5">
            <img src="/media/image/Mujer pagina1.png" alt="Descripción de la imagen" className="img-full-width"/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LandingPage;
