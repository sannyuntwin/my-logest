function Topbar() {
  return (
    <header
      style={{
        height: "72px",
        background: "white",
        borderBottom:
          "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        padding: "0 28px",
        boxSizing: "border-box",
      }}
    >
      {/* Page area */}

      <div>
        <span
          style={{
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Transportation Management System
        </span>
      </div>

      {/* Right side */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Notification */}

        <button
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          🔔
        </button>

        {/* User */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Admin User
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
