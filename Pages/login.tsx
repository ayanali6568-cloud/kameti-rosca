import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="container">
      <div className="card" style={{maxWidth:480}}>
        <h2>Login</h2>
        <div style={{display:'grid', gap:12}}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="button" onClick={()=>signIn("credentials", { email, password, callbackUrl: "/dashboard" })}>Sign In</button>
        </div>
      </div>
    </div>
  )
}
