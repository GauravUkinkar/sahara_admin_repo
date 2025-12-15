"use client";
import React, { useState, useEffect } from "react";
import "./testimonials.scss";
import {
  getTestimonials,
  deleteTestimonials,
  addTestimonials,
  updateTestimonials,
} from "../(api)/testimonailApis";
import { MdModeEdit } from "react-icons/md";
import { IoMdStar } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import Confirmation from "../(comps)/confirmation/Confirmation";
import { ToastContainer, toast } from "react-toastify";
import ThemeStore from "../(comps)/store/Theme";

const page = () => {
  const { isDarkMode } = ThemeStore();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controls, setControls] = useState({
    name: "",
    review: "",
    star: 3,
    instruction: true,
    deleteId: null,
    updateId: null,
  });

  useEffect(() => {
    setIsLoading(true);
    getTestimonials().then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, []);                       

  const deleteT = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await deleteTestimonials(id);
      const updatedData = await getTestimonials();
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setIsLoading(false);
      setControls({ ...controls, deleteId: null });
      toast.warning("Review Deleted", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const createT = async () => {
    if (data && data.length < 7) {
      setIsLoading(true);
      try {
        await addTestimonials(controls.name, controls.review, controls.star);
        const updatedData = await getTestimonials();
        setData(updatedData);
      } catch (error) {
        console.error("Error creating testimonial:", error);
      } finally {
        setIsLoading(false);
        setControls({ ...controls, name: "", review: "", star: 3 });
        toast.success("New Review Added", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          theme: isDarkMode ? "dark" : "light",
        });
      }
    } else {
      toast.warning("Action revoked", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const updateT = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await updateTestimonials(
        controls.updateId,
        controls.name,
        controls.review,
        controls.star
      );
      const updatedData = await getTestimonials();
      setData(updatedData);
    } catch (error) {
      console.error("Error creating testimonial:", error);
    } finally {
      setIsLoading(false);
      setControls({
        ...controls,
        name: "",
        review: "",
        star: 3,
        updateId: null,
      });
      toast.success("Review Updated", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  useEffect(() => {
    if (data && data.length >= 7) {
      toast.error("Maximum Testimonials Reached", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  }, [data]);

  return (
    <>
      <ToastContainer />

      {controls.deleteId && (
        <Confirmation
          title="are you sure?"
          btnYes="No"
          btnNo="Yes"
          clickA={() => setControls({ ...controls, deleteId: null })}
          clickB={() => deleteT(controls.deleteId)}
        ></Confirmation>
      )}
      <div className="parent testimonails">
        <div className="container testimonails-container ">
          <div className="header">
            <div className="title">
              <div className="back"></div>
              <h2>Testimonials Content </h2>
            </div>
            <div className="btns ">
              {controls.updateId ? (
                <button
                  className={
                    controls.name &&
                      controls.name.length <= 20 &&
                      controls.review &&
                      controls.review.length <= 200
                      ? "btn"
                      : "btn disabled"
                  }
                  onClick={updateT}
                >
                  Update Review
                </button>
              ) : (
                <button
                  className={
                    controls.name &&
                      controls.name.length <= 20 &&
                      controls.review &&
                      controls.review.length <= 200
                      ? "btn"
                      : "btn disabled"
                  }
                  onClick={createT}
                >
                  Publish Review
                </button>
              )}
              <button
                className="btn2"
                onClick={() => {
                  setIsLoading(true);
                  getTestimonials().then((data) => {
                    setData(data);
                    setIsLoading(false);
                  });
                  toast.info("Data Refreshed", {
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

          <div className="content">
            <div className="left">
              <div className="instruction">
                <div
                  className="inst-heading"
                  onClick={() =>
                    setControls({
                      ...controls,
                      instruction: !controls.instruction,
                    })
                  }
                >
                  <h2>Instructions</h2>
                  <button
                    className="btn4"
                    style={
                      controls.instruction
                        ? { transform: "rotate(180deg)" }
                        : { transform: "rotate(0deg)" }
                    }
                  >
                    <IoMdArrowDropdown />
                  </button>
                </div>
                {controls.instruction && (
                  <div className="inst-content">
                    <p>
                      <span>1.</span> Adding a New Testimonial Fill out the form
                      on the right to add a new review.
                    </p>
                    <p>
                      <span>2.</span> Publishing Content Click the
                      <span>Publish</span> button to make the testimonials live.
                    </p>
                    <p>
                      <span>3.</span> Editing a Testimonial Click the
                      <span>
                        <MdModeEdit />
                      </span>
                      icon to edit an existing review. The selected content will
                      automatically populate in the form.
                    </p>
                    <p>
                      <span>4.</span> Updating Changes The <span>Update</span>
                      button will only appear after selecting a testimonial for
                      editing.
                    </p>
                    <p>
                      <span>5.</span> Review Limit A maximum of
                      <span>7 testimonials</span> can be stored at a time.
                    </p>
                    <p>
                      <span>6.</span> Refreshing Data Click the
                      <span>Refresh</span> button to load the latest
                      testimonials from the database.
                    </p>
                    <p>
                      <span>7.</span> Minimum Requirement Ensure at least
                      <span>3 testimonials</span> are available to keep the
                      section visible on the main site.
                    </p>
                  </div>
                )}
              </div>
              {data && !isLoading ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Sr. No</th> <th>Name</th> <th>Review</th>
                        <th>Stars</th> <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data[0].responseMessage === "Testemonials not found" ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No testimonials found, Please add some
                          </td>
                        </tr>
                      ) : (
                        data.map((tdata, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td> <td>{tdata?.data?.name}</td>
                            <td>{tdata?.data?.feedBack}</td>
                            <td>
                              {tdata?.data?.stars &&
                                `${tdata.data.stars} Stars`}
                            </td>
                            <td>
                              <button
                                className="btn4"
                                onClick={() => {
                                  setControls({
                                    ...controls,
                                    updateId: tdata.data.id,
                                    name: tdata.data.name,
                                    review: tdata.data.feedBack,
                                    star: tdata.data.stars,
                                  });
                                }}
                              >
                                <MdModeEdit />
                              </button>
                              <button
                                className="btn4"
                                onClick={() =>
                                  setControls({
                                    ...controls,
                                    deleteId: tdata.data.id,
                                  })
                                }
                              >
                                <MdDeleteOutline />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="loading">Loading DataBase...</p>
              )}
            </div>
            <div className="right">
              {controls.updateId ? (
                <h2>Update Testimonials </h2>
              ) : (
                <h2>Add New Testimonials </h2>
              )}
              <form>
                <label>
                  <div className="top">
                    <p>Client Name*</p>
                    <div
                      className={`counter ${controls.name.length > 20 ? "error" : ""
                        }`}
                    >
                      {controls.name.length}/20
                    </div>
                  </div>
                  <input
                    type="text"
                    value={controls.name}
                    onChange={(e) =>
                      setControls({ ...controls, name: e.target.value })
                    }
                  />
                  {controls.name.length > 20 && (
                    <span className="error">Only 20 characters allowed</span>
                  )}
                </label>
                <label>
                  <div className="top">
                    <p>Review Content*</p>
                    <div
                      className={
                        controls.review.length > 200
                          ? "counter error"
                          : "counter"
                      }
                    >
                      {controls.review.length}/200
                    </div>
                  </div>
                  <textarea
                    type="text"
                    value={controls.review}
                    onChange={(e) =>
                      setControls({ ...controls, review: e.target.value })
                    }
                  />
                  {controls.review.length > 200 && (
                    <span className="error">Review message is too long</span>
                  )}
                </label>
                <label>
                  <div className="top">
                    <p>Star Rating*</p>
                  </div>
                  <div className="stars">
                    <div
                      className={controls.star > 0 ? "star active" : "star"}
                      onClick={() => setControls({ ...controls, star: 1 })}
                    >
                      <IoMdStar />
                    </div>
                    <div
                      className={controls.star > 1 ? "star active" : "star"}
                      onClick={() => setControls({ ...controls, star: 2 })}
                    >
                      <IoMdStar />
                    </div>
                    <div
                      className={controls.star > 2 ? "star active" : "star"}
                      onClick={() => setControls({ ...controls, star: 3 })}
                    >
                      <IoMdStar />
                    </div>
                    <div
                      className={controls.star > 3 ? "star active" : "star"}
                      onClick={() => setControls({ ...controls, star: 4 })}
                    >
                      <IoMdStar />
                    </div>
                    <div
                      className={controls.star > 4 ? "star active" : "star"}
                      onClick={() => setControls({ ...controls, star: 5 })}
                    >
                      <IoMdStar />
                    </div>
                  </div>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
