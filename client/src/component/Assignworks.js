import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Assignworks() {
  const [openpage, setOpenpage] = useState(false);
  const [openassign, setOpenassign] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // input
  const [addTitle, setAddTtile] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addtsnumber, setAddtsnumber] = useState("");
  const [addtsamount, setAddtsamount] = useState("");
  const [selectcontrac, setContractoras] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  //assignwork
  const [addDatework, setDatework] = useState("");
  const [addCacost, setCacost] = useState("");
  const [addYear, setYear] = useState("");
  //ค้นหา
  const [searchInput, setSearchInput] = useState("");

  function dataassign() {
    axios("http://localhost:3001/")
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
    axios
      .post("http://localhost:3001/assign")
      .then((response) => {
        setContractoras(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
  }

  useEffect(() => {
    dataassign();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);
  function adddatawork(value) {
    if (value === 1) {
      if (
        addTitle === "" ||
        addLocation === "" ||
        addtsamount === "" ||
        addtsnumber === ""
      ) {
        Swal.fire("กรุณากรอกข้อมูลให้ครบ");
      } else {
        const data1 = {
          Title: addTitle,
          Location: addLocation,
          Number: addtsnumber,
          Amount: addtsamount,
          Case: 1,
        };
        axios
          .post("http://localhost:3001/add", data1)
          .then((response) => {
            console.log(response, "ส่งข้อมูลสำเร็จ");
            setAddTtile("");
            setAddLocation("");
            setAddtsamount("");
            setAddtsnumber("");
            setOpenpage(false);
            dataassign();
          })
          .catch((err) => {
            console.log(err, "เกิดข้อผิดพลาดในการส่งข้อมูล");
          });
      }
    } else if (value === 2) {
      const data = {
        Workid: selectedItems[0],
        Conid: selectedContractor.id,
        Cacost: addCacost,
        Asdate: addDatework,
        Year: addYear,
        Case: 4,
      };
      console.log(data);

      if (
        selectedItems[0] === "" ||
        selectedContractor.id === "" ||
        addCacost === "" ||
        addDatework === "" ||
        addYear === ""
      ) {
        Swal.fire("กรุณากรอกข้อมูลให้ครบ");
      } else {
        axios
          .post("http://localhost:3001/add", data)
          .then((response) => {
            console.log(response, "ส่งข้อมูลสำเร็จ");
            setCacost("");
            setDatework("");
            setYear("");
            setOpenassign(false)
            dataassign()
          })
          .catch((err) => {
            console.log(err, "เกิดข้อผิดพลาดในการส่งข้อมูล");
          });
      }
    }
  }
  const handleCheckboxChange = (itemId, itemittle, itemamount) => {
    if (selectedItems.includes(itemId)) {
      const updatedItems = selectedItems.filter((id) => id !== itemId);
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([itemId, itemittle, itemamount]);
    }
  };
  const handleContractorChange = (event) => {
    const selectedContractorId = event.target.value;
    console.log("selectedContractorId:", selectedContractorId);
    console.log("selectcontrac:", selectcontrac);

    const contractorIndex = selectcontrac.findIndex(
      (e) => e.id.toString() === selectedContractorId
    );
    console.log("ค่า index ", contractorIndex);
    if (contractorIndex !== -1) {
      const selectedContractor = selectcontrac[contractorIndex];
      setSelectedContractor(selectedContractor);
      console.log("selected contractor:", selectedContractor);
      console.log("index of address:", contractorIndex);
    } else {
      console.log("Contractor not found");
    }
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="body w-full m-10 h-full text-center">
        <p className="mt-10 text-2xl">AssignWorks</p>
        <div className="custom-table w-full ">
          <div className="w-full bg-yellow-400 flex items-center justify-between">
            <div className=" ml-2 flex">
              <p
                className=" p-2 bg-amber-600 m-2 cursor-pointer hover:opacity-50 rounded-md"
                onClick={() => setOpenpage(true)}
              >
                addworks
              </p>
              <p className=" p-2 bg-amber-600 m-2 cursor-pointer hover:opacity-50 rounded-md" onClick={()=>setOpenassign(true)}>
                AddAssignwork
              </p>
            </div>
            <div className=" flex mr-2">
              <p className="mr-2">Search:</p>
              <input
                className="searchinput"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className=" bg-cyan-600">
                <th>ID_WORK</th>
                <th>WORK</th>
                <th>location</th>
                <th>Amount</th>
              
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) => {
                  const searchLower = searchInput.toLowerCase();
                  return (
                    item.id.toString().includes(searchLower) ||
                    item.ittle.toLowerCase().includes(searchLower) ||
                    item.location.toLowerCase().includes(searchLower) ||
                    item.ts_amount.toString().includes(searchLower)
                  );
                })
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.ittle}</td>
                    <td>{item.location}</td>
                    <td>{item.ts_amount}</td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(
                            item.id,
                            item.ittle,
                            item.ts_amount
                          )
                        }
                        checked={selectedItems.includes(item.id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {openpage && (
        <div className=" fixed left-0 right-0 top-0 bottom-0 w-full h-full bg-slate-800 bg-opacity-50 flex items-center justify-center ">
          <div className="w-6/12 h-fit bg-white rounded-md bg-op">
            <div className="headger text-center">Add Work</div>
            <div className="body">
              <div className="r flex items-center justify-center bg-op1">
                <p className="mr-2">WorkTital: </p>
                <input
                  value={addTitle}
                  className=" bg-slate-200 w-96 h-8 in-op"
                  onChange={(e) => setAddTtile(e.target.value)}
                ></input>
              </div>
              <div className="r flex items-center justify-center mt-2 bg-op1">
                <p className="mr-2">Location: </p>
                <input
                  value={addLocation} 
                  className=" bg-slate-200 w-96 h-8 in-op"
                  onChange={(e) => setAddLocation(e.target.value)}
                ></input>
              </div>
              <div className="r flex items-center justify-center mt-2 bg-op1 ">
                <p className="mr-2">TS-Number: </p>
                <input
                  value={addtsnumber}
                  onChange={(e) => setAddtsnumber(e.target.value)}
                  className=" bg-slate-200 w-60 mr-2 h-8 in-op"
                ></input>
                <p className="mr-2">Amount: </p>
                <input
                  value={addtsamount}
                  onChange={(e) => setAddtsamount(e.target.value)}
                  className=" bg-slate-200 w-60 h-8 in-op"
                ></input>
              </div>
            </div>
            <div className="foot p-2 flex items-center justify-end bt-op">
              <button
                className="w-20 h-6 bg-green-400 hover:opacity-50 mr-2 rounded-md   "
                onClick={() => adddatawork(1)}
              >
                Save
              </button>
              <button
                className="w-20 h-6 bg-red-400 hover:opacity-50 rounded-md"
                onClick={() => setOpenpage(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {openassign && (
        <div className=" fixed left-0 right-0 top-0 bottom-0 w-full h-full bg-slate-800 bg-opacity-50 flex items-center justify-center">
          <div className="w-6/12 h-fit bg-white bg-op rounded-md">
            <div className="headger text-center">Add Work</div>
            <div className="body">
              <div className="r flex items-center justify-center">
                <p className="mr-2">WorkTital: </p>
                <p style={{ color: "red" }}>{selectedItems[1]}</p>
              </div>
              <div className="r flex items-center justify-center mt-2">
                <p className="mr-2">Amount: </p>
                <p style={{ color: "red" }}>{selectedItems[2]}</p>
              </div>
              <div className="r flex items-center justify-center mt-2 ">
              <p className="mr-2">Select Contractor:</p>
                <select
                  className="select-work bg-slate-200"
                  onChange={handleContractorChange}
                >
                  <option value="">Contractor</option>
                  {selectcontrac.map((contractor) => (
                    <option key={contractor.id} value={contractor.id}>
                      {contractor.Full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="r flex items-center justify-center mt-2">
              <p>Address:</p>
                <p className="name " style={{ color: "red" }}>
                  {selectedContractor && selectedContractor.address}
                </p>
              </div>
              <div className="r flex items-center justify-center mt-2">
              <p>Ca-cost:</p>
              <input
                  type="number"
                  value={addCacost}
                  className="input-work2 bg-slate-200"
                  onChange={(e) => setCacost(e.target.value)}
                ></input>
                <p style={{ marginLeft: "20px" }}> AssignDate:</p>
                <input
                  type="date"
                  value={addDatework}
                  className="input-work2 bg-slate-200"
                  onChange={(e) => setDatework(e.target.value)}
                ></input>
              </div>
              <div className="r flex items-center justify-center mt-2">
              <p>Year:</p>
                <select
                  className="select-work bg-slate-200"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value=""></option>
                  <option value="2022-2023">2022-2023</option>
                </select>
              </div>
            </div>
            <div className="foot p-2 flex items-center justify-end bt-op">
              <button
                className="w-20 h-6 bg-green-400 hover:opacity-50 mr-2 rounded-md   "
                onClick={() => adddatawork(2)}
              >
                Save
              </button>
              <button
                className="w-20 h-6 bg-red-400 hover:opacity-50 rounded-md"
                onClick={() => {
                    setOpenassign(false);
                    setSelectedContractor("");
                  }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignworks;
