import axios from "axios";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [countwork, setCountwork] = useState("");
  const [countassignwork, setAssignwork] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  function loaddata() {
    axios
      .post("http://localhost:3001/dashboard")
      .then((response) => {
        console.log(response.data);
        setCountwork(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
    axios
      .post("http://localhost:3001/dbassign")
      .then((response) => {
        console.log(response.data);
        setAssignwork(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาด");
      });
  }

  useEffect(() => {
    loaddata();
    if (!user) {
      window.location.href = "/login";
    }
  }, ); 
  return (
    <div className="w-screen h-screen flex items-center justify-center z-0">
      <div className="body w-full m-10 h-full text-center">
        <p className="mt-10 text-2xl">Dashboard</p>
        <div className="box grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full mt-4">
          <div className="h-80 bg-red-600 rounded-lg mb-4 md:mb-0">
            <p className="text-5xl mt-2">Works</p>
            <p className="text-9xl mt-16">{countwork}</p>
          </div>
          <div className="h-80 bg-orange-500 rounded-lg mb-4 md:mb-0">
            <p className="text-5xl mt-2">AssignWork</p>
            <p className="text-9xl mt-16">{countassignwork}</p>
          </div>
          <div className="h-80 bg-green-500 rounded-lg mb-4 md:mb-0 pb-2 md:pb-0  ">
            <p className="text-5xl mt-2">Successful</p>
            <p className="text-9xl mt-16">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
