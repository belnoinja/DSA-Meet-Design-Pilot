#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Structure ──────────────────────────────────────────────────────────

struct FileNode {
    string name;          // "main.cpp", "docs", "report.pdf"
    int size;             // file size in KB (0 for directories)
    string extension;     // "cpp", "pdf", "" (empty for directories)
    bool isDirectory;     // true for folders, false for files
    vector<FileNode*> children;  // non-empty only for directories
};

// ─── Strategy Interface ───────────────────────────────────────────────────────

class SearchCriteria {
public:
    virtual bool matches(const FileNode* file) const = 0;
    virtual ~SearchCriteria() = default;
};

// ─── TODO: Implement Concrete Search Criteria ────────────────────────────────

class SearchByExtension : public SearchCriteria {
    string ext;
public:
    SearchByExtension(const string& e) : ext(e) {}
    bool matches(const FileNode* file) const override {
        // TODO: return true if file has the matching extension
        return false;
    }
};

class SearchByMinSize : public SearchCriteria {
    int minSize;
public:
    SearchByMinSize(int s) : minSize(s) {}
    bool matches(const FileNode* file) const override {
        // TODO: return true if file size >= minSize
        return false;
    }
};

class SearchByName : public SearchCriteria {
    string substring;
public:
    SearchByName(const string& s) : substring(s) {}
    bool matches(const FileNode* file) const override {
        // TODO: return true if file name contains substring
        return false;
    }
};

// ─── TODO: Implement FileSearchEngine ────────────────────────────────────────

class FileSearchEngine {
    void dfs(FileNode* node, const SearchCriteria& criteria, vector<FileNode*>& results) {
        if (!node) return;
        // TODO: if node is a file and matches criteria, add to results
        // TODO: recurse into children
    }
public:
    vector<FileNode*> search(FileNode* root, const SearchCriteria& criteria) {
        vector<FileNode*> results;
        dfs(root, criteria, results);
        return results;
    }
};

// ─── Test Entry Points ───────────────────────────────────────────────────────

vector<FileNode*> search_by_extension(FileNode* root, const string& ext) {
    SearchByExtension criteria(ext);
    return FileSearchEngine().search(root, criteria);
}

vector<FileNode*> search_by_size(FileNode* root, int minSize) {
    SearchByMinSize criteria(minSize);
    return FileSearchEngine().search(root, criteria);
}

vector<FileNode*> search_by_name(FileNode* root, const string& substring) {
    SearchByName criteria(substring);
    return FileSearchEngine().search(root, criteria);
}

// ─── Main (test your implementation) ─────────────────────────────────────────

int main() {
    // Build a small file tree
    FileNode file1{"main.cpp", 50, "cpp", false, {}};
    FileNode file2{"utils.cpp", 120, "cpp", false, {}};
    FileNode file3{"report.pdf", 200, "pdf", false, {}};
    FileNode src{"src", 0, "", true, {&file1, &file2}};
    FileNode root{"project", 0, "", true, {&src, &file3}};

    auto results = search_by_extension(&root, "cpp");
    cout << "Search for .cpp files:\n";
    for (const auto* f : results) {
        cout << "  " << f->name << " (" << f->size << " KB)\n";
    }

    return 0;
}
