import http from '../http/http-common';
import authHeader from './authHeader';

class CallingDataService {
  getAll() {
    return http.get('/callings', { headers: authHeader() });
  }
  // get(id) {
  //   return http.get(`/doctors/${id}`, { headers: authHeader() });
  // }
  create(calling, patient, parent) {
    return http.post('/callings', { calling, patient, parent }, { headers: authHeader() });
  }
  // update(id, data) {
  //   return http.put(`/doctors/${id}`, data, { headers: authHeader() });
  // }
  // delete(id) {
  //   return http.delete(`/doctors/${id}`, { headers: authHeader() });
  // }
  // removeAll() {
  //   return http.delete(`/doctors`);
  // }
  findByValue(value) {
    return http.get(`/callings?value=${value}`, { headers: authHeader() });
  }
}

export default new CallingDataService();
