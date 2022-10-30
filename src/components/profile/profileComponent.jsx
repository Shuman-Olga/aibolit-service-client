import React, { useState } from 'react';
import AuthService from '../../services/authService';

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Profile = (props) => {
  const [show, setShow] = useState(false);

  // const currentUser = AuthService.getCurrentUser();
  const logOut = () => {
    AuthService.logout();
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div id="profile">
      {props.currentUser ? (
        <div className="navbar-nav ml-auto">
          <Button variant="link" id="btn-offcanvas" onClick={handleShow}>
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img"
            />
            <p className="fst-italic ">
              {props.currentUser.user.lastname} {props.currentUser.user.firstname}
            </p>
          </Button>
        </div>
      ) : null}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Профиль</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h3>
            <strong>
              {props.currentUser.user.lastname} {props.currentUser.user.firstname}
            </strong>
          </h3>
          <p>
            <strong>Права: </strong> {props.currentUser.role.runame}
          </p>
          <p>
            <strong>Специализация:</strong> {props.currentUser.user.specialization.name}
          </p>
          {/* <p>
            <strong>Всего вызовов:</strong> {currentUser.user.callings.length}
          </p>
          <p>
            <strong>Всего договоров:</strong> {currentUser.user.contracts.length}
          </p> */}
          <p>{props.currentUser.accessToken.substr(props.currentUser.accessToken.length - 20)}</p>
          <p>
            <strong>Id:</strong> {props.currentUser.id}
          </p>
          <p>
            <strong>Email:</strong> {props.currentUser.email}
          </p>

          <a href="/" className="nav-link" onClick={logOut}>
            <Button variant="outline-success">Выход</Button>
          </a>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
export default Profile;
