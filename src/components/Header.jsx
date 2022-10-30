import React from 'react';
import Navigation from './Navigation';
import Profile from './profile/profileComponent';

const Header = (props) => {
  return (
    <div id="header" className="d-flex justify-content-between">
      <Navigation
        showDoctor={props.showDoctor}
        showAdmin={props.showAdmin}
        showDirector={props.showDirector}
      />
      {!props.currentUser ? null : <Profile currentUser={props.currentUser} />}
    </div>
  );
};
export default Header;
