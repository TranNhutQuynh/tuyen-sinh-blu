import useTheme from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">{isDark ? "🌙" : "☀️"}</span>
      </span>
      <span className="theme-toggle-text">{isDark ? "Tối" : "Sáng"}</span>
    </button>
  );
}
