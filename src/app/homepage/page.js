"use client";

import React, { useEffect, useState } from "react";
import "./homepage.scss";
import axios from "axios";

function Page() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const [addData, setAddData] = useState({
    title: "",
    buttonText: "",
    buttonLink: "/#activities",
    description: null,
  });

  const [desktop, setDesktop] = useState({
    desktop: null,
    desktopPrev: "",
  });
  const [tab, setTab] = useState({
    tab: null,
    tabPrev: "",
  });
  const [mob, setMob] = useState({
    mob: null,
    mobPrev: "",
  });

  useEffect(() => {}, []);

  const [controls, setControls] = useState({
    view: "desk",
    saveState: true,
    resetState: false,
  });

  const saveStatus = (test) => {
    setControls({ ...controls, saveState: test ? true : false });
  };

  const getVideos = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/viedoAndAboutSection/get/1`
      );

      if (response.status === 200) {
        setAddData({
          title: response?.data?.data.title,
          buttonText: response?.data?.data.buttonText,
          buttonLink: null,
          description: null,
        });

        setDesktop({
          desktopPrev: response?.data.data.viedo.desktop,
        });
        setTab({
          tabPrev: response?.data.data.viedo.tab,
        });
        setMob({
          mobPrev: response?.data.data.viedo.mob,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const updateVideos = async () => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(addData));
      formData.append("desktopVideo", desktop.desktop);
      formData.append("tabVideo", tab.tab);
      formData.append("mobVideo", mob.mob);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/viedoAndAboutSection/update/1`,
        formData
      );
      getVideos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);

    if (type === "desktop") {
      setDesktop({ desktop: file, desktopPrev: fileURL });
    } else if (type === "tab") {
      setTab({ tab: file, tabPrev: fileURL });
    } else if (type === "mob") {
      setMob({ mob: file, mobPrev: fileURL });
    }
  };

  return (
    <>
      <div className="parent homepage">
        <div className="container homepage-container ">
          <div className="header">
            <div className="title">
              <div className="back"></div>
              <h2>HomePage Content </h2>
            </div>
            <div className="btns">
              <button className="btn " onClick={() => updateVideos()}>
                Save
              </button>
              <button className="btn2 ">Reset</button>
            </div>
          </div>
          <form>
            <div className="left">
              <div className="row"></div>
              <label>
                <div className="top">
                  <p>HomePage Title *</p>
                  <div
                    className={`counter ${
                      addData?.title.length > 49 ? "error" : ""
                    }`}
                  >
                    {addData?.title.length}/50 characters
                  </div>
                </div>
                <input
                  placeholder="Your main hero heading goes here..."
                  type="text"
                  value={addData.title}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setAddData({ ...addData, title: e.target.value });
                    }
                  }}
                />
                {addData.title.length > 49 && (
                  <span className="error">
                    Please keep the title below 50 characters
                  </span>
                )}
              </label>

              <div className="row"></div>
              <div className="row">
                <label>
                  <div className="top">
                    <p>Hero Button Text*</p>
                    <div
                      className={`counter ${
                        addData?.buttonText.length >= 21 ? "error" : ""
                      }`}
                    >
                      {addData?.buttonText.length}/20 characters
                    </div>
                  </div>
                  <input
                    placeholder="Enter hero button text..."
                    type="text"
                    value={addData.buttonText}
                    onChange={(e) => {
                      if (e.target.value.length <= 20) {
                        setAddData({ ...addData, buttonText: e.target.value });
                      }
                    }}
                  />
                  {addData.buttonText.length >= 21 && (
                    <span className="error">
                      Please keep the title below 20 characters
                    </span>
                  )}
                </label>

                <label>
                  <div className="top">
                    <p>Desktop Video</p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "desktop")}
                  />
                  {/* <span className="error">stats</span> */}
                </label>
              </div>
              <div className="row">
                <label>
                  <div className="top">
                    <p>Tab View Video</p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "tab")}
                  />
                  {/* <span className="error">stats</span> */}
                </label>
                <label>
                  <div className="top">
                    <p>Mobile View Video</p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "mob")}
                  />
                  {/* <span className="error">stats</span> */}
                </label>
              </div>
            </div>
            <div className="right">
              <div className="video-select">
                <div
                  className={`option ${
                    controls.view === "desk" ? "active" : ""
                  }`}
                  onClick={() => setControls({ ...controls, view: "desk" })}
                >
                  Desktop
                </div>
                <div
                  className={`option ${
                    controls.view === "mob" ? "active" : ""
                  }`}
                  onClick={() => setControls({ ...controls, view: "mob" })}
                >
                  Mobile
                </div>
                <div
                  className={`option ${
                    controls.view === "tab" ? "active" : ""
                  }`}
                  onClick={() => setControls({ ...controls, view: "tab" })}
                >
                  Tab
                </div>
              </div>
              <div className={`video-box ${controls.view}`}>
                {controls.view === "desk" && desktop.desktopPrev && (
                  <video controls width="100%">
                    <source src={desktop.desktopPrev} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {controls.view === "mob" && mob.mobPrev && (
                  <video controls width="100%">
                    <source src={mob.mobPrev} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {controls.view === "tab" && tab.tabPrev && (
                  <video controls width="100%">
                    <source src={tab.tabPrev} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Page;
