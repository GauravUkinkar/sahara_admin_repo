"use client";

import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import "./addActivity.scss";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("activityId");
  const router = useRouter();
  const [addData, setAddData] = useState({
    title: "",
    activityTitle: "",
    description: "",
    additionalInfo: {},
  });
  const [image, setimage] = useState({
    image: null,
    imagePrev: "",
  });
  const [coverImage, setCoverImage] = useState({
    coverImage: null,
    coverImagePrev: "",
  });

  const [controls, setControls] = useState({
    view: "feature",
    saveState: true,
    resetState: false,
  });

  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" }]);

  const handleInputChange = (index, type, value) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index][type] = value;
    setKeyValuePairs(updatedPairs);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    if (type === "feature") {
      setimage({ image: file, imagePrev: fileUrl });
    } else if (type === "cover") {
      setCoverImage({ coverImage: file, coverImagePrev: fileUrl });
    }
  };

  const handleAddRow = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
  };

  useEffect(() => {
    const updatedInfo = {}; // Create a new object to store key-value pairs

    keyValuePairs.forEach((item) => {
      if (item.key.trim() && item.value.trim()) {
        updatedInfo[item.key] = item.value; // Add key-value pairs dynamically
      }
    });

    setAddData((prev) => ({
      ...prev,
      additionalInfo: updatedInfo,
    }));
  }, [keyValuePairs]);

  const addActivity = async () => {
    try {
      const formdata = new FormData();

      if (id) {
        formdata.append("data", JSON.stringify({ ...addData, aid: id }));
      }else{
        formdata.append("data", JSON.stringify(addData));
      }
     
      formdata.append("image", image.image);
      formdata.append("coverImage", coverImage.coverImage);
      let response;

      if (id) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/activity/update`,
          formdata
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/activity/Add`,
          formdata
        );
      }

      console.log(response)
      if (response.status === 201) {
       router.push("/activity")
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getActivtyData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/getById?activityId=${id}`
      );

      setAddData({
        title: response.data.data.title,
        activityTitle: response.data.data.activityTitle,
        description: response.data.data.description,
      });

      setimage({
        image:null,
        imagePrev: response.data.data.image,
      });

      setCoverImage({
        coverImage:null,
        coverImagePrev: response.data.data.coverImage,
      });
      const additionalInfoArray = Object.entries(
        response.data.data.additionalInfo
      ).map(([key, value]) => ({
        key,
        value,
      }));

      setKeyValuePairs(additionalInfoArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getActivtyData(id);
    }
  }, [id]);

  return (
    <>
      <div className="parent homepage">
        <div className="container homepage-container ">
          <div className="header">
            <div className="title">
              <div className="back"></div>
              <h2>Add Acitivty Page Content </h2>
            </div>
            <div className="btns">
              <button className="btn " onClick={addActivity}>
                {id ? "Update" : "Save"}
              </button>
              <button className="btn2 ">Reset</button>
            </div>
          </div>
          <form>
            <div className="left">
              <div className="row">
                <label>
                  <div className="top">
                    <p>Title *</p>
                  </div>
                  <input
                    placeholder="your activity title goes here..."
                    type="text"
                    value={addData.title}
                    onChange={(e) =>
                      setAddData({ ...addData, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  <div className="top">
                    <p>Activity Title *</p>
                    <div
                      className={`counter ${
                        addData?.title?.length > 49 ? "error" : ""
                      }`}
                    >
                      {addData?.title?.length}/50 character
                    </div>
                  </div>
                  <input
                    placeholder="your main activity title goes here..."
                    type="text"
                    value={addData.activityTitle}
                    onChange={(e) =>
                      setAddData({ ...addData, activityTitle: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="row">
                <label>
                  <div className="top">
                    <p>Activity Description*</p>
                    <div className="counter">10/10</div>
                  </div>
                  <textarea
                    placeholder="your activity description goes here..."
                    type="text"
                    value={addData.description}
                    onChange={(e) =>
                      setAddData({ ...addData, description: e.target.value })
                    }
                  />
                </label>
              </div>
              {keyValuePairs.map((pair, index) => (
                <div className="row" key={index}>
                  <label>
                    <div className="top">
                      <p>Activity Key*</p>
                      <div className="counter">10/10</div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter key"
                      value={pair.key}
                      onChange={(e) =>
                        handleInputChange(index, "key", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    <div className="top">
                      <p>Activity Value*</p>
                      <div className="counter">10/10</div>
                    </div>
                    <div className="append_button">
                      <input
                        type="text"
                        placeholder="Enter value"
                        value={pair.value}
                        onChange={(e) =>
                          handleInputChange(index, "value", e.target.value)
                        }
                      />
                      <div className="plus_button" onClick={handleAddRow}>
                        {" "}
                        <GoPlus />{" "}
                      </div>
                      {index > 0 && (
                        <div
                          className="minus_button"
                          onClick={() => handleRemoveRow(index)}
                        >
                          {" "}
                          <LuMinus />{" "}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
              <div className="row">
                <label>
                  <div className="top">
                    <p>Feature Image *</p>
                  </div>
                  <input
                    placeholder="your main hero heading goes here..."
                    type="file"
                    onChange={(e) => handleFileChange(e, "feature")}
                  />
                </label>
                <label>
                  <div className="top">
                    <p>Cover Image *</p>
                  </div>
                  <input
                    placeholder="your main hero heading goes here..."
                    type="file"
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                </label>
              </div>
            </div>
            <div className="right">
              <div className="video-select">
                <div
                  className={`option ${
                    controls.view === "feature" ? "active" : ""
                  }`}
                  onClick={() => setControls({ ...controls, view: "feature" })}
                >
                  Feature Image
                </div>
                <div
                  className={`option ${
                    controls.view === "cover" ? "active" : ""
                  }`}
                  onClick={() => setControls({ ...controls, view: "cover" })}
                >
                  Cover Image
                </div>
              </div>
              <div className={`video-box ${controls.view}`}>
                {controls.view === "feature" && (
                  <img src={image.imagePrev} alt="" />
                )}

                {controls.view === "cover" && (
                  <img src={coverImage.coverImagePrev} alt="" />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
