import React, { useEffect, useState } from 'react';
import { GuideBadge } from '../../components/Map/Hazards/GuideBadge';
import toast from 'react-hot-toast';

export const AdminHazards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'approved'>('review');
  const [hazards, setHazards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // We should ideally read `currentUser` from a global state/context
  const currentUser = { _id: 'admin_id_mock', role: 'admin' }; // Replace with real auth

  const fetchHazards = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'review' ? 'queue' : 'approved';
      const res = await fetch(`http://localhost:5000/api/hazards/admin/${endpoint}`, {
        headers: { 'x-user-id': currentUser._id }
      });
      const data = await res.json();
      setHazards(data);
    } catch (err) {
      toast.error('Failed to load hazards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHazards();
  }, [activeTab]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`http://localhost:5000/api/hazards/admin/${id}/${action}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser._id
        },
        body: JSON.stringify(action === 'reject' ? { reason: rejectReason } : {})
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      toast.success(`Hazard ${action}d`);
      setRejectId(null);
      setRejectReason('');
      fetchHazards();
    } catch (err) {
      toast.error(`Action failed`);
    }
  };

  if (currentUser.role !== 'admin') {
    return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Access Denied</h2><p>Admin privileges required.</p></div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Hazard Administration</h1>
      
      <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('review')}
          style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'none', borderBottom: activeTab === 'review' ? '4px solid #ea580c' : '4px solid transparent', cursor: 'pointer', color: activeTab === 'review' ? '#ea580c' : '#6b7280' }}
        >
          Needs Review
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'none', borderBottom: activeTab === 'approved' ? '4px solid #22c55e' : '4px solid transparent', cursor: 'pointer', color: activeTab === 'approved' ? '#22c55e' : '#6b7280' }}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Type & Severity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Reporter</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Votes</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Reported At</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hazards.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No hazards found.</td></tr>
            )}
            {hazards.map((h: any) => (
              <tr key={h._id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: h.flaggedForReview ? '#fef08a' : 'white' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{h.hazardType.replace('_', ' ')}</div>
                  <div style={{ fontSize: '12px', color: h.severity === 'high' ? 'red' : 'gray', textTransform: 'uppercase', marginTop: '4px' }}>{h.severity}</div>
                  {h.status === 'community_verified' && <div style={{ fontSize: '11px', color: 'blue', marginTop: '4px' }}>Community Verified</div>}
                </td>
                <td style={{ padding: '12px', fontSize: '14px' }}>
                  {h.location.coordinates[1].toFixed(5)}, {h.location.coordinates[0].toFixed(5)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div>{h.reportedBy?.name || 'Unknown'}</div>
                  {h.reportedBy?.guideLevel && <GuideBadge level={h.reportedBy.guideLevel} />}
                </td>
                <td style={{ padding: '12px', fontSize: '14px' }}>
                  <span style={{ color: 'green', marginRight: '8px' }}>👍 {h.upvotes}</span>
                  <span style={{ color: 'red', marginRight: '8px' }}>👎 {h.downvotes}</span>
                  <span style={{ color: 'blue' }} title="Passthroughs">🚗 {h.passthroughConfirmations}</span>
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                  {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {rejectId === h._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <input 
                        type="text" 
                        placeholder="Reason for rejection (optional)" 
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        style={{ padding: '6px', width: '200px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setRejectId(null)} style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => handleAction(h._id, 'reject')} style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>Confirm Reject</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {h.status !== 'admin_approved' && (
                        <button onClick={() => handleAction(h._id, 'approve')} style={{ padding: '6px 12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                      )}
                      <button onClick={() => setRejectId(h._id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                      <button style={{ padding: '6px 12px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hold</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
