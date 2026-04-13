import ThemeToggle from "../theme/ThemeToggle";

export default function PublicLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="navbar navbar-expand-lg navbar-soft border-bottom">
        <div className="container py-3">
          <div className="d-flex flex-column">
            <span className="navbar-brand fw-bold mb-0">
              Trường Đại học Bạc Liêu
            </span>
            <span className="navbar-text">Hệ thống nhập hồ sơ tuyển sinh</span>
          </div>

          <div className="ms-auto d-flex align-items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-4">{children}</main>
    </div>
  );
}
