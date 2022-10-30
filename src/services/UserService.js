import http from '../http/http-common';
import authHeader from './authHeader';

class UserDataService {
  getAll(params) {
    return http.get('/users', { params }, { headers: authHeader() });
  }
  get(id) {
    return http.get(`/users/${id}`, { headers: authHeader() });
  }
  create(data, profile) {
    return http.post('/users', { data, profile }, { headers: authHeader() });
  }
  update(id, data, profile) {
    return http.put(`/users/${id}`, { data, profile }, { headers: authHeader() });
  }
  updatePablished(id, data) {
    return http.put(`/users/${id}`, { data }, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/users/${id}`, { headers: authHeader() });
  }
  findByValue(value) {
    return http.get(`/users?value=${value}`, { headers: authHeader() });
  }
  findUser(params) {
    return http.get(`/users/published`, { params }, { headers: authHeader() });
  }
  getAllDoctors() {
    return http.get(`/users/doctors`, { headers: authHeader() });
  }
}

export default new UserDataService();
