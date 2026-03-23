import toast from 'react-hot-toast';

export const HazardConfirmPrompt = {
  show: (hazardId: string, type: string, currentUser: any) => {
    // Prevent re-prompting
    if (localStorage.getItem(`hazard_prompted_${hazardId}`)) return;
    localStorage.setItem(`hazard_prompted_${hazardId}`, 'true');

    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
          ⚠️ {type.replace('_', ' ').toUpperCase()} reported nearby. Did you notice it?
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              if (currentUser) {
                try {
                  await fetch(`http://localhost:5000/api/hazards/${hazardId}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser._id },
                    body: JSON.stringify({ feedback: 'confirmed', isPassthrough: true })
                  });
                  toast.success('Thanks! You earned points.', { icon: '👏' });
                } catch (err) {}
              }
            }}
            style={{ flex: 1, padding: '8px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Yes, it's there
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              if (currentUser) {
                try {
                  await fetch(`http://localhost:5000/api/hazards/${hazardId}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser._id },
                    body: JSON.stringify({ feedback: 'denied', isPassthrough: true })
                  });
                } catch (err) {}
              }
            }}
            style={{ flex: 1, padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            No, all clear
          </button>
        </div>
      </div>
    ), { 
      duration: 8000, 
      position: 'top-center',
      style: { border: '2px solid #f59e0b', padding: '16px', maxWidth: '400px' }
    });
  }
};
