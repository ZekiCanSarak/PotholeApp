export default function Toast({ message, type }) {
  const bg = type === 'error' ? '#dc2626' : type === 'badge' ? '#7c3aed' : '#16a34a'
  return (
    <div className="toast" style={{ background: bg }}>
      {message}
    </div>
  )
}
