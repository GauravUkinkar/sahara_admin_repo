"use client";

import React, { useEffect, useState } from "react";
import { getActivity } from "../(api)/ActivityApi";
import axios from "axios";
import Confirmation from "../(comps)/confirmation/Confirmation";
import Link from "next/link";
import { toast } from "react-toastify";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingId, setPendingId] = useState(null);

  // replace this with your own dark-mode flag / context
  const isDarkMode = false;

  /* ---------- data helpers ---------- */
  const loadData = () => {
    setIsLoading(true);
    getActivity()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const deleteActivity = async () => {
    if (!pendingId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/delete?activityId=${pendingId}`
      );
      toast.success("Activity deleted", {
        position: "top-center",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      });
      setShowConfirm(false);
      setPendingId(null);
      loadData(); // refresh list in place
    } catch (err) {
      console.error(err);
      toast.error("Could not delete activity", {
        position: "top-center",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  /* ---------- life-cycle ---------- */
  useEffect(loadData, []);

  /* ---------- helpers ---------- */
  const openConfirm = (aid) => {
    setPendingId(aid);
    setShowConfirm(true);
  };

  /* ---------- JSX ---------- */
  return (
    <>
      {showConfirm && (
        <Confirmation
          title="Confirm Deletion"
          btnYes="Cancel"
          btnNo="Delete"
          clickA={() => setShowConfirm(false)}
          clickB={deleteActivity}
        />
      )}

      <div className="contacts activity parent">
        <div className="contacts-container activity-cont container">
          <header className="header">
            <div className="title">
              <h2>Activities Page</h2>
            </div>

            <div className="btns">
              <Link href="/addActivity" className="btn">
                Add Activity
              </Link>
              <button
                type="button"
                className="btn2"
                onClick={() => {
                  loadData();
                  toast.info("List refreshed", {
                    position: "top-center",
                    autoClose: 500,
                    theme: isDarkMode ? "dark" : "light",
                  });
                }}
              >
                Refresh Data
              </button>
            </div>
          </header>

          <div className="table-box">
            {isLoading ? (
              <p className="loading">Fetching activities…</p>
            ) : activities.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Activity Title</th>
                    <th>Description</th>
                    <th>Feature&nbsp;Image</th>
                    <th>Cover&nbsp;Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((item) => (
                    <tr key={item.data.aid}>
                      <td>{item.data.aid}</td>
                      <td>{item.data.title}</td>
                      <td>{item.data.activityTitle}</td>
                      <td>{item.data.description}</td>

                      <td>
                        <img
                          src={item.data.image}
                          alt={`${item.data.title} feature`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>

                      <td>
                        <img
                          src={item.data.coverImage}
                          alt={`${item.data.title} cover`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>

                      <td
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href={`/addActivity?activityId=${item.data.aid}`}
                          className="btn2"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn2"
                          onClick={() => openConfirm(item.data.aid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No activities found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
