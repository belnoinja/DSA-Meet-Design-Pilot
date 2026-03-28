# AI Code Review — Payment Method Ranker

## Context for the AI
You are reviewing a solution to "Payment Method Ranker" — an LLD interview problem testing Strategy + Comparator patterns with Sorting data structures. This was asked at Amazon, Flipkart.

The candidate was given a multi-part problem:
- Part 1: Base — Rank payment methods by a single criteria (e.g., cashback, speed)
- Part 2: Extension 1 — Composite ranking that combines multiple criteria with weights
- Part 3: Extension 2 — Easy-refund eligibility filtering before ranking

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for ranking criteria?
- Is the Comparator interface clean and minimal?
- Are concrete ranking strategies properly separated from the ranker?

### 2. Open/Closed Principle
- Can a new ranking strategy be added without modifying existing classes?
- Does the design survive the composite ranking extension?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (appropriate containers and algorithms, e.g., std::sort with custom comparators)

### 4. Extension Handling
- How well does the base design absorb Part 2 (composite ranking) and Part 3 (eligibility filter)?
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
