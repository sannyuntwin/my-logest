import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
        }}
      >
        <Topbar />

        <main
          style={{
            padding: "28px",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
