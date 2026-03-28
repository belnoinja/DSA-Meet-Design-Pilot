# AI Code Review — Order Management System

## Context for the AI
You are reviewing a solution to "Order Management System" — an LLD interview problem testing State pattern with HashMap data structures. This was asked at Meesho, PhonePe, Amazon.

The candidate was given a multi-part problem:
- Part 1: Base — Order lifecycle with state transitions (placed, confirmed, shipped, delivered)
- Part 2: Extension 1 — Cancellation support with inventory release/rollback
- Part 3: Extension 2 — Transition history tracking for audit trail

## Review Criteria

### 1. Pattern Correctness
- Is the State pattern implemented correctly for order lifecycle?
- Are transitions properly enforced (no invalid state jumps)?
- Is the state interface clean and minimal?

### 2. Open/Closed Principle
- Can a new order state be added without modifying existing state classes?
- Does the design survive cancellation and history tracking extensions?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (HashMap for order lookup, appropriate containers for history)

### 4. Extension Handling
- How well does the base design absorb Part 2 (cancellation + inventory) and Part 3 (transition history)?
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
