import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertTriangle } from 'lucide-react';

const OrderTimeline = ({ status, trackingLogs = [] }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Processing', label: 'Processing', icon: CheckCircle2 },
    { key: 'Shipped', label: 'Shipped', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: PackageCheck }
  ];

  if (status === 'Cancelled') {
    return (
      <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#F87171' }}>
        <AlertTriangle size={24} />
        <div>
          <h4 style={{ fontWeight: 700 }}>Order Cancelled</h4>
          <p style={{ fontSize: '0.88rem', opacity: 0.9 }}>This order was cancelled. If you have questions, please contact support.</p>
        </div>
      </div>
    );
  }

  const getStepIndex = (s) => {
    switch (s) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '2rem 0' }}>
        {/* Background Track Line */}
        <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: 'var(--border)', zIndex: 0 }} />
        {/* Active Progress Line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            width: `${(currentIndex / 3) * 80}%`,
            height: '3px',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            zIndex: 0,
            transition: 'width 0.4s ease'
          }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: isCompleted ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-secondary)',
                  border: isCompleted ? 'none' : '2px solid var(--border)',
                  color: isCompleted ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <Icon size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: isCurrent ? 700 : 500, color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '0.5rem' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {trackingLogs && trackingLogs.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Tracking Logs</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {trackingLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.status}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{log.note}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {new Date(log.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
