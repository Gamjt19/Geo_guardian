import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

interface HazardReportSheetProps {
  currentUser: any;
  locationObj: { lat: number; lng: number; address: string } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReportSuccess: () => void;
}

const HAZARD_TYPES = ['pothole', 'flooding', 'accident', 'construction', 'debris', 'signal_out', 'other'];

export const HazardReportSheet: React.FC<HazardReportSheetProps> = ({ currentUser, locationObj, isOpen, onOpenChange, onReportSuccess }) => {
  const [type, setType] = useState('pothole');
  const [severity, setSeverity] = useState('low');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useAuth();

  // All users can report now
  if (!currentUser) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationObj) {
      toast.error('Location not available');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/hazards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser._id // Mocking the middleware
        },
        body: JSON.stringify({
          type: type,
          severity,
          description,
          location: {
            type: 'Point',
            coordinates: [locationObj.lng, locationObj.lat]
          }
        })
      });

      if (!res.ok) throw new Error('Failed to submit hazard');

      if (currentUser.role === 'user') {
          updateUser({ role: 'local_guide', guideLevel: 1, guidePoints: 10 });
          toast.success('Congratulations! You are now a Local Guide Level 1!', { icon: '🎉', duration: 5000 });
      } else {
          toast.success('+10 points for your contribution!', { icon: '👏' });
          // If already a guide, we could calculate accurate points, but let's just show standard toast.
          // Ideally fetch new profile, or just add 10 points locally
          const newPts = (currentUser.guidePoints || 0) + 10;
          updateUser({ guidePoints: newPts });
      }

      onOpenChange(false);
      onReportSuccess();
    } catch (err) {
      toast.error('Could not submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 10000 }} />
        <Dialog.Content style={{ backgroundColor: 'white', color: '#111827', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '20px', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10001, maxHeight: '90vh', overflowY: 'auto' }}>
          <Dialog.Title style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>Report Hazard</Dialog.Title>
          
          {locationObj && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '14px' }}>
              <div style={{ fontWeight: 600 }}>📍 {locationObj.address}</div>
              <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                {locationObj.lat.toFixed(5)}° N, {locationObj.lng.toFixed(5)}° E
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Type</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {HAZARD_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: type === t ? '2px solid #ea580c' : '1px solid #ccc',
                      backgroundColor: type === t ? '#fff7ed' : 'white',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      color: type === t ? '#ea580c' : '#4b5563'
                    }}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Severity</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['low', 'medium', 'high'].map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
                    <input type="radio" name="severity" checked={severity === s} onChange={() => setSeverity(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Description (Optional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={300}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', color: '#111827', backgroundColor: 'white' }}
                placeholder="Details..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <Dialog.Close asChild>
                <button type="button" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#e5e7eb', color: '#374151', cursor: 'pointer' }}>Cancel</button>
              </Dialog.Close>
              <button disabled={isSubmitting} type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ea580c', color: 'white', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
