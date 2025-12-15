"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./login.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ThemeStore from "../(comps)/store/Theme";

const Page = () => {
  const { isDarkMode } = ThemeStore();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("id")) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/Login`,
        login
      );
      console.log(response.data.data.id);

      if (response.status === 200) {
        toast.success("Login success", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          theme: isDarkMode ? "dark" : "light",
        });
        localStorage.setItem("id", response.data.data.id);

        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Wrong Credentials", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          theme: isDarkMode ? "dark" : "light",
        });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="parent login-parent">
        <div className="cont login-cont">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <label for="">
              <p>User Name</p>
              <input
                type="text"
                value={login.email}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    email: e.target.value,
                  })
                }
              />
            </label>

            <label for="">
              <p>Password</p>
              <input
                type="password"
                value={login.password}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    password: e.target.value,
                  })
                }
              />
            </label>

            <button className="btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
