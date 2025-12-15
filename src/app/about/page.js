"use client";

import React, { useEffect, useState } from "react";
import Confirmation from "../(comps)/confirmation/Confirmation";
import ThemeStore from "../(comps)/store/Theme";
import { getAboutData, updateAboutData } from "../(api)/aboutApi";
import { ToastContainer, toast } from "react-toastify";
import "./about.scss";

const Page = () => {
  const { isDarkMode } = ThemeStore();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controls, setControls] = useState({
    title: "",
    description: "",
    btn_text: "",
    btn_link: "",
    img: "",
    imgalert: 0,
    instruction: true,
    confirm: false,
  });

  
  useEffect(() => {
    setIsLoading(true);
    getAboutData().then((data) => {
      setData(data.data);
      setIsLoading(false);
      setControls({
        title: data.data.title,
        description: data.data.description,
        btn_text: data.data.buttonText,
        img: data.data.image,
      });
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <ToastContainer />
      {controls.confirm && (
        <Confirmation
          title={`are you sure?`}
          btnYes="No"
          btnNo="Yes"
          clickA={() => setControls({ ...controls, confirm: false })}
          clickB={() => {
            updateAboutData(
              controls.title,
              controls.description,
              controls.btn_text,
              controls.img
            ).then((data) => {
              setControls({ ...controls, confirm: false });
              toast.success("About Section Updated", {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: false,
                theme: isDarkMode ? "dark" : "light",
              });
            });
          }}
        >
          <p> once updated the previous data will be lost...</p>
        </Confirmation>
      )}

      <div className="parent about">
        <div className="container about-container ">
          <div className="header">
            <div className="title">
              <div className="back"></div>
              <h2>About Section Content </h2>
            </div>
            <div className="btns ">
              <button
                className="btn"
                onClick={() => setControls({ ...controls, confirm: true })}
              >
                Update
              </button>
              <button className="btn2">Refresh Data</button>
            </div>
          </div>
          <div className="aboutsection">
            <div className="left">
              <label>
                <div className="top">
                  <p>title Content*</p>
                  <div
                    className={
                      controls.title.length > 50 ? "counter error" : "counter"
                    }
                  >
                    {controls.title.length}/50
                  </div>
                </div>
                <input
                  type="text"
                  value={controls.title}
                  onChange={(e) =>
                    setControls({ ...controls, title: e.target.value })
                  }
                />
                {controls.title.length > 50 && (
                  <span className="error">title message is too long</span>
                )}
              </label>
              <label>
                <div className="top">
                  <p>description Content*</p>
                  <div
                    className={
                      controls.description.length > 550
                        ? "counter error"
                        : "counter"
                    }
                  >
                    {controls.description.length}/550
                  </div>
                </div>
                <textarea
                  type="text"
                  value={controls.description}
                  onChange={(e) =>
                    setControls({ ...controls, description: e.target.value })
                  }
                />
                {controls.description.length > 550 && (
                  <span className="error">description message is too long</span>
                )}
              </label>

              <div className="row">
                <label>
                  <div className="top">
                    <p>Button Text*</p>
                    <div
                      className={
                        controls.btn_text.length > 20
                          ? "counter error"
                          : "counter"
                      }
                    >
                      {controls.btn_text.length}/20
                    </div>
                  </div>
                  <input
                    type="text"
                    value={controls.btn_text}
                    onChange={(e) =>
                      setControls({ ...controls, btn_text: e.target.value })
                    }
                  />
                  {controls.btn_text.length > 20 && (
                    <span className="error">button text is too long</span>
                  )}
                </label>
                <label>
                  <div className="top">
                    <p>Image upload*</p>
                    <div
                      className={
                        controls.btn_text.length > 20
                          ? "counter error"
                          : "counter"
                      }
                    >
                      {controls.btn_text.length}/20
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (!file) return;

                      // Allowed image types
                      const validTypes = [
                        "image/png",
                        "image/jpeg",
                        "image/webp",
                      ];
                      if (!validTypes.includes(file.type)) {
                        setControls((prev) => ({ ...prev, imgalert: 2 }));
                        toast.error("Upload prohibited", {
                          position: "top-center",
                          autoClose: 500,
                          theme: isDarkMode ? "dark" : "light",
                        });
                        return;
                      }

                      // Max file size check (4MB)
                      if (file.size > 4 * 1024 * 1024) {
                        setControls((prev) => ({ ...prev, imgalert: 3 }));
                        toast.error("Upload prohibited", {
                          position: "top-center",
                          autoClose: 500,
                          theme: isDarkMode ? "dark" : "light",
                        });
                        return;
                      }

                      // Read the file to get its dimensions
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const img = new Image();
                        img.src = reader.result;

                        img.onload = () => {
                          if (img.width < 1080 || img.height < 1080) {
                            setControls((prev) => ({ ...prev, imgalert: 1 }));
                            toast.error("Upload prohibited", {
                              position: "top-center",
                              autoClose: 500,
                              theme: isDarkMode ? "dark" : "light",
                            });
                            return;
                          }

                          // If all validations pass, update the image
                          setControls((prev) => ({
                            ...prev,
                            imgalert: 0,
                            img: file,
                          }));
                        };
                      };
                      reader.readAsDataURL(file);
                    }}
                  />

                  {/* Displaying validation messages */}
                  {controls.imgalert === 1 && (
                    <span className="error">
                      Image should be at least 1080 x 1080px
                    </span>
                  )}
                  {controls.imgalert === 2 && (
                    <span className="error">
                      Only JPG, PNG, and WEBP formats are allowed
                    </span>
                  )}
                  {controls.imgalert === 3 && (
                    <span className="error">Image should be less than 4MB</span>
                  )}
                  {controls.imgalert === 4 && (
                    <span className="error">Image is required</span>
                  )}
                </label>
              </div>
            </div>

            <div className="right">
              <h2>Image Preview</h2>

              <div
                className="imgbox"
                style={{ backgroundImage: `url(${controls.img})` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
