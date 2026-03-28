# AI Code Review — Vending Machine

## Context for the AI
You are reviewing a solution to "Vending Machine" — an LLD interview problem testing State pattern with HashMap data structures. This was asked at Amazon, Flipkart.

The candidate was given a multi-part problem:
- Part 1: Base — State transitions (idle, coin inserted, dispensing) with proper transition enforcement
- Part 2: Extension 1 — Maintenance mode as an additional state with restricted transitions

## Review Criteria

### 1. Pattern Correctness
- Is the State pattern implemented correctly?
- Are all transitions handled by State classes, not leaked into VendingMachine as conditionals?
- Is the state interface clean and minimal?

### 2. Open/Closed Principle
- Can a new state be added without modifying existing state classes?
- Does the design survive the maintenance mode extension?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers — are states created/deleted on each transition or reused?)
- Const correctness
- Move semantics where appropriate
- STL usage (HashMap for product inventory)

### 4. Extension Handling
- How well does the base design absorb Part 2 (maintenance mode)?
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
