"use client";

import React, { useEffect, useState } from "react";
import { getpromoActivity } from "../(api)/PromoActivitiesAPI";
import axios from "axios";
import Confirmation from "../(comps)/confirmation/Confirmation";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [pendingId, setPendingId] = useState(null);

  const [deletepop, setDeletepop] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    getpromoActivity()
      .then((data) => {
        setActivityData(data.reverse());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const deleteActivity = async () => {
    if (!pendingId) return;
    try {
      // const id = localStorage.getItem("id");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/PramotionalActivity/delete/${pendingId}`
      );
      setDeletepop(false);
      setPendingId(null);
      // localStorage.removeItem("id");
      // window.location.reload();
      getpromoActivity();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const openPop = (id) => {
    // localStorage.setItem("id", id);
    setPendingId(id);
    setDeletepop(true);
  };

  return (
    <>
      {deletepop && (
        <Confirmation
          btnYes="Cancel"
          btnNo="Delete"
          title="Confirm Deletion"
          clickA={() => setDeletepop(false)}
          clickB={deleteActivity}
        />
      )}
      <div className="contacts activity parent">
        <div className="contacts-container activity-cont container">
          <div className="header">
            <div className="title">
              <h2>Promotional Activites</h2>
            </div>
            <div className="btns">
              <a href="/promotionalActivities" className="btn">
                Add
              </a>
              <button
                className="btn2"
                onClick={() => {
                  loadData();
                  toast.info("All Latest Contacts Fetched", {
                    position: "top-center",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    theme: isDarkMode ? "dark" : "light",
                  });
                }}
              >
                Refresh Data
              </button>
            </div>
          </div>
          <div className="table-box">
            {!isLoading ? (
              activityData && activityData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityData &&
                      activityData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1 || "N/A"}</td>
                          <td>{item?.data?.title || "N/A"}</td>
                          <td>{item?.data?.description || "N/A"}</td>
                          <td>
                            {item?.data?.image ? (
                              <img
                                src={item.data.image}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                alt="Promo"
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              height: "100%",
                              justifyContent: "center",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <a
                              href={`promotionalActivities?acivityId=${item?.data?.paId}`}
                              className="btn2"
                            >
                              Edit
                            </a>
                            <button
                              className="btn2"
                              onClick={() => openPop(item?.data?.paId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p
                  className="no-data"
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    marginTop: "20px",
                  }}
                >
                  Data is not available
                </p>
              )
            ) : (
              <p className="loading">Fetching contact requests...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
