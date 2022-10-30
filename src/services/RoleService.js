import http from '../http/http-common';
import authHeader from './authHeader';

class RoleDataService {
  getAll() {
    return http.get('/roles', { headers: authHeader() });
  }
  //   get(id) {
  //     return http.get(`/patients/${id}`, { headers: authHeader() });
  //   }
  //   create(data) {
  //     return http.post('/patients', data, { headers: authHeader() });
  //   }
  //   update(id, data) {
  //     return http.put(`/patients/${id}`, data, { headers: authHeader() });
  //   }
  //   delete(id) {
  //     return http.delete(`/patients/${id}`, { headers: authHeader() });
  //   }
  //   // deleteAll() {
  //   //   return http.delete(`/patients`);
  //   // }
  //   findByValue(value) {
  //     return http.get(`/patients?value=${value}`, { headers: authHeader() });
  //   }
}

export default new RoleDataService();
