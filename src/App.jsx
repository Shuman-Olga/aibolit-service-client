import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './components/profile/loginComponent';
import PricesList from './components/price/PricesList';
import PatientList from './components/patient/PatientList';
import Patient from './components/patient/Patient';
import UsersList from './components/user/UsersList';
import SpecializationsList from './components/specializations/SpecializationsList';
import ContractsList from './components/contracts/ContractsList';
import CallingsList from './components/calling/CallingsList';
import Header from './components/Header';
import AuthService from './services/authService';

const App = () => {
  const [showAdmin, setshowAdmin] = useState(false);
  const [showDoctor, setshowDoctor] = useState(false);
  const [showDirector, setshowDirector] = useState(false);
  const [currentUser, setcurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setcurrentUser(user);
      switch (user.role.name) {
        case 'admin':
          setshowAdmin(true);
          break;
        case 'doctor':
          setshowDoctor(true);
          break;
        case 'director':
          setshowDirector(true);
          break;
        default:
          console.log('No');
          break;
      }
    }
  }, []);
  return (
    <div id="app">
      <div className="container-fluid">
        <Header
          showAdmin={showAdmin}
          showDoctor={showDoctor}
          currentUser={currentUser}
          showDirector={showDirector}
        />
        <Routes>
          {!currentUser ? (
            <Route path="/" element={<Login />} />
          ) : (
            <Route path="/" element={<CallingsList />} />
          )}
          <Route path="/user/staff" element={<UsersList />} />
          <Route path="/user/prices" element={<PricesList />} />
          <Route path="/user/contracts" element={<ContractsList />} />
          <Route path="/user/specializations" element={<SpecializationsList />} />
          <Route path="/user/patients" element={<PatientList />} />
          <Route path="/user/patients/:id" element={<Patient />} />
          <Route path="/user/addpatient" element={<Patient />} />
        </Routes>
      </div>
    </div>
  );
};
export default App;
