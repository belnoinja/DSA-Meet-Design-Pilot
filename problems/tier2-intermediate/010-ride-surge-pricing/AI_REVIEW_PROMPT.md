# AI Code Review — Ride Surge Pricing Engine

## Context for the AI
You are reviewing a solution to "Ride Surge Pricing Engine" — an LLD interview problem testing Strategy + Observer patterns with Priority Queue data structures. This was asked at Uber, Ola.

The candidate was given a multi-part problem:
- Part 1: Base — Surge multiplier calculation based on supply/demand ratio using pluggable strategies
- Part 2: Extension 1 — Surge notifications via Observer pattern when multiplier changes

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for surge calculation algorithms?
- Is the Observer pattern implemented correctly for surge change notifications?
- Are calculation strategy and notification mechanism cleanly separated?

### 2. Open/Closed Principle
- Can a new surge calculation strategy be added without touching existing code?
- Does the design survive the notification extension?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (Priority Queue for demand/supply management)

### 4. Extension Handling
- How well does the base design absorb Part 2 (surge notifications)?
- What had to change? What survived?
- Was the extension natural or forced?
- Edge cases: What happens when supply = 0? When demand = 0?

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
