# AI Code Review — Billing & Discount Engine

## Context for the AI
You are reviewing a solution to "Billing & Discount Engine" — an LLD interview problem testing Strategy + Decorator patterns with HashMap data structures. This was asked at Flipkart, Amazon, Meesho.

The candidate was given a multi-part problem:
- Part 1: Base — Apply a single discount type (percentage, flat, buy-X-get-Y)
- Part 2: Extension 1 — Stack multiple discounts using the Decorator pattern
- Part 3: Extension 2 — Discount eligibility rules that gate which discounts can apply

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for individual discount types?
- Is the Decorator pattern applied correctly for discount stacking in Part 2?
- Are the interfaces clean and minimal?

### 2. Open/Closed Principle
- Can a new discount type be added without modifying existing classes?
- Does the design survive discount stacking and eligibility rules?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (HashMap for product/discount lookup)

### 4. Extension Handling
- How well does the base design absorb Part 2 (discount stacking) and Part 3 (eligibility rules)?
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
