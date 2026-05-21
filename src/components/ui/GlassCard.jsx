export default function GlassCard({ children, className = '', style = {} }) {
  return (
    <div
      className={`glass-card gold-border ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.12)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
