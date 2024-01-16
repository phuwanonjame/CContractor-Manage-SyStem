import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const navigate = useNavigate();
  function loginuser() {
    axios
      .post("http://localhost:3001/ginlo", { user, pass })
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        const timeout = 1600;
        setTimeout(() => {
          console.log(response.data, "พบข้อมูล");
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");
        }, timeout);
      })
      .catch((err) => {
        Swal.fire("user หรือ password ไม่ถูกต้อง!");
        console.log(err, "เกิดข้อผิดพลาดในการ login");
      });
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      window.location.href = "/";
    }
  });
  return (
    <div className="w-screen h-screen  flex items-center justify-center login">
      <div className="img ">
        <img
          className="mr-20"
          src="https://logowik.com/content/uploads/images/gears-in-the-head1848.logowik.com.webp"
          style={{ width: "500px", height: "350px" }}
          alt=""
        ></img>
        <p className=" text-2xl ml-24 text-sky-500">Contractor Manage SyStem</p>
        <p className=" text-sm ml-48 text-black">Power By CPETC</p>
      </div>
      <div className="pos-login "> 
      <div className=" w-96 h-96 bg-slate-300 rounded-md drop-shadow-md">
        <div className="header flex text-center items-center justify-center ">
          <p className="text-2xl mt-4 text-red-700 ">Login-SIG</p>
        </div>
        <div className="body flex items-center justify-center mt-10 ">
          <div className="">
            <p className="text-2xl mt-4">Username</p>
            <input
              value={user}
              onChange={(e) => setUsername(e.target.value)}
              className=" rounded-md w-56 h-8"
            ></input>
          </div>
        </div>
        <div className="body flex items-center justify-center">
          <div className="">
            <p className="text-2xl mt-4">Password</p>
            <input
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              className=" rounded-md w-56 h-8"
            ></input>
          </div>
        </div>
        <div className="flex items-center justify-center mt-10">
          <button
            className=" w-36 h-14 bg-green-500 rounded-md hover:opacity-50"
            onClick={loginuser}
          >
            Login
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
