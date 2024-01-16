import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Contractos() {
  const [datacon, setDatacon] = useState([]);
  const [addFullname, setFullname] = useState("");
  const [addaddress, setAddress] = useState("");
  function loaddatacontractor() {
    axios
      .get("http://localhost:3001/contractors")
      .then((response) => {
        setDatacon(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการเรียกข้อมูล");
      });
  }
  useEffect(() => {
    loaddatacontractor();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  });
  function addcontractor() {
    const data = {
      Case: 2,
      Fname: addFullname,
      Address: addaddress,
    };
    if (addFullname === "" || addaddress === "") {
      Swal.fire("กรุณากรอกข้อมูลให้ครบ");
    } else {
      axios
        .post("http://localhost:3001/add", data)
        .then((response) => {
          console.log(response, "ส่งข้อมูลสำเร็จ");
          setFullname("");
          setAddress("");
        })
        .catch((err) => {
          console.log(err, "เกิดข้อมผิดพลาดในการทำงาน");
        });
    }
  }
  function deldata(id) {
    console.log("id contractor =", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        axios
          .post("http://localhost:3001/delete", { id: id })
          .then((response) => {
            console.log(response, "ลบข้อมูลสำเร็จ");
          })
          .catch((err) => {
            console.log(err, "เกิดข้อผิดพลาดในการลบข้อมูล");
          });
      }
    });
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="body w-full m-10 h-full text-center">
        <p className="mt-10 text-2xl">Contractors</p>

        <div className="input flex w-full items-center justify-center mt-2">
          <p className="mr-1"> Fullname:</p>
          <input
            className=" bg-slate-200 w-96 h-10"
            value={addFullname}
            onChange={(e) => setFullname(e.target.value)}
          ></input>
        </div>
        <div className="input flex w-full items-center justify-center mt-4 ml-1">
          <p className="mr-1">Address:</p>
          <input
            className=" bg-slate-200 w-96 h-10"
            value={addaddress}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
        </div>
        <button className="w-20 h-10 bg-green-400 hover:opacity-50 mr-2 rounded-md mt-2 " onClick={addcontractor}>Save</button>
        <div className="custom-table w-full ">
        <table className="table-auto w-full border-collapse mt-2">
            <thead>
              <tr className="bg-cyan-600 text-white ">
                <th>ID_WORK</th>
                <th>WORK</th>
                <th>Amount</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
            {datacon.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.Full_name}</td>
                <td>{item.address}</td>
                <td><button className='btn-ble w-20 h-7 bg-red-500 rounded-md hover:opacity-50  'onClick={()=>deldata(item.id)}> DEL</button></td>
              </tr>
            ))} 
            </tbody>
          </table>
      </div>
      </div>
    </div>
  );
}

export default Contractos;
