# AI Code Review — Notification System

## Context for the AI
You are reviewing a solution to "Notification System" — an LLD interview problem testing Observer pattern with Queue data structures. This was asked at Flipkart, Swiggy.

The candidate was given a multi-part problem:
- Part 1: Base — Multi-channel notifications (email, SMS, push) via observer pattern
- Part 2: Extension 1 — Priority filtering so subscribers only receive notifications above their threshold

## Review Criteria

### 1. Pattern Correctness
- Is the Observer pattern implemented correctly?
- Is the event bus / notification manager truly decoupled from concrete handlers?
- Are subscribers notified in a clean, extensible way?

### 2. Open/Closed Principle
- Can a new notification channel be added without modifying the event bus?
- Does the design survive the priority filtering extension?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (appropriate containers — consider efficiency of subscriber storage and lookup)

### 4. Extension Handling
- How well does the base design absorb Part 2 (priority filtering)?
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
