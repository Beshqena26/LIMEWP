import { useState } from 'react'
import { Icon, GoogleIcon, GitHubIcon } from './Icons'
import { Input } from './Input'

function LoginForm({ onSubmit, onSwitch }: { onSubmit: () => void; onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const submit = () => {
    const e: Record<string, boolean> = {}
    if (!email.trim()) e.email = true
    if (!password.trim()) e.password = true
    setErrors(e)
    if (Object.keys(e).length === 0) onSubmit()
  }

  return (
    <div className="modal-form">
      <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} error={errors.email} />
      <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={setPassword} error={errors.password} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="modal-check"><input type="checkbox" /> Remember me</label>
        <a style={{ fontSize: '.8rem', color: 'var(--acc)', fontWeight: 500, cursor: 'pointer' }}>Forgot password?</a>
      </div>
      <button className="modal-submit" type="button" onClick={submit}>Log In</button>
      <div className="modal-divider"><span>or continue with</span></div>
      <div className="modal-social">
        <button type="button"><GoogleIcon /> Google</button>
        <button type="button"><GitHubIcon /> GitHub</button>
      </div>
      <div className="modal-footer">Don't have an account? <a onClick={onSwitch}>Sign up</a></div>
    </div>
  )
}

function SignupForm({ onSubmit, onSwitch }: { onSubmit: () => void; onSwitch: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const submit = () => {
    const e: Record<string, boolean> = {}
    if (!name.trim()) e.name = true
    if (!email.trim()) e.email = true
    if (!password.trim()) e.password = true
    setErrors(e)
    if (Object.keys(e).length === 0) onSubmit()
  }

  return (
    <div className="modal-form">
      <Input label="Full Name" placeholder="John Doe" value={name} onChange={setName} error={errors.name} />
      <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} error={errors.email} />
      <Input label="Password" type="password" placeholder="Create a strong password" value={password} onChange={setPassword} error={errors.password} />
      <label className="modal-check"><input type="checkbox" /> I agree to the <a style={{ color: 'var(--acc)', fontWeight: 500, cursor: 'pointer' }}>Terms of Service</a></label>
      <button className="modal-submit" type="button" onClick={submit}>Create Account</button>
      <div className="modal-divider"><span>or sign up with</span></div>
      <div className="modal-social">
        <button type="button"><GoogleIcon /> Google</button>
        <button type="button"><GitHubIcon /> GitHub</button>
      </div>
      <div className="modal-footer">Already have an account? <a onClick={onSwitch}>Log in</a></div>
    </div>
  )
}

export function AuthModals({ modal, setModal, onAuth }: { modal: 'login' | 'signup' | null; setModal: (v: 'login' | 'signup' | null) => void; onAuth?: () => void }) {
  const handleSubmit = () => { if (onAuth) onAuth(); else window.location.hash = 'dashboard' }

  return (
    <>
      <div className={`modal-overlay${modal === 'login' ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="modal">
          <div className="modal-close" onClick={() => setModal(null)}><Icon name="close" /></div>
          <div className="modal-title">Welcome Back</div>
          <div className="modal-sub">Log in to manage your WordPress sites</div>
          <LoginForm onSubmit={handleSubmit} onSwitch={() => setModal('signup')} />
        </div>
      </div>
      <div className={`modal-overlay${modal === 'signup' ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="modal">
          <div className="modal-close" onClick={() => setModal(null)}><Icon name="close" /></div>
          <div className="modal-title">Create Account</div>
          <div className="modal-sub">Start your WordPress site in minutes</div>
          <SignupForm onSubmit={handleSubmit} onSwitch={() => setModal('login')} />
        </div>
      </div>
    </>
  )
}
