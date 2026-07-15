const snarkjs = require("snarkjs");
const fs = require("fs");

async function runTest(balance, threshold) {
    console.log("========================================");
    console.log(`🧪 TESTING: Balance ${balance} vs Threshold ${threshold}`);
    console.log("========================================");

    try {
        // 1. THE PROVER (Tenant)
        // Generates the proof locally
        console.log("1. Generating Proof...");
        const start = Date.now();

        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            { tenantBalance: balance, threshold: threshold },
            "balance_check_js/balance_check.wasm",
            "balance_check_final.zkey"
        );

        const timeTaken = Date.now() - start;
        console.log(`   ✅ Proof Generated in ${timeTaken}ms`);
        console.log(`   📝 Public Output (Result): ${publicSignals[0]} (1=Pass, 0=Fail)`);

        // 2. THE VERIFIER (Landlord)
        // Uses the Verification Key to check if the proof is valid
        console.log("2. Verifying Proof...");
        const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

        if (res === true) {
            console.log("   ✅ VERIFICATION SUCCESS:");

            // Interpret the result
            if (publicSignals[0] === "1") {
                console.log("   🎉 RESULT: SUFFICIENT FUNDS (Pass)");
            } else {
                console.log("   ❌ RESULT: INSUFFICIENT FUNDS (Fail)");
            }
        } else {
            console.log("   ⛔ VERIFICATION FAILED: Invalid proof.");
        }

    } catch (error) {
        console.error("   ⚠️ ERROR:", error);
    }
    console.log("\n");
}

// Run 3 Scenarios
async function runAll() {
    // Scenario 1: Have enough money
    await runTest(7500, 5000);

    // Scenario 2: Too poor
    await runTest(4000, 5000);

    // Scenario 3: Exact amount
    await runTest(5000, 5000);

    process.exit(0);
}

runAll();