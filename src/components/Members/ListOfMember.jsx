import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCalendar } from '../../context/CalendarContext';
import styled from 'styled-components';

const ListOfMember = () => {
  const { selectedCalendarsForMembers } = useCalendar();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCalendarsForMembers || selectedCalendarsForMembers.length === 0) {
      setMembers([]); // 멤버 목록 초기화
      return; // API 호출을 하지 않음
    }

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const calendarId = Array.isArray(selectedCalendarsForMembers)
          ? selectedCalendarsForMembers[0] // 배열이라면 첫 번째 ID를 사용
          : selectedCalendarsForMembers; // 단일 값이면 그대로 사용

        // calendarId가 정의되어 있는지 확인
        if (!calendarId) {
          throw new Error('유효하지 않은 캘린더 ID입니다.');
        }

        const response = await axios.get(
          `http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendar/${calendarId}/member`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setMembers(response.data.data);
      } catch (error) {
        console.error('멤버 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedCalendarsForMembers]);
  // selectedCalendarsForMembers가 바뀔 때마다 실행

  return (
    <Container>
      <Title>
        멤버 리스트
        <InviteButton>멤버 초대</InviteButton>
      </Title>
      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : members.length > 0 ? (
        <MemberList>
          {members.map((member) => (
            <MemberItem key={member.email}>
              <div>
                <strong>{member.username}</strong>
              </div>
              <Info>
                {member.email} ({member.role})
              </Info>
            </MemberItem>
          ))}
        </MemberList>
      ) : (
        <LoadingText>선택된 캘린더에 멤버가 없습니다.</LoadingText>
      )}
    </Container>
  );
};

export default ListOfMember;

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
`;

const InviteButton = styled.button`
  height: 30px;
  background-color: var(--color-main-active);
  color: white;
  padding: 5px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.01;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const MemberList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
`;

const MemberItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #555;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: #777;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #888;
`;
