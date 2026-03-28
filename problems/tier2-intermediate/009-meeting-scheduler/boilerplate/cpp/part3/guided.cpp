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

// ─── Observer Interface ─────────────────────────────────────────────────────
// HINT: The scheduler notifies all subscribed observers on booking/cancel/reschedule.
// The scheduler does NOT know about email, SMS, or Slack — only this interface.

class MeetingObserver {
public:
    virtual void onMeetingBooked(const Meeting& meeting) = 0;
    virtual void onMeetingCancelled(const Meeting& meeting) = 0;
    virtual void onMeetingRescheduled(const Meeting& oldMeeting,
                                      const Meeting& newMeeting) = 0;
    virtual ~MeetingObserver() = default;
};

// ─── Forward declaration ────────────────────────────────────────────────────

class MeetingScheduler;

// ─── Strategy Interface ─────────────────────────────────────────────────────

class AllocationStrategy {
public:
    virtual string selectRoom(const vector<Room>& rooms,
                              const MeetingScheduler& scheduler,
                              int startTime, int endTime,
                              int attendeeCount) = 0;
    virtual ~AllocationStrategy() = default;
};

// ─── Scheduler (extend your Part 2 solution) ────────────────────────────────
// HINT: Add:
//   - unordered_map<string, vector<MeetingObserver*>> observers (meetingId -> observers)
//   - unordered_map<string, Meeting> meetingsById (for cancel/reschedule lookup)
//   - subscribeAttendee(), cancelMeeting(), rescheduleMeeting()
//   - Notify observers inside bookMeeting(), cancelMeeting(), rescheduleMeeting()

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//   string book_with_strategy(const string& meetingId, const string& title,
//       int startTime, int endTime, int attendeeCount);
//   void subscribe_attendee(const string& meetingId, MeetingObserver* observer);
//   bool cancel_meeting(const string& meetingId);
//   bool reschedule_meeting(const string& meetingId, int newStart, int newEnd);
// ─────────────────────────────────────────────────────────────────────────────


