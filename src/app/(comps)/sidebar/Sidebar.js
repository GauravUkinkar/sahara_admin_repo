import React from "react";
import "./Sidebar.scss";
import ThemeStore from "../store/Theme";
import { MdDarkMode, MdOutlineContactPage } from "react-icons/md";
import { MdSunny } from "react-icons/md";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import UilayoutStore from "../store/Uilayout";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaQuora } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { MdVideoLibrary } from "react-icons/md";
import { MdTextSnippet } from "react-icons/md";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PiMegaphone } from "react-icons/pi";
import { TfiGallery } from "react-icons/tfi";

function Sidebar() {
  const { isDarkMode, toggleTheme } = ThemeStore();
  const { sidebar, toggleUi } = UilayoutStore();
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LuLayoutDashboard />,
    },
    {
      name: "Hero Section",
      path: "/homepage",
      icon: <MdVideoLibrary />,
    },
    {
      name: "About Page",
      path: "/about",
      icon: <MdTextSnippet />,
    },
    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <FaRegNoteSticky />,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: <AiOutlineProduct />,
    },
    {
      name: "Promotional",
      path: "/addPromotionalActivities",
      icon: <PiMegaphone />,
    },
    {
      name: "FAQs",
      path: "/faq",
      icon: <FaQuora />,
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: <MdOutlineContactPage />,
    },
    {
      name: " Gallery",
      path: "/gallery",
      icon: <TfiGallery />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  return (
    <>
      <Tooltip id="my-tooltip" />
      <div className={sidebar ? "sidebar " : "sidebar collapse"}>
        <div className="links">
          <div className="top">
            <h3>
              {sidebar ? (
                <>
                  {" "}
                  Sahara
                  <br />
                  Amusement
                </>
              ) : (
                <></>
              )}
            </h3>
            <button
              className={sidebar ? "btn3 active" : "btn3 "}
              onClick={toggleUi}
            >
              <IoIosArrowForward />
            </button>
          </div>

          {links.map((link, index) => (
            <Link
              key={index}
              className={pathname === link.path ? "active" : ""}
              href={link.path}
              {...(sidebar
                ? {}
                : {
                    "data-tooltip-id": "my-tooltip",
                    "data-tooltip-content": link.name,
                  })}
            >
              <span>{link.icon}</span>

              {sidebar && link.name}
            </Link>
          ))}
        </div>
        <div className="btns">
          {sidebar ? (
            <button className="btn" onClick={() => handleLogout()}>
              {" "}
              <span>
                <HiOutlineLogout />{" "}
              </span>
              Logout
            </button>
          ) : (
            <button className="btn" onClick={() => handleLogout()}>
              {" "}
              <span>
                <HiOutlineLogout />{" "}
              </span>
            </button>
          )}
          <button className="btn2" onClick={toggleTheme}>
            {isDarkMode ? <MdDarkMode /> : <MdSunny />}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
