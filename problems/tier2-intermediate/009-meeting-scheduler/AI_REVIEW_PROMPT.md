# AI Code Review — Meeting Room Scheduler

## Context for the AI
You are reviewing a solution to "Meeting Room Scheduler" — an LLD interview problem testing Strategy + Observer patterns with Interval Checking + HashMap + Priority Queue data structures. This was asked at Flipkart, Razorpay, Groww, Microsoft.

The candidate was given a multi-part problem:
- Part 1: Base — Room booking with conflict detection (interval overlap checking)
- Part 2: Extension 1 — Multiple room allocation strategies (first-available, smallest-fit, priority-based)
- Part 3: Extension 2 — Attendee notifications via Observer pattern when meetings are booked/cancelled

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for room allocation?
- Is the Observer pattern implemented correctly for attendee notifications?
- Are the interfaces clean and minimal?

### 2. Open/Closed Principle
- Can a new allocation strategy be added without modifying the scheduler?
- Does the design survive both extension requirements?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (Interval checking logic, HashMap for room/meeting lookup, Priority Queue for allocation)

### 4. Extension Handling
- How well does the base design absorb Part 2 (allocation strategies) and Part 3 (notifications)?
- What had to change? What survived?
- Was the extension natural or forced?

### 5. Interview Readiness
- Could the candidate explain this design verbally?
- What follow-up questions would expose weak understanding?
- Rate: Hire / Lean Hire / Lean No Hire / No Hire

## My Solution

```cpp
// PASTE YOUR SOLUTION HERE
```

## My Approach
<!-- Describe your thought process in 2-3 sentences -->

## Specific Questions
<!-- Ask the AI anything specific about your solution -->
