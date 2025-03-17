//유저id U3, 김하진에게 온 알림
[
  // 1. 내가 언급되지 않은 일정이 새로 추가된 → event_added
  {
    userId: 'U3',
    eventId: 'U1-S20250310143520',
    type: 'event_added',
    isRead: false,
  },

  // 2. 내가 언급된 일정이 새로 추가된 → event_mentioned
  {
    userId: 'U3',
    eventId: 'U3-S20250304132055',
    type: 'event_mentioned',
    isRead: false,
  },

  // 3. 일정이 삭제된 → event_deleted
  {
    userId: 'U3',
    eventId: 'U3-S20250304132055',
    type: 'event_deleted',
    isRead: false,
  },

  // 4. 일정이 수정된 → event_updated
  {
    userId: 'U3',
    eventId: 'U3-S20250304132055',
    type: 'event_updated',
    isRead: false,
  },

  // 5. 캘린더에 새로운 멤버가 들어온 → member_added
  {
    userId: 'U3',
    calendarId: 'Group-Club1',
    type: 'member_added',
    isRead: false,
  },

  // 6. 내가 새로운 캘린더(스터디 그룹)에 초대된 → member_invited
  {
    userId: 'U3',
    calendarId: 'Group-Study1',
    type: 'member_invited',
    isRead: false,
  },

  // 7. 일정이 시작되는 → event_started
  {
    userId: 'U3',
    eventId: 'U3-S20250304132055',
    type: 'event_started',
    isRead: false,
  },
];
