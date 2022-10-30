// import axios from 'axios';
import http from '../http/http-common';
// const API_URL = process.env.REACT_APP_API_URL;

class AuthService {
  async login(data) {
    console.log(data);
    const response = await http.post('/login', { data });
    console.log(response.data.accessToken);
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(email, password, role) {
    return http.post('/register', {
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
export default new AuthService();
