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

// ─── NEW in Extension 2 ──────────────────────────────────────────────────────
//
// The product team wants search results SORTED by different strategies:
// alphabetically by name, by file size (largest first), or by extension.
//
// Think about:
//   - How do you decouple search criteria from sort logic?
//   - Is the sort strategy independent of the search strategy?
//   - Can you add a new sort order without touching the search logic?
//
// Entry points (must exist for tests):
//   vector<FileNode*> search_by_extension(FileNode* root, const string& ext);
//   vector<FileNode*> search_by_size(FileNode* root, int minSize);
//   vector<FileNode*> search_by_name(FileNode* root, const string& substring);
//   vector<FileNode*> search_composite(FileNode* root,
//       const vector<SearchCriteria*>& criteria, const string& mode);
//   vector<FileNode*> search_and_sort(FileNode* root,
//       const SearchCriteria& criteria, const string& sortBy);
//
// ─────────────────────────────────────────────────────────────────────────────


