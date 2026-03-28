# AI Code Review — File Search System

## Context for the AI
You are reviewing a solution to "File Search System" — an LLD interview problem testing Strategy + Composite patterns with Tree (DFS/BFS) data structures. This was asked at Amazon, Microsoft.

The candidate was given a multi-part problem:
- Part 1: Base — Search files by a single criterion (name, extension, size)
- Part 2: Extension 1 — Combine search criteria with AND/OR composite filters
- Part 3: Extension 2 — Sort search results independently using pluggable sort strategies

## Review Criteria

### 1. Pattern Correctness
- Is the Strategy pattern implemented correctly for search criteria?
- Is the Composite pattern applied correctly for AND/OR filter combinations?
- Are the interfaces clean and minimal?

### 2. Open/Closed Principle
- Can a new search criterion be added without modifying existing classes?
- Does the design survive the composite filter and sort extensions?

### 3. C++ Quality
- Memory management (raw pointers vs smart pointers)
- Const correctness
- Move semantics where appropriate
- STL usage (Tree traversal with DFS/BFS, appropriate containers for file storage)

### 4. Extension Handling
- How well does the base design absorb Part 2 (AND/OR composites) and Part 3 (sort strategies)?
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
