type StatusBarProps = {
  message: string;
};

export function StatusBar({ message }: StatusBarProps) {
  return (
    <div className="status-bar">
      <span className="status-indicator">●</span>
      <span className="status-text">{message}</span>
    </div>
  );
}