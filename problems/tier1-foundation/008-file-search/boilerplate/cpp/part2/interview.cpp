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

// ─── NEW in Extension 1 ──────────────────────────────────────────────────────
//
// The product team now wants COMPOSITE filters:
// find files that are .cpp AND larger than 100KB, or files that are
// .pdf OR named "report".
//
// Think about:
//   - How do you combine criteria without modifying existing strategies?
//   - What if the product team adds a 4th criterion tomorrow?
//   - Is your Part 1 design extensible enough to handle this?
//
// Entry points (must exist for tests):
//   vector<FileNode*> search_by_extension(FileNode* root, const string& ext);
//   vector<FileNode*> search_by_size(FileNode* root, int minSize);
//   vector<FileNode*> search_by_name(FileNode* root, const string& substring);
//   vector<FileNode*> search_composite(FileNode* root,
//       const vector<SearchCriteria*>& criteria, const string& mode);
//
// ─────────────────────────────────────────────────────────────────────────────


