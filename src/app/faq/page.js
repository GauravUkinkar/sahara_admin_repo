"use client";

import React, { useEffect, useState } from "react";
import "./faq.scss";
import { addFaqs, getFaqs } from "../(api)/faqApi";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import { getActivity } from "../(api)/ActivityApi";
import axios from "axios";
import Confirmation from "../(comps)/confirmation/Confirmation";

const Page = () => {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [controls, setControls] = useState({
    deleteId: null,
    search: "",
    instruction: true,
    question: "",
    answer: "",
    page: "",
  });

  const [confirmBox, setConfirmBox] = useState(false);

  const [error, setError] = useState({});

  const handleError = (values) => {
    let errors = {};
    if (!values.question) {
      errors.question = "please enter question";
    } else if (values.question.length >= 100) {
      errors.question = "enter max 100 characters";
    }
    if (!values.answer) {
      errors.answer = "please enter answer";
    } else if (values.answer.length >= 500) {
      errors.answer = "enter max 500 characters";
    }
    if (!values.page) {
      errors.page = "select one page";
    }

    return errors;
  };
 
  console.log(error, "error");

  const getdata = () => {
    setIsLoading(true);
    getActivity().then((pagedata) => {
      setPages(pagedata);
    });
    getFaqs().then((data) => {
      setData(data);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getdata();

    getActivity().then((data) => {
      setPageData(data);
    });
  }, []);

  const handleaddFaq = async () => {
    const newErrors = handleError(controls);
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors); // Set errors if validation fails
      return;
    }

    setError({});
    try {
      setIsLoading(true);
      // const response = await addFaqs(
      //   controls.question,
      //   controls.answer,
      //   controls.page
      // );

      const faqdata = {
        question: controls.question,
        answer: controls.answer,
        page: controls.page,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/faq/addFaq`,
        faqdata
      );

      if (response) {
        const updatedData = await getFaqs();
        setData(updatedData);
        setControls({ ...controls, question: "", answer: "", page: "" });
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFaqDataById = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/faq/getById/${id}`
      );

      if (response.status === 200) {
        setControls({
          question: response?.data?.data.question,
          answer: response?.data?.data.answer,
          page: response?.data?.data.page,
          id: id,
        });

        setIsUpdate(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFaq = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/faq/updateFaq`,
        controls
      );
      getdata();
      setIsUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenConfirm = (id)=>{
     localStorage.setItem("id",id);
     setConfirmBox(true)
  }

  const deleFaq = async () => {
    try {
      const id = localStorage.getItem("id")
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/faq/DeleteFaq/${id}`
      );

      console.log(response);
      getdata();
      setConfirmBox(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {confirmBox && (
        <Confirmation
          title="Are You Sure delete faq"
          btnYes="Cancel"
          btnNo="Delete"
          clickB={deleFaq}
          clickA={()=>setConfirmBox(false)}
        />
      )}
      <div className="parent faq">
        <div className="faq-container container">
          <div className="header">
            <div className="title">
              <div className="back"></div>
              <h2>FAQs Content </h2>
            </div>
            <div className="btns ">
              {isUpdate ? (
                <button className="btn" onClick={() => updateFaq()}>
                  Update FAQ
                </button>
              ) : (
                <button className="btn" onClick={handleaddFaq}>
                  Add FAQ
                </button>
              )}
              <button className="btn2" onClick={() => getdata()}>
                Refresh Data
              </button>
            </div>
          </div>
          <div className="content">
            <div className="left">
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Page</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data[0] &&
                    data.map((fdata, index) => (
                      <tr key={index}>
                        <td>{fdata.data.id}</td>
                        <td>{fdata.data.question}</td>
                        <td>{fdata.data.answer}</td>
                        <td>{fdata.data.page}</td>
                        <td>
                          <button
                            className="btn4"
                            onClick={() => getFaqDataById(fdata.data.id)}
                          >
                            <MdModeEdit />
                          </button>
                          <button
                            className="btn4"
                            onClick={() => handleOpenConfirm(fdata.data.id)}
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="right">
              <h2>Add New FAQ</h2>
              <label>
                <div className="top">
                  <p>Question*</p>
                  <div
                    className={
                      controls.question.length > 100
                        ? "counter error"
                        : " counter"
                    }
                  >
                    {controls.question.length}/100 character
                  </div>
                </div>
                <textarea
                  value={controls.question}
                  onChange={(e) =>
                    setControls({ ...controls, question: e.target.value })
                  }
                />
                {error?.question && (
                  <span className="error">{error?.question}</span>
                )}
              </label>
              <label>
                <div className="top">
                  <p>Answer*</p>
                  <div
                    className={
                      controls.answer.length > 500
                        ? "counter error"
                        : " counter"
                    }
                  >
                    {controls.answer.length}/500 character
                  </div>
                </div>
                <textarea
                  className="ans"
                  value={controls.answer}
                  onChange={(e) =>
                    setControls({ ...controls, answer: e.target.value })
                  }
                />
                {error?.answer && (
                  <span className="error">{error?.answer}</span>
                )}
              </label>
              <label>
                <div className="top">
                  <p>Page*</p>
                  {/* <div className={"error"}>34/50 character</div> */}
                </div>
                <select
                  value={controls.page}
                  onChange={(e) =>
                    setControls({ ...controls, page: e.target.value })
                  }
                >
                  <option> Select Page </option>
                  {pageData.map((item, index) => (
                    <option key={index} value={item.data.title}>
                      {" "}
                      {item.data.title}{" "}
                    </option>
                  ))}
                </select>
                {error?.page && <span className="error">{error?.page}</span>}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
