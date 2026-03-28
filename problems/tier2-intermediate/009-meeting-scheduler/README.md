# Problem 009 — Meeting Room Scheduler

**Tier:** 2 (Intermediate) | **Pattern:** Strategy + Observer | **DSA:** Interval Checking + HashMap + Priority Queue
**Companies:** Flipkart, Razorpay, Groww, Microsoft | **Time:** 60 minutes

---

## Problem Statement

You're building a meeting room booking system for an office. The system must handle room reservations, detect scheduling conflicts, support multiple room allocation strategies, and notify attendees of changes.

**Your task:** Design and implement a `MeetingScheduler` that can book rooms with conflict detection, allocate rooms using swappable strategies, and notify attendees when meetings change.

---

## Before You Code

> Read this section carefully. This is where the design thinking happens.

**Ask yourself:**
1. How do you check whether a new meeting conflicts with existing bookings? What data structure makes this efficient?
2. When the office manager wants to switch from "first available room" to "best-fit room" allocation, should you modify the scheduler? Or should the allocation algorithm be a separate, swappable component?
3. When a meeting is booked, cancelled, or rescheduled, how do all attendees find out? Should the scheduler know about every notification channel?

**The key insight:** Two patterns compose here. **Strategy** handles the "which room?" decision. **Observer** handles the "who gets notified?" concern. The scheduler orchestrates both without implementing either directly.

---

## Data Structures

```cpp
struct Room {
    string id;
    string name;
    int capacity;
    bool hasAV;  // audio-visual equipment
};

struct Meeting {
    string id;
    string title;
    int startTime;  // minutes since midnight (e.g., 540 = 9:00 AM)
    int endTime;
    string roomId;
};

struct Attendee {
    string id;
    string name;
    string email;
};
```

---

## Part 1

**Base requirement — Room booking with conflict detection**

Implement a `MeetingScheduler` that manages rooms and meetings. Two meetings conflict if they overlap on the same room.

**Overlap rule:** Meeting A (start1, end1) and Meeting B (start2, end2) overlap if `start1 < end2 && start2 < end1`.

**Entry points (tests will call these):**
```cpp
bool book_meeting(const Meeting& meeting);
vector<Meeting> get_room_schedule(const string& roomId);
bool is_available(const string& roomId, int startTime, int endTime);
```

**What to implement:**
```cpp
class MeetingScheduler {
    unordered_map<string, Room> rooms;
    unordered_map<string, vector<Meeting>> schedule; // roomId -> meetings
public:
    void addRoom(const Room& room);
    bool bookMeeting(const Meeting& meeting);
    vector<Meeting> getRoomSchedule(const string& roomId);
    bool isAvailable(const string& roomId, int startTime, int endTime);
};
```

**Design goal:** Conflict detection must be correct and efficient. Think about how meetings are stored per room and how you check for overlaps.

---

## Part 2

**Extension 1 — Multiple allocation strategies**

The office manager wants different room allocation policies. Instead of the user picking a room, the system should **automatically select** a room based on a strategy:

| Strategy | Rule |
|----------|------|
| First Available | Pick the first free room (by room ID order) |
| Best Fit | Pick the smallest room (by capacity) that fits the attendee count |
| Priority-Based | Prefer rooms with AV equipment; among those, pick smallest that fits |

**Design challenge:** How do you add a new allocation strategy **without modifying** the scheduler?

**New entry point:**
```cpp
string book_with_strategy(const string& meetingId, const string& title,
                          int startTime, int endTime, int attendeeCount);
// Returns the roomId of the allocated room, or "" if no room available
```

**What to implement:**
```cpp
class AllocationStrategy {
public:
    virtual string selectRoom(const vector<Room>& rooms,
                              const MeetingScheduler& scheduler,
                              int startTime, int endTime,
                              int attendeeCount) = 0;
    virtual ~AllocationStrategy() = default;
};

class FirstAvailable : public AllocationStrategy { ... };
class BestFit        : public AllocationStrategy { ... };
class PriorityBased  : public AllocationStrategy { ... };
```

**Hint:** Each strategy iterates available rooms, filters by time availability, and picks according to its own rule.

---

## Part 3

**Extension 2 — Attendee notifications**

When a meeting is booked, cancelled, or rescheduled, all subscribed attendees must be notified.

**Observer interface:**
```cpp
class MeetingObserver {
public:
    virtual void onMeetingBooked(const Meeting& meeting) = 0;
    virtual void onMeetingCancelled(const Meeting& meeting) = 0;
    virtual void onMeetingRescheduled(const Meeting& oldMeeting,
                                      const Meeting& newMeeting) = 0;
    virtual ~MeetingObserver() = default;
};
```

**New entry points:**
```cpp
void subscribe_attendee(const string& meetingId, MeetingObserver* observer);
void notify_change(const string& meetingId, const string& changeType);
bool cancel_meeting(const string& meetingId);
bool reschedule_meeting(const string& meetingId, int newStart, int newEnd);
```

**Design challenge:** Should every attendee be a concrete observer? Or should there be an `AttendeeNotifier` that adapts the `Attendee` struct into the observer interface? How do you avoid the scheduler knowing about email, SMS, or Slack?

---

## Running Tests

```bash
./run-tests.sh 009-meeting-scheduler cpp
```
