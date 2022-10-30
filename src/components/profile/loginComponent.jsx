import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import AuthService from '../../services/authService';
import { required, email } from '../validation/Validation';

const Login = () => {
  const initialData = {
    email: '',
    password: '',
  };
  const form = useRef();
  const checkBtn = useRef();
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleLogin = async (e) => {
    console.log(data);
    e.preventDefault();
    setMessage('');
    setLoading(true);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      await AuthService.login(data)
        .then(() => {
          window.location.reload();
          navigate('/user');
        })
        .catch((e) => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
          setLoading(false);
          setMessage(resMessage);
        });
    } else {
      setLoading(false);
    }
  };
  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <Input
              type="text"
              className="form-control"
              name="email"
              value={data.email}
              onChange={onChange}
              validations={[required, email]}
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="password">
              Пароль
            </label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={data.password}
              onChange={onChange}
              validations={[required]}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <span>Войти</span>
            </button>
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};
export default Login;
