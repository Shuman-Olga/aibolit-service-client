import http from '../http/http-common';
import authHeader from './authHeader';

class PriceDataService {
  getAll(params) {
    return http.get('/prices', { params }, { headers: authHeader() });
  }
  get(id) {
    return http.get(`/prices/${id}`, { headers: authHeader() });
  }
  create(data) {
    return http.post('/prices', { data }, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/prices/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/prices/${id}`, { headers: authHeader() });
  }

  findPrice() {
    return http.get(`/prices/published`, { headers: authHeader() });
  }
}

export default new PriceDataService();
