#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

// ─── Item ────────────────────────────────────────────────────────────────────

struct Item {
    string name;
    double price;
    int    quantity;
};

// ─── Forward declare VendingMachine ──────────────────────────────────────────

class VendingMachine;

// ─── State Interface ──────────────────────────────────────────────────────────

class State {
public:
    virtual void insertCoin(VendingMachine& vm, double amount) = 0;
    virtual void selectItem(VendingMachine& vm, const string& code) = 0;
    virtual void cancel(VendingMachine& vm) = 0;
    virtual string name() const = 0;
    virtual ~State() = default;
};

// ─── Concrete States (forward declare, implement after VendingMachine) ────────

class IdleState;
class HasCoinState;
class DispensingState;
class OutOfStockState;

// ─── VendingMachine ───────────────────────────────────────────────────────────

class VendingMachine {
    State*  currentState;
    double  balance = 0.0;
    unordered_map<string, Item> inventory;

    // Pre-allocated states (no new/delete on each transition)
    IdleState*       idleState;
    HasCoinState*    hasCoinState;
    DispensingState* dispensingState;
    OutOfStockState* outOfStockState;

public:
    VendingMachine();
    ~VendingMachine();

    void addItem(const string& code, const Item& item) { inventory[code] = item; }
    void insertCoin(double amount)       { currentState->insertCoin(*this, amount); }
    void selectItem(const string& code)  { currentState->selectItem(*this, code); }
    void cancel()                        { currentState->cancel(*this); }
    string getCurrentState() const;
    double getBalance() const            { return balance; }

    // Called by State objects to transition
    void setState(State* s)      { currentState = s; }
    void addBalance(double amt)  { balance += amt; }
    void resetBalance()          { balance = 0.0; }
    Item* getItem(const string& code) {
        auto it = inventory.find(code);
        return it != inventory.end() ? &it->second : nullptr;
    }
    void decrementItem(const string& code) {
        if (inventory.count(code)) inventory[code].quantity--;
    }
    bool hasStock() const {
        for (const auto& [code, item] : inventory)
            if (item.quantity > 0) return true;
        return false;
    }

    // State accessors
    State* getIdleState();
    State* getHasCoinState();
    State* getDispensingState();
    State* getOutOfStockState();
};

// ─── TODO: Implement States ───────────────────────────────────────────────────

class IdleState : public State {
public:
    void insertCoin(VendingMachine& vm, double amount) override {
        // TODO: add to balance, transition to HasCoinState
        vm.addBalance(amount);
        cout << "Coin inserted: Rs." << amount << ". Balance: Rs." << vm.getBalance() << "\n";
        vm.setState(vm.getHasCoinState());
    }
    void selectItem(VendingMachine& vm, const string& code) override {
        cout << "Please insert coin first.\n";
    }
    void cancel(VendingMachine& vm) override {
        cout << "Nothing to cancel.\n";
    }
    string name() const override { return "Idle"; }
};

class HasCoinState : public State {
public:
    void insertCoin(VendingMachine& vm, double amount) override {
        cout << "Coin already inserted.\n";
    }
    void selectItem(VendingMachine& vm, const string& code) override {
        // TODO: validate item exists, has stock, check balance
        Item* item = vm.getItem(code);
        if (!item || item->quantity == 0) { cout << "Item not available.\n"; return; }
        if (vm.getBalance() < item->price) {
            cout << "Insufficient balance. Need Rs." << item->price << ", have Rs." << vm.getBalance() << "\n";
            return;
        }
        cout << "Dispensing: " << item->name << "\n";
        double change = vm.getBalance() - item->price;
        if (change > 0) cout << "Change: Rs." << change << "\n";
        vm.decrementItem(code);
        vm.resetBalance();
        vm.setState(vm.hasStock() ? vm.getIdleState() : vm.getOutOfStockState());
    }
    void cancel(VendingMachine& vm) override {
        cout << "Returning Rs." << vm.getBalance() << "\n";
        vm.resetBalance();
        vm.setState(vm.getIdleState());
    }
    string name() const override { return "HasCoin"; }
};

class DispensingState : public State {
public:
    void insertCoin(VendingMachine& vm, double amount) override { cout << "Please wait, dispensing.\n"; }
    void selectItem(VendingMachine& vm, const string& code) override { cout << "Please wait, dispensing.\n"; }
    void cancel(VendingMachine& vm) override { cout << "Cannot cancel while dispensing.\n"; }
    string name() const override { return "Dispensing"; }
};

class OutOfStockState : public State {
public:
    void insertCoin(VendingMachine& vm, double amount) override { cout << "Machine is out of stock.\n"; }
    void selectItem(VendingMachine& vm, const string& code) override { cout << "Machine is out of stock.\n"; }
    void cancel(VendingMachine& vm) override { cout << "Machine is out of stock.\n"; }
    string name() const override { return "OutOfStock"; }
};

// ─── VendingMachine implementation ───────────────────────────────────────────

VendingMachine::VendingMachine() {
    idleState       = new IdleState();
    hasCoinState    = new HasCoinState();
    dispensingState = new DispensingState();
    outOfStockState = new OutOfStockState();
    currentState    = idleState;
}
VendingMachine::~VendingMachine() {
    delete idleState; delete hasCoinState;
    delete dispensingState; delete outOfStockState;
}
string VendingMachine::getCurrentState() const { return currentState->name(); }
State* VendingMachine::getIdleState()       { return idleState; }
State* VendingMachine::getHasCoinState()    { return hasCoinState; }
State* VendingMachine::getDispensingState() { return dispensingState; }
State* VendingMachine::getOutOfStockState() { return outOfStockState; }

// ─── Main ────────────────────────────────────────────────────────────────────

int main() {
    VendingMachine vm;
    vm.addItem("A1", {"Chips",   10.0, 5});
    vm.addItem("A2", {"Water",    5.0, 2});
    vm.addItem("A3", {"Juice",   20.0, 1});

    cout << "State: " << vm.getCurrentState() << "\n\n";

    cout << "=== Test 1: Normal purchase ===\n";
    vm.insertCoin(10.0);
    vm.selectItem("A2");
    cout << "State: " << vm.getCurrentState() << "\n\n";

    cout << "=== Test 2: Cancel ===\n";
    vm.insertCoin(20.0);
    vm.cancel();
    cout << "State: " << vm.getCurrentState() << "\n\n";

    cout << "=== Test 3: Select without coin ===\n";
    vm.selectItem("A1");

    return 0;
}
