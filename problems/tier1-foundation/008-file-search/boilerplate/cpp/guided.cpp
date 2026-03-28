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

// ─── Search Criteria Interface ──────────────────────────────────────────────
// HINT: This interface lets you swap search logic at runtime.
// What method signature would let you check if a file matches a criterion?

class /* YourInterfaceName */ {
public:
    virtual bool /* yourMethodName */(const FileNode* file) const = 0;
    virtual ~/* YourInterfaceName */() = default;
};

// ─── Concrete Search Criteria ───────────────────────────────────────────────
// TODO: Implement a criterion for each search type:
//   - Search by extension (match files with a given extension)
//   - Search by minimum size (match files >= threshold)
//   - Search by name (match files whose name contains a substring)


// ─── Search Engine ──────────────────────────────────────────────────────────
// TODO: Implement a FileSearchEngine class that:
//   - Accepts any search criterion
//   - Has a search() method that traverses the tree using DFS
//   - Returns all files matching the criterion
//   - Does NOT know about specific search criteria

// class FileSearchEngine {
// public:
//     vector<FileNode*> search(FileNode* root, /* what goes here? */);
// };


// ─── Test Entry Points (must exist for tests to compile) ─────────────────────
// Your solution must provide these functions:
//
//   vector<FileNode*> search_by_extension(FileNode* root, const string& ext);
//   vector<FileNode*> search_by_size(FileNode* root, int minSize);
//   vector<FileNode*> search_by_name(FileNode* root, const string& substring);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────

