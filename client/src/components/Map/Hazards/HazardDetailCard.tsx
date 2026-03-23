import React, { useState } from 'react';
import { GuideBadge } from './GuideBadge';
import toast from 'react-hot-toast';

interface HazardDetailCardProps {
  hazard: any;
  currentUser: any;
  onClose: () => void;
  onFeedbackComplete: () => void;
}

export const HazardDetailCard: React.FC<HazardDetailCardProps> = ({ hazard, currentUser, onClose, onFeedbackComplete }) => {
  const [hasVoted, setHasVoted] = useState(false); // Can be improved by adding `userVote` to backend response
  const isApproved = hazard.status === 'admin_approved';

  const handleVote = async (feedback: 'confirmed' | 'denied') => {
    if (!currentUser) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/hazards/${hazard._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser._id },
        body: JSON.stringify({ feedback, isPassthrough: false })
      });

      if (res.status === 409) {
        toast.error('You already voted on this hazard');
        setHasVoted(true);
        return;
      }
      if (!res.ok) throw new Error('Voted failed');

      toast.success('Vote recorded');
      setHasVoted(true);
      onFeedbackComplete();
    } catch (err) {
      toast.error('Could not submit vote');
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 1000, borderLeft: `6px solid ${hazard.severity === 'high' ? 'red' : hazard.severity === 'medium' ? 'orange' : 'gold'}`}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{hazard.hazardType.replace('_', ' ')}</h3>
            {isApproved && <span style={{ backgroundColor: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>✓ Officially Verified</span>}
          </div>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>Severity: <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: hazard.severity === 'high' ? 'red' : 'inherit' }}>{hazard.severity}</span></p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
      </div>

      <div style={{ margin: '12px 0' }}>
        <p style={{ margin: '0' }}>{hazard.description || 'No description provided.'}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#555', marginBottom: '16px' }}>
        <span style={{ marginRight: '6px' }}>Reported by: {hazard.reportedBy?.name || 'Unknown'}</span>
        {hazard.reportedBy?.guideLevel && <GuideBadge level={hazard.reportedBy.guideLevel} />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#555' }}>
          <span>👍 {hazard.upvotes}</span>
          <span>👎 {hazard.downvotes}</span>
          <span title="Passthrough Confirmations">🚗 {hazard.passthroughConfirmations}</span>
        </div>

        {!hasVoted ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleVote('confirmed')} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9fafb', cursor: 'pointer' }}>Confirm</button>
            <button onClick={() => handleVote('denied')} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9fafb', cursor: 'pointer' }}>Deny</button>
          </div>
        ) : (
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓ Voted</span>
        )}
      </div>
    </div>
  );
};
