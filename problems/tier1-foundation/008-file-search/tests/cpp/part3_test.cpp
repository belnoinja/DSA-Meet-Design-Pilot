// Part 3 Tests — Sort Results Independently
// Tests that search results can be sorted by name, size, or extension

#include <cassert>
#include <iostream>
using namespace std;

int part3_tests() {
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

    // Test 1: search all files >= 1 KB, sort by name (alphabetical)
    try {
        SearchByMinSize criteria(1);
        auto results = search_and_sort(&root, criteria, "name");
        assert(results.size() == 6);
        assert(results[0]->name == "build.sh");
        assert(results[1]->name == "helper.h");
        assert(results[2]->name == "main.cpp");
        assert(results[3]->name == "readme.md");
        assert(results[4]->name == "report.pdf");
        assert(results[5]->name == "utils.cpp");
        cout << "PASS test_sort_by_name" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_sort_by_name" << endl;
        failed++;
    }

    // Test 2: search all files >= 1 KB, sort by size (largest first)
    try {
        SearchByMinSize criteria(1);
        auto results = search_and_sort(&root, criteria, "size");
        assert(results.size() == 6);
        assert(results[0]->name == "report.pdf");   // 200 KB
        assert(results[1]->name == "utils.cpp");     // 120 KB
        assert(results[2]->name == "main.cpp");      // 50 KB
        assert(results[3]->name == "helper.h");      // 10 KB
        assert(results[4]->name == "readme.md");     // 5 KB
        assert(results[5]->name == "build.sh");      // 2 KB
        cout << "PASS test_sort_by_size" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_sort_by_size" << endl;
        failed++;
    }

    // Test 3: search .cpp files, sort by size
    try {
        SearchByExtension criteria("cpp");
        auto results = search_and_sort(&root, criteria, "size");
        assert(results.size() == 2);
        assert(results[0]->name == "utils.cpp");  // 120 KB
        assert(results[1]->name == "main.cpp");   // 50 KB
        cout << "PASS test_search_cpp_sort_by_size" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_search_cpp_sort_by_size" << endl;
        failed++;
    }

    // Test 4: search all files >= 1 KB, sort by extension (alphabetical)
    try {
        SearchByMinSize criteria(1);
        auto results = search_and_sort(&root, criteria, "extension");
        assert(results.size() == 6);
        // Extensions in order: cpp, cpp, h, md, pdf, sh
        assert(results[0]->extension == "cpp");
        assert(results[1]->extension == "cpp");
        assert(results[2]->extension == "h");
        assert(results[3]->extension == "md");
        assert(results[4]->extension == "pdf");
        assert(results[5]->extension == "sh");
        cout << "PASS test_sort_by_extension" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_sort_by_extension" << endl;
        failed++;
    }

    // Test 5: empty results remain empty after sort
    try {
        SearchByExtension criteria("java");
        auto results = search_and_sort(&root, criteria, "name");
        assert(results.size() == 0);
        cout << "PASS test_sort_empty_results" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_sort_empty_results" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
