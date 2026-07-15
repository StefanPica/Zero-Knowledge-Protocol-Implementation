import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LandlordDashboard = ({ user }) => {
    const [reqData, setReqData] = useState({ tenantUsername: '', propertyName: '', threshold: '' });
    const [outbox, setOutbox] = useState([]);

    useEffect(() => {
        if(user?.id) fetchOutbox();
    }, [user]);

    const fetchOutbox = async () => {
        const res = await axios.get(`http://localhost:8080/api/verification/landlord/outbox/${user.id}`);
        setOutbox(res.data);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/verification/landlord/request', {
                ...reqData,
                landlordUsername: user.username
            });
            alert("Request Sent!");
            fetchOutbox();
        } catch (err) {
            alert("Failed: " + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Landlord Dashboard: {user?.username}</h2>

            <div className="card p-3 mb-4">
                <h5>📝 Send New Verification Request</h5>
                <form onSubmit={handleSend} className="row g-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Tenant Username"
                               onChange={e => setReqData({...reqData, tenantUsername: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Property Name"
                               onChange={e => setReqData({...reqData, propertyName: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                        <input className="form-control" type="number" placeholder="Min Balance ($)"
                               onChange={e => setReqData({...reqData, threshold: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100">Send</button>
                    </div>
                </form>
            </div>

            <h4>Sent Requests</h4>
            <table className="table">
                <thead>
                <tr>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Status</th>
                    <th>Result</th>
                </tr>
                </thead>
                <tbody>
                {outbox.map(req => (
                    <tr key={req.requestId}>
                        <td>{req.propertyName}</td>
                        <td>{req.landlordName}</td> {/* Actually Tenant Name here based on DTO mapping */}
                        <td>{req.status}</td>
                        <td>
                            {req.result === 'PASS' && <span className="badge bg-success">Verified</span>}
                            {req.result === 'FAIL' && <span className="badge bg-danger">Ineligible</span>}
                            {req.result === 'DENIED' && <span className="badge bg-secondary">Refused</span>}
                            {req.result === 'NONE' && <span className="text-muted">...</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default LandlordDashboard;