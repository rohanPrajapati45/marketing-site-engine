import React, { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Topbar from "../components/Topbar";

const AdminLayout = () => {

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (

    <div className="min-h-screen bg-[var(--bg)]">

      {/* SIDEBAR */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN CONTENT */}

      <div
        className={`
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-[72px]"
              : "lg:ml-60"
          }
        `}
      >

        {/* TOPBAR */}

        <Topbar
          onMenuClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
        />

        {/* PAGE */}

        <main className="p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;