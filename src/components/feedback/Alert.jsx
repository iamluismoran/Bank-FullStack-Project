import "../../styles/components/feedback/Alert.css";

export default function Alert({ children }) {
  return (
    <div className="card alert" role="alert">
      {children}
    </div>
  );
}
