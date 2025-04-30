import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

export const fetchAlarmCount = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return 0;

  try {
    const response = await axios.get(`${baseUrl}/v1/alarms`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data;
  } catch (error) {
    console.error('알림 개수 조회 실패:', error);
    return 0;
  }
};
