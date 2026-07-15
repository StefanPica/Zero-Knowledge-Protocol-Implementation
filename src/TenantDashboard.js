import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateProof } from './zkpService';

const TenantDashboard = ({ tenantId }) => {
    const [requests, setRequests] = useState([]);
    const [balanceInput, setBalanceInput] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInbox();
    }, []);

    const fetchInbox = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/verification/inbox/${tenantId}`);
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to load inbox", err);
        }
    };

    const handleVerify = async (requestId) => {
        if (!balanceInput) {
            alert("Please enter your current bank balance first.");
            return;
        }

        setLoading(true);
        setStatusMsg("Initializing Secure Environment...");

        try {
            const paramRes = await axios.get(`http://localhost:8080/api/verification/parameters/${requestId}`);
            const threshold = paramRes.data;

            setStatusMsg("Generating Zero-Knowledge Proof... (This stays on your device)");

            const zkpResult = await generateProof(balanceInput, threshold);

            setStatusMsg("Proof Generated! Submitting to Landlord...");

            const submission = {
                proofString: zkpResult.proof,
                passed: zkpResult.result,
                denied: false
            };

            await axios.post(`http://localhost:8080/api/verification/submit/${requestId}`, submission);

            setStatusMsg(zkpResult.result ? "✅ Verified Successfully!" : "❌ Verification Failed (Insufficient Funds)");
            fetchInbox();

        } catch (error) {
            console.error(error);
            setStatusMsg("⚠️ Error during verification process.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeny = async (requestId) => {
        if (!window.confirm("Are you sure you want to deny this request?")) return;

        const submission = {
            proofString: "",
            passed: false,
            denied: true
        };

        try {
            await axios.post(`http://localhost:8080/api/verification/submit/${requestId}`, submission);

            setStatusMsg("🚫 Request Denied.");
            fetchInbox();
        } catch (error) {
            console.error("Error denying request", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Tenant Dashboard</h2>

            {/* Mock Bank Interface */}
            <div className="card p-3 mb-4 bg-light">
                <h5>🏦 My Bank Link</h5>
                <div className="form-group">
                    <label>Current Private Balance ($):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        placeholder="e.g. 7500"
                    />
                </div>
            </div>

            {/* Request List */}
            <h4>Incoming Requests</h4>
            {statusMsg && <div className="alert alert-info">{statusMsg}</div>}

            <table className="table">
                <thead>
                <tr>
                    <th>Property</th>
                    <th>Landlord</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(req => (
                    <tr key={req.requestId}>
                        <td>{req.propertyName}</td>
                        <td>{req.landlordName}</td>

                        <td>
                            {req.status === 'PENDING' && (
                                <span className="badge bg-warning text-dark">Pending</span>
                            )}

                            {req.status === 'COMPLETED' && (
                                <>
                                    {req.result === 'PASS' && <span className="badge bg-success">Verified</span>}
                                    {req.result === 'FAIL' && <span className="badge bg-danger">Ineligible</span>}
                                    {req.result === 'DENIED' && <span className="badge bg-secondary">Refused</span>}
                                </>
                            )}
                        </td>

                        {/* BUTTON LOGIC */}
                        <td>
                            {req.status === 'PENDING' ? (
                                <div className="btn-group">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleVerify(req.requestId)}
                                        disabled={loading}
                                    >
                                        {loading ? "..." : "Accept"}
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeny(req.requestId)}
                                        disabled={loading}
                                    >
                                        Deny
                                    </button>
                                </div>
                            ) : (
                                <span className="text-muted">Closed</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TenantDashboard;