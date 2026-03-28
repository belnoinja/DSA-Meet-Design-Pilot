// Part 1 Tests — File Search System
// Tests the three basic search criteria: extension, size, name

#include "solution.cpp"
#include <cassert>
#include <iostream>
using namespace std;

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // ─── Build test file tree ────────────────────────────────────────────────
    //  project/
    //  ├── src/
    //  │   ├── main.cpp      (50 KB)
    //  │   ├── utils.cpp     (120 KB)
    //  │   └── helper.h      (10 KB)
    //  ├── docs/
    //  │   ├── readme.md     (5 KB)
    //  │   └── report.pdf    (200 KB)
    //  └── build.sh          (2 KB)

    FileNode mainCpp{"main.cpp", 50, "cpp", false, {}};
    FileNode utilsCpp{"utils.cpp", 120, "cpp", false, {}};
    FileNode helperH{"helper.h", 10, "h", false, {}};
    FileNode readmeMd{"readme.md", 5, "md", false, {}};
    FileNode reportPdf{"report.pdf", 200, "pdf", false, {}};
    FileNode buildSh{"build.sh", 2, "sh", false, {}};
    FileNode src{"src", 0, "", true, {&mainCpp, &utilsCpp, &helperH}};
    FileNode docs{"docs", 0, "", true, {&readmeMd, &reportPdf}};
    FileNode root{"project", 0, "", true, {&src, &docs, &buildSh}};

    // Test 1: search_by_extension — find all .cpp files
    try {
        auto results = search_by_extension(&root, "cpp");
        assert(results.size() == 2);
        // Should find main.cpp and utils.cpp (order depends on DFS)
        bool foundMain = false, foundUtils = false;
        for (auto* f : results) {
            if (f->name == "main.cpp") foundMain = true;
            if (f->name == "utils.cpp") foundUtils = true;
        }
        assert(foundMain && foundUtils);
        cout << "PASS test_search_by_extension_cpp" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_extension_cpp" << endl;
        failed++;
    }

    // Test 2: search_by_extension — find .pdf files
    try {
        auto results = search_by_extension(&root, "pdf");
        assert(results.size() == 1);
        assert(results[0]->name == "report.pdf");
        cout << "PASS test_search_by_extension_pdf" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_extension_pdf" << endl;
        failed++;
    }

    // Test 3: search_by_extension — no matches
    try {
        auto results = search_by_extension(&root, "java");
        assert(results.size() == 0);
        cout << "PASS test_search_by_extension_no_match" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_extension_no_match" << endl;
        failed++;
    }

    // Test 4: search_by_size — files >= 100 KB
    try {
        auto results = search_by_size(&root, 100);
        assert(results.size() == 2);
        bool foundUtils = false, foundReport = false;
        for (auto* f : results) {
            if (f->name == "utils.cpp") foundUtils = true;
            if (f->name == "report.pdf") foundReport = true;
        }
        assert(foundUtils && foundReport);
        cout << "PASS test_search_by_size_100" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_size_100" << endl;
        failed++;
    }

    // Test 5: search_by_size — files >= 200 KB (exact match)
    try {
        auto results = search_by_size(&root, 200);
        assert(results.size() == 1);
        assert(results[0]->name == "report.pdf");
        cout << "PASS test_search_by_size_exact" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_size_exact" << endl;
        failed++;
    }

    // Test 6: search_by_name — files containing "main"
    try {
        auto results = search_by_name(&root, "main");
        assert(results.size() == 1);
        assert(results[0]->name == "main.cpp");
        cout << "PASS test_search_by_name_main" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_name_main" << endl;
        failed++;
    }

    // Test 7: search_by_name — files containing "report"
    try {
        auto results = search_by_name(&root, "report");
        assert(results.size() == 1);
        assert(results[0]->name == "report.pdf");
        cout << "PASS test_search_by_name_report" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_by_name_report" << endl;
        failed++;
    }

    // Test 8: empty tree returns empty
    try {
        FileNode emptyRoot{"empty", 0, "", true, {}};
        assert(search_by_extension(&emptyRoot, "cpp").empty());
        assert(search_by_size(&emptyRoot, 10).empty());
        assert(search_by_name(&emptyRoot, "test").empty());
        cout << "PASS test_empty_tree" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_empty_tree" << endl;
        failed++;
    }

    // Test 9: single file tree
    try {
        FileNode singleDir{"root", 0, "", true, {}};
        FileNode singleFile{"test.txt", 30, "txt", false, {}};
        singleDir.children.push_back(&singleFile);
        auto results = search_by_extension(&singleDir, "txt");
        assert(results.size() == 1);
        assert(results[0]->name == "test.txt");
        cout << "PASS test_single_file_tree" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_single_file_tree" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
