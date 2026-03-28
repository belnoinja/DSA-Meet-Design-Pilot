# AI Code Review — Customer Issue Resolution System

## Context for the AI
You are reviewing a solution to "Customer Issue Resolution System" — an LLD interview problem testing Strategy + Observer patterns with HashMap + Priority Queue data structures. This was asked at PhonePe, Flipkart.

The candidate was given a multi-part problem:
- Part 1: Base — Round-robin agent assignment for incoming customer issues
- Part 2: Extension 1 — Multiple assignment strategies (round-robin, least-loaded, priority-based)
- Part 3: Extension 2 — Issue state tracking with priority escalation and observer notifications

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for assignment algorithms?
- Is the Observer pattern correct for state change notifications?
- Are the interfaces clean and minimal?

### 2. Open/Closed Principle
- Can a new assignment strategy be added without modifying existing classes?
- Does the design survive both extension requirements?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (HashMap for agent/issue lookup, Priority Queue for escalation)

### 4. Extension Handling
- How well does the base design absorb Part 2 (multiple strategies) and Part 3 (state tracking + priority)?
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
