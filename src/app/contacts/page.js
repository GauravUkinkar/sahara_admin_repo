"use client";
import { useEffect, useState } from "react";
import "./contacts.scss";
import { getContacts, deleteContacts } from "../(api)/contactAPi";
import Confirmation from "../(comps)/confirmation/Confirmation";
import { IoMdArrowDropdown } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import ThemeStore from "../(comps)/store/Theme";

const Page = () => {
  const { isDarkMode } = ThemeStore();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controls, setControls] = useState({
    deleteId: null,
    search: "",
    instruction: true,
    
  });

  const loadData = () => {
    setIsLoading(true);
    getContacts()
      .then((response) => {
        if (Array.isArray(response) && response.length > 0) {
          if (response[0].status === "BAD_REQUEST") {
            setData([]);
          } else {
            setData(response.filter((item) => item?.data));
          }
        } else {
          setData([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteC = async (id) => {
    try {
      await deleteContacts(id);
      const updatedData = await getContacts();
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsLoading(false);
      setControls({ ...controls, deleteId: null });
      toast.warning("1 Contact Deleted", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const filteredData = data
    .filter((cdata) => cdata.data)
    .filter((cdata) =>
      [
        cdata.data.name,
        cdata.data.email,
        cdata.data.phoneNumber,
        cdata.data.message,
        cdata.data.activity,
      ].some((field) =>
        field?.toLowerCase().includes(controls.search.toLowerCase())
      )
    );

  return (
    <>
      <ToastContainer />
      {controls.deleteId && (
        <Confirmation
          btnYes="Cancel"
          btnNo="Delete"
          title="Confirm Deletion"
          clickA={() => setControls({ ...controls, deleteId: null })}
          clickB={() => deleteC(controls.deleteId)}
        />
      )}

      <div className="parent contacts">
        <div className="contacts-container container">
          <div className="header">
            <div className="title">
              <h2>Contact Requests</h2>
            </div>
            <div className="btns">
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

          <div className="instruction">
            <div
              className="inst-heading"
              onClick={() =>
                setControls({ ...controls, instruction: !controls.instruction })
              }
            >
              <h2>How to Use</h2>
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
                  <span>1.</span> Use the search bar to find specific contacts
                  by name, email, phone, activity or message.
                </p>
                <p>
                  <span>2.</span> Click <span>Refresh Data</span> to load the
                  latest information.
                </p>
                <p>
                  <span>3.</span> <span>Delete</span> contacts after processing
                  to keep your records clean.
                </p>
                <p>
                  <span>4.</span> If no contacts appear, wait for new
                  submissions or refresh the page.
                </p>
              </div>
            )}
          </div>

          <label>
            <input
              placeholder="Search contacts by name, email, or phone number..."
              type="text"
              value={controls.search}
              onChange={(e) =>
                setControls({ ...controls, search: e.target.value })
              }
            />

            {filteredData.length > 0 && controls.search.length > 0 && (
              <span className="success">
                {filteredData.length} results found
              </span>
            )}

            {filteredData.length === 0 && controls.search.length > 0 && (
              <span className="error">No matching contacts found</span>
            )}
          </label>

          <div className="table-box">
            {!isLoading ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Activity</th>
                    {/* <th>Status</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        {controls.search.length > 0
                          ? "No matching contacts found."
                          : "No contact requests available yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((cdata, index) => (
                      <tr key={index}>
                        <td>{cdata.data.cId}</td>
                        <td>{cdata.data.name}</td>
                        <td>{cdata.data.email}</td>
                        <td>{cdata.data.phoneNumber}</td>
                        <td>{cdata.data.message}</td>
                        <td>{cdata.data.activity}</td>
                        {/* <td>{cdata.data.status}</td> */}
                        <td>
                          <button
                            className="btn2"
                            onClick={() =>
                              setControls({
                                ...controls,
                                deleteId: cdata.data.cId,
                              })
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
