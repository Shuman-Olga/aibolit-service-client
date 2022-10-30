import http from '../http/http-common';
import authHeader from './authHeader';

class PatientDataService {
  getAll(params) {
    return http.get('/patients', { params }, { headers: authHeader() });
  }
  getAllParentnow() {
    return http.get('/patients/parentnow', { headers: authHeader() });
  }
  get(id) {
    return http.get(`/patients/${id}`, { headers: authHeader() });
  }
  create(data, parents) {
    return http.post(
      '/patients',
      {
        data,
        parents,
      },
      { headers: authHeader() },
    );
  }
  update(id, data, parents) {
    return http.put(`/patients/${id}`, { data, parents }, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/patients/${id}`, { headers: authHeader() });
  }

  findByValue(value) {
    return http.get(`/patients?value=${value}`, { headers: authHeader() });
  }
  findPatient(params) {
    return http.get(`/patients/published`, { params }, { headers: authHeader() });
  }
}

export default new PatientDataService();
