import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/aibolit_logo_end1.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = (props) => {
  return (
    <Navbar id="navbar" collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">
          {' '}
          <img src={logo} alt="" height="50" className="d-inline-block align-text-top" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {(props.showDoctor || props.showAdmin || props.showDirector) && (
              <>
                <Nav.Link as={Link} to={'/'}>
                  {' '}
                  Вызовы
                </Nav.Link>
                <Nav.Link as={Link} to={'/user/contracts'}>
                  Договоры
                </Nav.Link>
              </>
            )}
            {(props.showAdmin || props.showDirector) && (
              <>
                <Nav.Link as={Link} to={'/user/patients'}>
                  {' '}
                  Пациенты
                </Nav.Link>
                <Nav.Link as={Link} to={'/user/staff'}>
                  Сотрудники
                </Nav.Link>
                <Nav.Link as={Link} to={'/user/prices'}>
                  {' '}
                  Услуги
                </Nav.Link>
                <Nav.Link as={Link} to={'/user/specializations'}>
                  Специализация
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
