#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct FileNode {
    string name;          // "main.cpp", "docs", "report.pdf"
    int size;             // file size in KB (0 for directories)
    string extension;     // "cpp", "pdf", "" (empty for directories)
    bool isDirectory;     // true for folders, false for files
    vector<FileNode*> children;  // non-empty only for directories
};

// ─── Your Design Starts Here ─────────────────────────────────────────────────
//
// Design and implement a FileSearchEngine that:
//   1. Traverses a file tree using DFS
//   2. Returns files matching a given search criterion
//   3. Allows new search criteria to be added WITHOUT modifying
//      the engine itself
//
// Think about:
//   - What abstraction lets you swap search logic at runtime?
//   - How would you add a 4th search criterion with zero changes
//     to existing code?
//   - How do you traverse a tree structure recursively?
//
// Entry points (must exist for tests):
//   vector<FileNode*> search_by_extension(FileNode* root, const string& ext);
//   vector<FileNode*> search_by_size(FileNode* root, int minSize);
//   vector<FileNode*> search_by_name(FileNode* root, const string& substring);
//
// ─────────────────────────────────────────────────────────────────────────────


