import axios from 'axios';

export const fetchAlarmCount = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return 0;

  try {
    const response = await axios.get(
      'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('알림 개수 조회 실패:', error);
    return 0;
  }
};
