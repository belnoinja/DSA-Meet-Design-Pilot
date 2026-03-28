#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <climits>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct Room {
    string id;
    string name;
    int capacity;
    bool hasAV;
};

struct Meeting {
    string id;
    string title;
    int startTime;
    int endTime;
    string roomId;
};

struct Attendee {
    string id;
    string name;
    string email;
};

// ─── NEW in Extension 2 ────────────────────────────────────────────────────
//
// Attendees must be notified when a meeting is booked, cancelled, or
// rescheduled. The scheduler should NOT know about specific notification
// channels (email, SMS, Slack).
//
// Think about:
//   - What interface lets you decouple the scheduler from notification logic?
//   - How does the Observer pattern apply here?
//   - Should every Attendee be an observer, or should there be an adapter?
//
// Entry points (must exist for tests):
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//   string book_with_strategy(const string& meetingId, const string& title,
//       int startTime, int endTime, int attendeeCount);
//   void subscribe_attendee(const string& meetingId, MeetingObserver* observer);
//   bool cancel_meeting(const string& meetingId);
//   bool reschedule_meeting(const string& meetingId, int newStart, int newEnd);
//
// ─────────────────────────────────────────────────────────────────────────────


