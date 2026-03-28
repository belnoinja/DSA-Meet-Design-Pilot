# AI Code Review — API Rate Limiter

## Context for the AI
You are reviewing a solution to "API Rate Limiter" — an LLD interview problem testing Strategy + Factory patterns with Queue + HashMap data structures. This was asked at Amazon, Razorpay, Uber.

The candidate was given a multi-part problem:
- Part 1: Base — Fixed-window rate limiting for API endpoints
- Part 2: Extension 1 — Multiple rate-limiting algorithms per endpoint (fixed-window, sliding-window, token-bucket)
- Part 3: Extension 2 — User tier-based rate limits (free, premium, enterprise)

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for rate-limiting algorithms?
- Is the Factory pattern used appropriately for creating limiters?
- Are the interfaces clean and minimal?

### 2. Open/Closed Principle
- Can a new rate-limiting algorithm be added without modifying existing classes?
- Does the design survive the multi-algorithm and tier-based extensions?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (Queue for sliding window, HashMap for endpoint/user lookup)

### 4. Extension Handling
- How well does the base design absorb Part 2 (multiple algorithms) and Part 3 (user tiers)?
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
