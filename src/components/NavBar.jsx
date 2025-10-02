import { NavLink } from "react-router-dom";

export default function NavBar() {
  const link = ({ isActive }) => ({
    padding: '8px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    color: isActive ? '#111' : '#333',
    background: isActive ? '#e5e7eb' : 'transparent'
  });

  return (
    <nav className="nav">
      <div className="brand">BankBack+</div>
      <div className="links">
        <NavLink to="/" style={link} end>Balance</NavLink>
        <NavLink to="/transfer" style={link}>Transfer</NavLink>
        <NavLink to="/create-checking" style={link}>New Checking/Student</NavLink>
        <NavLink to="/create-savings" style={link}>New Savings</NavLink>
        <NavLink to="/create-cc" style={link}>New CreditCard</NavLink>
        <NavLink to="/status" style={link}>Status</NavLink>
        <NavLink to="/delete" style={link}>Delete</NavLink>
        <NavLink to="/tp-deposit" style={link}>TP Deposit</NavLink>
        <NavLink to="/tp-withdraw" style={link}>TP Withdraw</NavLink>
        <NavLink to="/health" style={link}>Health</NavLink>
      </div>
    </nav>
  );
}
