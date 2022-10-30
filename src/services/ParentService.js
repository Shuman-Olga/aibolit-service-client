import http from '../http/http-common';
import authHeader from './authHeader';

class ParentDataService {
  // getAll() {
  //   return http.get('/parents', { headers: authHeader() });
  // }
  // get(id) {
  //   return http.get(`/parents/${id}`, { headers: authHeader() });
  // }
  // create(data) {
  //   return http.post('/parents', { data }, { headers: authHeader() });
  // }
  update(id, data) {
    return http.put(`/parents/${id}`, data, { headers: authHeader() });
  }
  // delete(id) {
  //   return http.delete(`/parents/${id}`, { headers: authHeader() });
  // }
  // deleteAll() {
  //   return http.delete(`/patients`);
  // }
  // findByValue(value) {
  //   return http.get(`/parents?value=${value}`, { headers: authHeader() });
  // }
  // findPrice() {
  //   return http.get(`/parents/published`, { headers: authHeader() });
  // }
}

export default new ParentDataService();
