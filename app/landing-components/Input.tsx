interface InputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function Input({ label, type = 'text', placeholder, value, onChange, error }: InputProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={error ? { borderColor: '#EF4444' } : {}}
      />
    </div>
  )
}
