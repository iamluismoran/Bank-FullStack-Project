import "../../styles/components/ui/Badge.css";

export default function Badge({ children, variant = "default" }) {
  return <span className={`badge tag ${variant}`}>{children}</span>;
}
