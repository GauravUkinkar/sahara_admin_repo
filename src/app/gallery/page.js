"use client";

import React, { useEffect, useState } from "react";
import "./Gallery.scss";
import { MdModeEditOutline } from "react-icons/md";
import axios from "axios";
import { MdCloudUpload } from "react-icons/md";
import { MdDelete } from "react-icons/md";
const Page = () => {
  const [images, setImages] = useState([]);
  const [popup, setPopUp] = useState(false);
  const [imagefile, setImageFile] = useState();
  const [editId, setEditId] = useState();
  const [delayeMessage, setDelayedMessage] = useState(false);

  const getAllImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/MediaController/getAllImage`
      );
      console.log(response.data.data, "response>>>");

      setImages(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  // add image

  const addImage = async (e) => {
    try {
      e.preventDefault();
      let response;
      const formData = new FormData();

      formData.append("file", imagefile);

      if (editId) {
        formData.append("mId", editId);
      }

      if (editId) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/MediaController/updateImage`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/MediaController/uploadImage`,
          formData
        );
      }

      if (response.status === 200) {
        setDelayedMessage(true);
        getAllImages();
        setImageFile(null);
        setPopUp(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // openedit Popup

  const openEditPopUp = (id) => {
    setEditId(id);
    setPopUp(true);
  };

  // delete image

  const deleteImage = async (id) => {
    try {
      const confirm = window.confirm("Are You sure want to delete this image?");

      if (!confirm) return;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/MediaController/deleteImage?iId=${id}`
      );

      if (response.status === 200) {
        getAllImages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(images, "images")

  return (
    <>
      {/* popup */}
      {popup && (
        <div class="popup">
          <div class="overlay" onClick={() => setPopUp(false)}></div>
          <form action="" className="form" onSubmit={addImage}>
            <div class="upload_image">
              <MdCloudUpload />
              <p>Upload Image</p>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <button className="btn" type="submit">
              Add Image
            </button>
          </form>
        </div>
      )}

      <div class="gallery parent">
        <div class="gallery_cont container">
          <div class="header">
            <div class="title">
              <h2>Gallery</h2>
            </div>

            {delayeMessage && (
              <p>
                The Gallery is currently under maintenance. Please check 1 min
                later.
              </p>
            )}

            <div class="btns">
              <button className="btn" onClick={() => setPopUp(true)}>
                Add Image
              </button>
            </div>
          </div>

          <div class="gallery_list">
            {Array.isArray(images) &&
              images?.map((item, index) => (
                <>
                  <div
                    class="image "
                    key={index}
                    style={{ backgroundImage: `url(${item?.images})` }}
                  >
                    <div class="overlay">
                      {/* <div
                        class="icon"
                        onClick={() => openEditPopUp(item?.iid)}
                      >
                        <MdModeEditOutline />
                      </div> */}
                      <div
                        class="icon"
                        onClick={() => deleteImage(item?.iid)}
                      >
                        <MdDelete />
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
