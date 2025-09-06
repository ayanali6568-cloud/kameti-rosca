import { useEffect, useState } from "react"

type Member = { id: string, name: string, email: string, paid: boolean }
type Month = { index: number, paidCount: number }

export default function Dashboard(){
  const [committee, setCommittee] = useState<any>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [months, setMonths] = useState<Month[]>([])
  const [payUrl, setPayUrl] = useState<string | null>(null)

  useEffect(()=>{
    // Demo data to visualize (replace with API calls)
    const fakeCommittee = { id:"demo", name:"33 x 1000 AED", monthlyAmount:1000, memberCount:33, currency:"AED", cycleId:"cycle1" }
    setCommittee(fakeCommittee)
    setMembers(Array.from({length:33}).map((_,i)=>({ id:`u${i+1}`, name:`Member ${i+1}`, email:`m${i+1}@mail.com`, paid: Math.random()>0.3 })))
    setMonths(Array.from({length:33}).map((_,i)=>({ index:i, paidCount: Math.floor(Math.random()*33) })))
  }, [])

  const handlePay = async () => {
    if (!committee) return
    // For demo, we just set url null. In real app, POST to /api/committee/[id]/pay
    setPayUrl(null)
    alert("Integrate pay: POST /api/committee/[id]/pay and redirect to Stripe Checkout URL")
  }

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h2>Dashboard — {committee?.name}</h2>
            <p>Monthly amount: <b>{committee?.monthlyAmount} {committee?.currency}</b> · Members: <b>{committee?.memberCount}</b></p>
            <button className="button" onClick={handlePay}>Pay this month</button>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <h3>Members & payments (current month)</h3>
            <table className="table">
              <thead><tr><th>#</th><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {members.map((m,i)=>(
                  <tr key={m.id}><td>{i+1}</td><td>{m.name}</td><td>{m.paid?<span className="badge">Paid</span>:<span className="badge">Unpaid</span>}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <h3>Cycle progress</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(11,1fr)', gap:6}}>
              {months.map(m=>(
                <div key={m.index} className="card" style={{padding:8}}>
                  <div>Month {m.index+1}</div>
                  <div className="badge">{m.paidCount}/33 paid</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
