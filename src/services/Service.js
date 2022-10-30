import http from '../http/http-common';
import authHeader from './authHeader';

class DataService {
  getAllRegions() {
    return http.get('/regions', { headers: authHeader() });
  }
  getAllTypeDocuments() {
    return http.get('/typedocs', { headers: authHeader() });
  }
}
export default new DataService();
