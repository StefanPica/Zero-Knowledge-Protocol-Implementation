pragma circom 2.0.0;

// Import the comparison logic from the library you just installed
include "node_modules/circomlib/circuits/comparators.circom";

template BalanceCheck() {
    // 1. Inputs
    signal input tenantBalance; // Private (User's money)
    signal input threshold;     // Public (Landlord's requirement)

    // 2. Output
    signal output result;       // 1 if Pass, 0 if Fail

    // 3. Logic: Greater Than or Equal To
    // We use 64 bits to allow for large numbers (billions)
    component ge = GreaterEqThan(64);

    ge.in[0] <== tenantBalance;
    ge.in[1] <== threshold;

    // 4. Output assignment
    result <== ge.out;
}

// The 'main' component is the entry point.
// We declare 'threshold' as public. 'tenantBalance' stays private automatically.
component main {public [threshold]} = BalanceCheck();