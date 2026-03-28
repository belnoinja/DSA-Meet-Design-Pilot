# Design Walkthrough — File Search System

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **two moving parts**: the search criterion and the file tree traversal. The tree traversal (DFS) is stable — it always walks the entire tree. The search criterion varies per use case.

The Strategy pattern isolates the varying part (the filter). The Composite pattern lets you build a tree of filters (AND/OR combinations).

```
FileSearchEngine (stable — DFS traversal)
    └── SearchCriteria (interface — stable)
            ├── SearchByExtension  ← changes independently
            ├── SearchByMinSize    ← changes independently
            ├── SearchByName       ← changes independently
            ├── AndFilter          ← composes other criteria
            └── OrFilter           ← composes other criteria
```

Adding a 4th search criterion doesn't touch FileSearchEngine or any existing criterion. **This is Open/Closed Principle in action.**

---

## Reference Implementation

```cpp
#include <vector>
#include <algorithm>
#include <string>

struct FileNode {
    std::string name;
    int size;
    std::string extension;
    bool isDirectory;
    std::vector<FileNode*> children;
};

// ─── Strategy Interface ─────────────────────────────────────────────────────

class SearchCriteria {
public:
    virtual bool matches(const FileNode* file) const = 0;
    virtual ~SearchCriteria() = default;
};

// ─── Concrete Strategies ────────────────────────────────────────────────────

class SearchByExtension : public SearchCriteria {
    std::string ext;
public:
    SearchByExtension(const std::string& e) : ext(e) {}
    bool matches(const FileNode* file) const override {
        return !file->isDirectory && file->extension == ext;
    }
};

class SearchByMinSize : public SearchCriteria {
    int minSize;
public:
    SearchByMinSize(int s) : minSize(s) {}
    bool matches(const FileNode* file) const override {
        return !file->isDirectory && file->size >= minSize;
    }
};

class SearchByName : public SearchCriteria {
    std::string substring;
public:
    SearchByName(const std::string& s) : substring(s) {}
    bool matches(const FileNode* file) const override {
        return file->name.find(substring) != std::string::npos;
    }
};

// ─── Search Engine (DFS traversal) ──────────────────────────────────────────

class FileSearchEngine {
    void dfs(FileNode* node, const SearchCriteria& criteria, std::vector<FileNode*>& results) {
        if (!node) return;
        if (!node->isDirectory && criteria.matches(node)) {
            results.push_back(node);
        }
        for (auto* child : node->children) {
            dfs(child, criteria, results);
        }
    }
public:
    std::vector<FileNode*> search(FileNode* root, const SearchCriteria& criteria) {
        std::vector<FileNode*> results;
        dfs(root, criteria, results);
        return results;
    }
};
```

---

## Extension 1: Composite Filters (AND/OR)

```cpp
class AndFilter : public SearchCriteria {
    std::vector<SearchCriteria*> criteria;
public:
    AndFilter(const std::vector<SearchCriteria*>& c) : criteria(c) {}
    bool matches(const FileNode* file) const override {
        for (auto* c : criteria) {
            if (!c->matches(file)) return false;
        }
        return true;
    }
};

class OrFilter : public SearchCriteria {
    std::vector<SearchCriteria*> criteria;
public:
    OrFilter(const std::vector<SearchCriteria*>& c) : criteria(c) {}
    bool matches(const FileNode* file) const override {
        for (auto* c : criteria) {
            if (c->matches(file)) return true;
        }
        return false;
    }
};
```

The key insight: `AndFilter` and `OrFilter` *are* `SearchCriteria`. They compose other criteria. This is the Composite pattern — a composite object implements the same interface as its leaves.

---

## Extension 2: Sort Results

```cpp
class SortStrategy {
public:
    virtual bool compare(const FileNode* a, const FileNode* b) const = 0;
    virtual ~SortStrategy() = default;
};

class SortByName : public SortStrategy {
public:
    bool compare(const FileNode* a, const FileNode* b) const override {
        return a->name < b->name;
    }
};

class SortBySize : public SortStrategy {
public:
    bool compare(const FileNode* a, const FileNode* b) const override {
        return a->size > b->size;  // largest first
    }
};

class SortByExtension : public SortStrategy {
public:
    bool compare(const FileNode* a, const FileNode* b) const override {
        return a->extension < b->extension;
    }
};
```

The sort strategy is completely independent of the search criteria. You can mix any search filter with any sort order.

---

## What interviewers look for

1. **Did you name the patterns?** Say "Strategy pattern for search criteria" and "Composite pattern for AND/OR filters".
2. **Did you separate traversal from filtering?** The engine does DFS; the criteria decides what matches.
3. **Is your engine closed for modification?** Adding a new criterion shouldn't touch `FileSearchEngine`.
4. **Do you understand tree traversal?** DFS is the natural choice for a file system tree.
5. **Can you compose filters?** AND/OR filters that themselves implement `SearchCriteria` show mastery of the Composite pattern.

---

## Common interview follow-ups

- *"What if the file tree is very deep?"* → Consider BFS or iterative DFS to avoid stack overflow
- *"What if you wanted to search directories too?"* → Remove the `!isDirectory` check or make it configurable
- *"How would you add a regex-based name search?"* → New `SearchByRegex` class, zero changes to engine
- *"What about NOT filters?"* → A `NotFilter` wrapping any `SearchCriteria`, negating its result
