import { groth16 } from 'snarkjs';

export async function generateProof(balance, threshold) {
    console.log("Starting ZKP generation...");


    const inputs = {
        tenantBalance: balance,
        threshold: threshold
    };


    const { proof, publicSignals } = await groth16.fullProve(
        inputs,
        "/balance_check.wasm",
        "/balance_check_final.zkey"
    );

    console.log("Proof generated!", publicSignals);


    return {
        proof: JSON.stringify(proof),
        publicSignals: publicSignals,
        result: publicSignals[0] === "1"
    };
}