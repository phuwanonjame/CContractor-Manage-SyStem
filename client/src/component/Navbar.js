import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));
  const [popupmenu, setpopup] = useState(false);
  console.log("หน้า  home", [user]);
  const settingPopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingPopupRef.current &&
        !settingPopupRef.current.contains(event.target)
      ) {
        setpopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingPopupRef]);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "คุณแน่ใจที่จะออกจากระบบ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout !",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logout!",
          text: "ออกจากระบบเรียบร้อย",
          icon: "success",
        });
        localStorage.removeItem("user");
        setpopup(false);
        window.location.href = "/login";
      }
    });
  };

  const[opennavbar,setOpennavbar]=useState(false);
  const[opensetting,setSetting]=useState(false);
  return (
    <div className="bodynavber">
    <div className="humbar ">
   
      <div className="w-screen h-10 bg-teal-500 z-40 fixed flex justify-between items-center">
      <div className=" flex">
          <p className=" text-base mr-3">{user && user[0]?.FullName}</p>
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>
      <div className="icon flex items-center justify-end relative  right-8">
      <i class="fa-solid fa-bars text-2xl ml-4 cursor-pointer absolute z-50" onClick={()=>setOpennavbar(prevState => !prevState)}></i>
      </div>
      </div>
      {opennavbar && (<div className= " bg-slate-200 w-screen h-auto fixed z-30 ">
        <Link to="/" className=" mt-12 flex items-center justify-center p-4  bg-slate-300 cursor-pointer "onClick={()=>setOpennavbar(false)}>
          <p className=" text-1xl">Dashboard</p>
          </Link>
          <Link to="/Assignworks" className=" mt-1 flex items-center justify-center p-4 bg-slate-300 cursor-pointer"onClick={()=>setOpennavbar(false)}>
          <p className=" text-1xl">AssignWork</p>
          </Link>
          <Link to="/Contractors" className=" mt-1 flex items-center p-4 justify-center  bg-slate-300 cursor-pointer"onClick={()=>setOpennavbar(false)}>
          <p className=" text-1xl">Contractor</p>
          </Link>
          <Link to="/Managework" className=" mt-1 flex items-center justify-center p-4 bg-slate-300 cursor-pointer"onClick={()=>setOpennavbar(false)}>
          <p className=" text-1xl">Managework</p>
          </Link>
          <div className=" mt-1 flex items-center justify-center p-4 mb-2 bg-slate-300 cursor-pointer"onClick={()=>setSetting(prevState => !prevState)}>
          <p className=" text-1xl">setting</p>
          </div>
          {opensetting &&(
            <div className=" mt-1 flex items-center justify-center bg-red-500 p-4 mb-2  cursor-pointer"onClick={handleLogout}>
            <p className=" text-1xl" >Logout</p>
            </div>
          )}
      </div>
      )}
    </div>
    
    <div className="navbar w-48 text-lg bg-stone-300 h-screen">
 
      <div className="  h-28 text-center flex items-center justify-center ">
        <img
          src="https://logos-world.net/wp-content/uploads/2022/03/Insider-Logo.png"
          className=" w-3/4 h-3/4 "
          alt=""
        ></img>
      </div>
      <div className="menu ">
        <div className="w-full text-center">
          <p className=" text-base">{user && user[0]?.FullName}</p>
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>
        <div className="bg-menu">
          <Link
            to="/"
            className="box-menu bg-slate-600 text-center  flex justify-center items-center cursor-pointer mt-5 hover:opacity-50 "
          >
            <i
              class="fa-solid fa-house text-4xl"
              style={{ color: "#FFFFFF" }}
            ></i>
            <p className="m-4 text-1xl text-slate-100">Dashboard</p>
          </Link>
          <Link
            to="/Assignworks"
            className="box-menu bg-slate-600 text-center  flex justify-center items-center cursor-pointer mt-1 hover:opacity-50"
          >
            <i
              class="fa-solid fa-briefcase text-4xl"
              style={{ color: "#FFFFFF" }}
            ></i>

            <p className="m-4 text-1xl text-slate-100">AssignWork</p>
          </Link>
          <Link
            to="/Contractors"
            className="box-menu bg-slate-600 text-center  flex justify-center items-center cursor-pointer mt-1 hover:opacity-50"
          >
            <i
              class="fa-solid fa-user-tie text-4xl"
              style={{ color: "#FFFFFF" }}
            ></i>
            <p className="m-4 text-1xl text-slate-100">Contractor</p>
          </Link>
          <Link
            to="/Managework"
            className="box-menu bg-slate-600 text-center  flex justify-center items-center cursor-pointer mt-1 hover:opacity-50"
          >
            <i
              class="fa-solid fa-list-check text-4xl"
              style={{ color: "#FFFFFF" }}
            ></i>
            <p className="m-4 text-1xl text-slate-100">ManageWorks</p>
          </Link>
          <div
            className="box-menu bg-slate-600 text-center  flex justify-center items-center cursor-pointer mt-1 hover:opacity-50"
            onClick={() => setpopup(!popupmenu)}
          >
            <i class="fas fa-gear text-4xl" style={{ color: "#FFFFFF" }}></i>
            <p className="m-4 text-1xl text-slate-100">Setting</p>
          </div>
        </div>
      </div>
    
      {popupmenu && (
        <div className="settingpopup" ref={settingPopupRef}>
          <div className="menu">
            <div className="menuset bg-red-600 mt-1 cursor-pointer hover:opacity-50">
              <h3 className=" text-center text-slate-50 p-5" onClick={handleLogout}>
                Logout
              </h3>
            </div>
          </div>
        </div>
      )}
       
    </div>
    </div>
  );
}

export default Navbar;
