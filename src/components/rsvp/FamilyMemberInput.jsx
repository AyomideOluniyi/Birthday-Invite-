export default function FamilyMemberInput({ index, value, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2 animate-slideUp">
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={`Family member ${index + 1} full name`}
          className="luxury-input pr-4"
          maxLength={80}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-rosegold hover:bg-white/10 transition-all duration-200"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        title="Remove"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
