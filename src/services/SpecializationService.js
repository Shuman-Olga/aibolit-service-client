import http from '../http/http-common';
import authHeader from './authHeader';

class SpecializationsDataService {
  getAll(params) {
    return http.get('/specializations', { params }, { headers: authHeader() });
  }
  get(id) {
    return http.get(`/specializations/${id}`, { headers: authHeader() });
  }
  create(data) {
    return http.post('/specializations', { data }, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/specializations/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/specializations/${id}`, { headers: authHeader() });
  }
  findByValue(value) {
    return http.get(`/specializations?value=${value}`, { headers: authHeader() });
  }
  findSpec(params) {
    return http.get(`/specializations/published`, { params }, { headers: authHeader() });
  }
}

export default new SpecializationsDataService();
