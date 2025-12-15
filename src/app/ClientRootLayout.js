"use client";

import { useEffect, useState } from "react";
import Sidebar from "./(comps)/sidebar/Sidebar";
import UilayoutStore from "./(comps)/store/Uilayout";
import { usePathname, useRouter } from "next/navigation";

export default function ClientRootLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [auth, setAuth] = useState(null);
  const { sidebar } = UilayoutStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const id = localStorage.getItem("id");
    setAuth(id);

    if ((id !== "1" && pathname !== "/login") || (!id && pathname !== "/login")) {
      router.push("/login");
    }
  }, [pathname, router]);

  if (!isMounted) return null;

  if (pathname !== "/login" && auth !== "1") return null;

  return (
    <>
      {pathname !== "/login" && auth === "1" && (
        <div className={sidebar ? "sidebar-wrapper" : "sidebar-wrapper collapsed"}>
          <Sidebar />
        </div>
      )}
      <div className={sidebar ? "content-area" : "content-area extened"}>
        {children}
      </div>
      <div className="error-screen">
        <p>Please use a larger device to view this page</p>
      </div>
    </>
  );
}
