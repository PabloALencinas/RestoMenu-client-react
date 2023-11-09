import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {

    getPublicContent(){
        return axios.get(API_URL + 'all');
    }

    getUserBoard(){
        return axios.get(API_URL + 'user', {headers: authHeader()});
    }

    getModeratorBoard(){
        return axios.get(API_URL + 'mod', {headers: authHeader()});
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }

    updateUser(username, password) {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        const token = user.accessToken;
      
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
      
        return axios.post(`${API_URL}user/update/${userId}`, {
          username,
          password,
        }, config)
          .then(response => {
            if (response.data.accessToken) {
              const updatedUser = { ...user, username };
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
          });
     }

    imageUpload = (userId, imageFile) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;
    
      const formData = new FormData();
      formData.append('image', imageFile);
    
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
    
      return axios.post(`${API_URL}/user/${userId}/upload`, formData, config);
    };
    
    updateUserProfileImage = (userId, imageFileName) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;
    
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
    
      const requestData = {
        profileImage: imageFileName
      };
    
      return axios.put(`${API_URL}/user/${userId}/profile-image`, requestData, config);
    };


}

export default new UserService();