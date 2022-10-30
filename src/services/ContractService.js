import http from '../http/http-common';
import authHeader from './authHeader';

class ContractDataService {
  getAll(params) {
    return http.get('/contracts', { params }, { headers: authHeader() });
  }
  get(id) {
    return http.get(`/contracts/${id}`, { headers: authHeader() });
  }
  create(contract, patient, parent) {
    return http.post(
      '/contracts',
      {
        contract,
        patient,
        parent,
      },
      { headers: authHeader() },
    );
  }
  update(id, contract, patient, parent) {
    return http.put(`/contracts/${id}`, { contract, patient, parent }, { headers: authHeader() });
  }

  findByValue(value) {
    console.log(value);
    return http.get(`/contracts?value=${value}`, { headers: authHeader() });
  }
}

export default new ContractDataService();
