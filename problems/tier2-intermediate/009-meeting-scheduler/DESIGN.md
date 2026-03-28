# Design Walkthrough — Meeting Room Scheduler

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

Two orthogonal concerns:
1. **Which room?** — The allocation algorithm varies (first-available, best-fit, priority). This is the Strategy pattern.
2. **Who gets notified?** — Multiple observers (attendees, dashboards, calendars) react to meeting changes. This is the Observer pattern.

The scheduler is the orchestrator. It *uses* a strategy and *is* an observable subject.

```
MeetingScheduler
    ├── AllocationStrategy* (swappable — FirstAvailable / BestFit / PriorityBased)
    ├── unordered_map<roomId, vector<Meeting>> (schedule data)
    └── unordered_map<meetingId, vector<MeetingObserver*>> (subscribers)

bookWithStrategy(title, start, end, count):
    roomId = strategy->selectRoom(rooms, *this, start, end, count)
    if roomId != "":
        bookMeeting({id, title, start, end, roomId})
        notify all observers → onMeetingBooked()
```

---

## Reference Implementation

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <iostream>
using namespace std;

// ─── Data Structures ────────────────────────────────────────────────────────

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

// ─── Scheduler ──────────────────────────────────────────────────────────────

class MeetingScheduler {
    unordered_map<string, Room> rooms;
    unordered_map<string, vector<Meeting>> schedule;
    unordered_map<string, Meeting> meetingsById;
    unordered_map<string, vector<MeetingObserver*>> observers;
    AllocationStrategy* strategy;

public:
    MeetingScheduler() : strategy(nullptr) {}

    void setStrategy(AllocationStrategy* s) { strategy = s; }

    void addRoom(const Room& room) {
        rooms[room.id] = room;
    }

    vector<Room> getAllRooms() const {
        vector<Room> result;
        for (auto& [id, room] : rooms) result.push_back(room);
        sort(result.begin(), result.end(),
             [](const Room& a, const Room& b) { return a.id < b.id; });
        return result;
    }

    bool isAvailable(const string& roomId, int startTime, int endTime) const {
        auto it = schedule.find(roomId);
        if (it == schedule.end()) return true;
        for (auto& m : it->second) {
            if (startTime < m.endTime && m.startTime < endTime) return false;
        }
        return true;
    }

    bool bookMeeting(const Meeting& meeting) {
        if (rooms.find(meeting.roomId) == rooms.end()) return false;
        if (!isAvailable(meeting.roomId, meeting.startTime, meeting.endTime))
            return false;
        schedule[meeting.roomId].push_back(meeting);
        meetingsById[meeting.id] = meeting;
        // Notify observers
        if (observers.count(meeting.id)) {
            for (auto* obs : observers[meeting.id]) {
                obs->onMeetingBooked(meeting);
            }
        }
        return true;
    }

    vector<Meeting> getRoomSchedule(const string& roomId) const {
        auto it = schedule.find(roomId);
        if (it == schedule.end()) return {};
        auto result = it->second;
        sort(result.begin(), result.end(),
             [](const Meeting& a, const Meeting& b) {
                 return a.startTime < b.startTime;
             });
        return result;
    }

    string bookWithStrategy(const string& meetingId, const string& title,
                            int startTime, int endTime, int attendeeCount) {
        if (!strategy) return "";
        auto allRooms = getAllRooms();
        string roomId = strategy->selectRoom(allRooms, *this,
                                             startTime, endTime, attendeeCount);
        if (roomId.empty()) return "";
        Meeting m{meetingId, title, startTime, endTime, roomId};
        if (bookMeeting(m)) return roomId;
        return "";
    }

    void subscribeAttendee(const string& meetingId, MeetingObserver* obs) {
        observers[meetingId].push_back(obs);
    }

    bool cancelMeeting(const string& meetingId) {
        auto it = meetingsById.find(meetingId);
        if (it == meetingsById.end()) return false;
        Meeting meeting = it->second;
        // Remove from schedule
        auto& roomMeetings = schedule[meeting.roomId];
        roomMeetings.erase(
            remove_if(roomMeetings.begin(), roomMeetings.end(),
                      [&](const Meeting& m) { return m.id == meetingId; }),
            roomMeetings.end());
        meetingsById.erase(it);
        // Notify observers
        if (observers.count(meetingId)) {
            for (auto* obs : observers[meetingId]) {
                obs->onMeetingCancelled(meeting);
            }
        }
        return true;
    }

    bool rescheduleMeeting(const string& meetingId, int newStart, int newEnd) {
        auto it = meetingsById.find(meetingId);
        if (it == meetingsById.end()) return false;
        Meeting oldMeeting = it->second;
        // Temporarily remove old meeting to check availability
        auto& roomMeetings = schedule[oldMeeting.roomId];
        roomMeetings.erase(
            remove_if(roomMeetings.begin(), roomMeetings.end(),
                      [&](const Meeting& m) { return m.id == meetingId; }),
            roomMeetings.end());
        if (!isAvailable(oldMeeting.roomId, newStart, newEnd)) {
            // Restore old meeting
            roomMeetings.push_back(oldMeeting);
            return false;
        }
        Meeting newMeeting = oldMeeting;
        newMeeting.startTime = newStart;
        newMeeting.endTime = newEnd;
        roomMeetings.push_back(newMeeting);
        meetingsById[meetingId] = newMeeting;
        // Notify observers
        if (observers.count(meetingId)) {
            for (auto* obs : observers[meetingId]) {
                obs->onMeetingRescheduled(oldMeeting, newMeeting);
            }
        }
        return true;
    }
};

// ─── Concrete Strategies ────────────────────────────────────────────────────

class FirstAvailable : public AllocationStrategy {
public:
    string selectRoom(const vector<Room>& rooms,
                      const MeetingScheduler& scheduler,
                      int startTime, int endTime,
                      int attendeeCount) override {
        for (auto& room : rooms) {
            if (room.capacity >= attendeeCount &&
                scheduler.isAvailable(room.id, startTime, endTime)) {
                return room.id;
            }
        }
        return "";
    }
};

class BestFit : public AllocationStrategy {
public:
    string selectRoom(const vector<Room>& rooms,
                      const MeetingScheduler& scheduler,
                      int startTime, int endTime,
                      int attendeeCount) override {
        string bestId;
        int bestCapacity = INT_MAX;
        for (auto& room : rooms) {
            if (room.capacity >= attendeeCount &&
                scheduler.isAvailable(room.id, startTime, endTime)) {
                if (room.capacity < bestCapacity) {
                    bestCapacity = room.capacity;
                    bestId = room.id;
                }
            }
        }
        return bestId;
    }
};

class PriorityBased : public AllocationStrategy {
public:
    string selectRoom(const vector<Room>& rooms,
                      const MeetingScheduler& scheduler,
                      int startTime, int endTime,
                      int attendeeCount) override {
        // Prefer rooms with AV; among those, pick smallest that fits
        string bestAV, bestNonAV;
        int capAV = INT_MAX, capNonAV = INT_MAX;
        for (auto& room : rooms) {
            if (room.capacity >= attendeeCount &&
                scheduler.isAvailable(room.id, startTime, endTime)) {
                if (room.hasAV && room.capacity < capAV) {
                    capAV = room.capacity;
                    bestAV = room.id;
                } else if (!room.hasAV && room.capacity < capNonAV) {
                    capNonAV = room.capacity;
                    bestNonAV = room.id;
                }
            }
        }
        return bestAV.empty() ? bestNonAV : bestAV;
    }
};
```

---

## What interviewers look for

1. **Interval overlap logic**: Can you correctly detect `start1 < end2 && start2 < end1`? Many candidates get this wrong.
2. **Strategy pattern**: Did you isolate the allocation algorithm behind an interface? Can you add a new strategy without touching the scheduler?
3. **Observer pattern**: Are notifications decoupled from the scheduler? Does the scheduler know about email/SMS/Slack? (It shouldn't.)
4. **Data structure choice**: HashMap for O(1) room lookup. Sorted meetings per room for efficient conflict checking.

---

## Common interview follow-ups

- *"How would you handle recurring meetings?"* — Expand the Meeting struct or generate individual instances with a RecurrenceStrategy.
- *"What if two users try to book the same slot simultaneously?"* — Mutex/lock on the room's schedule; optimistic locking with version checks.
- *"How would you scale this to 10,000 rooms?"* — Interval tree per room for O(log n) conflict checks instead of linear scan.
- *"How would you persist this?"* — Serialize to a database; each room's schedule is a table of intervals.
