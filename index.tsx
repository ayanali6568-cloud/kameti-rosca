import Link from "next/link"
export default function Home(){
  return (
    <div className="container">
      <div className="card">
        <h1>Kameti / Committee App</h1>
        <p>Track who paid, run monthly cycles, and collect payments online.</p>
        <div className="flex">
          <Link className="button" href="/login">Login</Link>
          <Link className="button" href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
