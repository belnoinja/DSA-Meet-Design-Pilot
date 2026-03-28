// Part 2 Tests — Composite Filters (AND/OR)
// Tests composite search criteria with AND and OR modes

#include <cassert>
#include <iostream>
using namespace std;

// Note: solution.cpp is included via the harness (not directly here)
// These tests assume search_composite() is available

int part2_tests() {
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

    // Test 1: AND filter — .cpp files AND size >= 100
    try {
        SearchByExtension extCriteria("cpp");
        SearchByMinSize sizeCriteria(100);
        auto results = search_composite(&root, {&extCriteria, &sizeCriteria}, "AND");
        assert(results.size() == 1);
        assert(results[0]->name == "utils.cpp"); // only .cpp file >= 100 KB
        cout << "PASS test_and_filter_cpp_and_large" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_and_filter_cpp_and_large" << endl;
        failed++;
    }

    // Test 2: OR filter — .pdf files OR name contains "main"
    try {
        SearchByExtension extCriteria("pdf");
        SearchByName nameCriteria("main");
        auto results = search_composite(&root, {&extCriteria, &nameCriteria}, "OR");
        assert(results.size() == 2);
        bool foundMain = false, foundReport = false;
        for (auto* f : results) {
            if (f->name == "main.cpp") foundMain = true;
            if (f->name == "report.pdf") foundReport = true;
        }
        assert(foundMain && foundReport);
        cout << "PASS test_or_filter_pdf_or_main" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_or_filter_pdf_or_main" << endl;
        failed++;
    }

    // Test 3: AND filter with no matches — .h files AND size >= 50
    try {
        SearchByExtension extCriteria("h");
        SearchByMinSize sizeCriteria(50);
        auto results = search_composite(&root, {&extCriteria, &sizeCriteria}, "AND");
        assert(results.size() == 0); // helper.h is only 10 KB
        cout << "PASS test_and_filter_no_match" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_and_filter_no_match" << endl;
        failed++;
    }

    // Test 4: OR filter with single criterion behaves like direct search
    try {
        SearchByExtension extCriteria("cpp");
        auto composite = search_composite(&root, {&extCriteria}, "OR");
        auto direct = search_by_extension(&root, "cpp");
        assert(composite.size() == direct.size());
        cout << "PASS test_single_criterion_or" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_single_criterion_or" << endl;
        failed++;
    }

    // Test 5: AND filter — all files matching both criteria
    try {
        SearchByMinSize sizeCriteria(50);
        SearchByName nameCriteria(".");  // all files with '.' in name
        auto results = search_composite(&root, {&sizeCriteria, &nameCriteria}, "AND");
        // Files >= 50KB with '.' in name: main.cpp(50), utils.cpp(120), report.pdf(200)
        assert(results.size() == 3);
        cout << "PASS test_and_filter_size_and_dot" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_and_filter_size_and_dot" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
