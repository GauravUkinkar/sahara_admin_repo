
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmIds, setConfirmIds] = useState([]);

  const [controls, setControls] = useState({
    search: "",
    instruction: true,
  });

  // Fetch contacts
  const loadData = async () => {
    setIsLoading(true);

    try {
      const response = await getContacts();

      if (Array.isArray(response)) {
        if (response[0]?.status === "BAD_REQUEST") {
          setData([]);
        } else {
          setData(response.filter((item) => item?.data));
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter contacts
  const filteredData = data
    .filter((item) => item?.data)
    .filter((item) => {
      const search = controls.search.toLowerCase();

      return [
        item.data.name,
        item.data.email,
        item.data.phoneNumber,
        item.data.message,
        item.data.activity,
      ].some((field) =>
        String(field ?? "").toLowerCase().includes(search)
      );
    });

  // IDs of contacts currently displayed after searching
  const visibleIds = filteredData
    .map((item) => item.data.cId)
    .filter((id) => id !== null && id !== undefined);

  // Check whether every visible contact is selected
  const allSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds.includes(id));

  // Select/deselect all visible contacts
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds((previous) => [
        ...new Set([...previous, ...visibleIds]),
      ]);
    } else {
      setSelectedIds((previous) =>
        previous.filter((id) => !visibleIds.includes(id))
      );
    }
  };

  // Select/deselect one contact
  const handleSelectOne = (id, checked) => {
    setSelectedIds((previous) =>
      checked
        ? [...new Set([...previous, id])]
        : previous.filter((selectedId) => selectedId !== id)
    );
  };

  // Open confirmation for selected contacts
  const openDeleteConfirmation = (ids) => {
    if (ids.length === 0) {
      toast.info("Please select at least one contact.", {
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    setConfirmIds([...ids]);
  };

  // Delete selected contacts
  const deleteSelected = async () => {
    if (confirmIds.length === 0) return;

    const idsToDelete = [...confirmIds];
    setConfirmIds([]);
    setIsLoading(true);

    try {
      const results = await Promise.allSettled(
        idsToDelete.map((id) => deleteContacts(id))
      );

      const failedIds = results
        .map((result, index) =>
          result.status === "rejected" ? idsToDelete[index] : null
        )
        .filter((id) => id !== null);


      //  Refresh the contact list after deletion attempts
      const response = await getContacts();

      const latestData =
        Array.isArray(response) &&
          response[0]?.status !== "BAD_REQUEST"
          ? response.filter((item) => item?.data)
          : [];

      setData(latestData);

      const remainingIds = latestData.map((item) => item.data.cId);
      setSelectedIds((previous) =>
        previous.filter((id) => remainingIds.includes(id))
      );

      if (failedIds.length === 0) {
        toast.success(
          `${idsToDelete.length} contact${idsToDelete.length > 1 ? "s" : ""
          } deleted successfully.`,
          {
            position: "top-center",
            autoClose: 1500,
            theme: isDarkMode ? "dark" : "light",
          }
        );
      } else {
        toast.warning(
          `${idsToDelete.length - failedIds.length} deleted; ${failedIds.length
          } failed. Please try again.`,
          {
            position: "top-center",
            autoClose: 2500,
            theme: isDarkMode ? "dark" : "light",
          }
        );
      }
    } catch (error) {
      console.error("Error deleting contacts:", error);

      toast.error("Unable to refresh contacts. Please try again.", {
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      {confirmIds.length > 0 && (
        <Confirmation
          btnYes="Cancel"
          btnNo="Delete"
          title={
            confirmIds.length === data.length
              ? `Delete All ${confirmIds.length} Contacts?`
              : `Delete ${confirmIds.length} Selected Contact${confirmIds.length > 1 ? "s" : ""
              }?`
          }
          clickA={() => setConfirmIds([])}
          clickB={deleteSelected}
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
                  toast.info("Refreshing contact requests...", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: isDarkMode ? "dark" : "light",
                  });
                }}
              >
                Refresh Data
              </button>

              <button
                className="btn2"
                disabled={selectedIds.length === 0 || isLoading}
                onClick={() =>
                  openDeleteConfirmation(selectedIds)
                }
              >
                Delete Selected ({selectedIds.length})
              </button>

              <button
                className="btn2"
                disabled={data.length === 0 || isLoading}
                onClick={() => {
                  const allIds = data
                    .map((item) => item.data?.cId)
                    .filter(
                      (id) => id !== null && id !== undefined
                    );

                  setSelectedIds(allIds);
                  openDeleteConfirmation(allIds);
                }}
              >
                Delete All
              </button>
            </div>
          </div>

          <div className="instruction">
            <div
              className="inst-heading"
              onClick={() =>
                setControls((previous) => ({
                  ...previous,
                  instruction: !previous.instruction,
                }))
              }
            >
              <h2>How to Use</h2>

              <button
                className="btn4"
                style={{
                  transform: controls.instruction
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                <IoMdArrowDropdown />
              </button>
            </div>

            {controls.instruction && (
              <div className="inst-content">
                <p>
                  <span>1.</span> Search contacts by name, email, phone,
                  activity, or message.
                </p>
                <p>
                  <span>2.</span> Use the checkbox in the table header to
                  select or deselect all visible contacts.
                </p>
                <p>
                  <span>3.</span> Select individual contacts to delete
                  only those records.
                </p>
                <p>
                  <span>4.</span> Use Delete Selected or Delete All and
                  confirm the deletion.
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
                setControls((previous) => ({
                  ...previous,
                  search: e.target.value,
                }))
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
                    <th>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        disabled={visibleIds.length === 0}
                        onChange={(e) =>
                          handleSelectAll(e.target.checked)
                        }
                        aria-label="Select all visible contacts"
                      />
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        {controls.search.length > 0
                          ? "No matching contacts found."
                          : "No contact requests available yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((cdata) => {
                      const contact = cdata.data;

                      return (
                        <tr key={contact.cId}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(contact.cId)}
                              onChange={(e) =>
                                handleSelectOne(
                                  contact.cId,
                                  e.target.checked
                                )
                              }
                              aria-label={`Select ${contact.name}`}
                            />
                          </td>

                          <td>{contact.cId}</td>
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.phoneNumber}</td>
                          <td>{contact.message}</td>
                          <td>{contact.activity}</td>

                          <td>
                            <button
                              className="btn2"
                              onClick={() =>
                                openDeleteConfirmation([contact.cId])
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
