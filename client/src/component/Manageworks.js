import axios from 'axios';
import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
function Manageworks() {
    const [data, setData] = useState([]);
  const [datashow, setDatashow] = useState([]);
  const [openpage, setOpenpage] = useState(false);
  const [Workcon, setWorkaCon] = useState([]);
  const contentRef = useRef(null);

  function loaddata() {
    axios
      .post("http://localhost:3001/Assignworks")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการทำงาน");
      });
  }

  useEffect(() => {
    loaddata();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  function showwork(idwork, idcon, date, cacost, year) {
    const data = {
      work: idwork,
      contractor: idcon,
    };
    setDatashow({
      date,
      cacost,
      year,
    });
    axios
      .post("http://localhost:3001/showwork", data)
      .then((response) => {
        setWorkaCon(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err, "เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
    setOpenpage(true);
    console.log("showdatasohw", datashow);
  }

  const generatePDF = () => {
    const thaiFontUrl =
      "https://fonts.googleapis.com/css2?family=Kanit:wght@300&display=swap";
    axios.get(thaiFontUrl).then((response) => {
      const cssStyles = response.data;
      console.log(cssStyles);
      const pdf = new jsPDF();
      pdf.setFont("Kanit", "normal");
      pdf.setFontSize(12);
      
      const xCoordinate = 7; // ปรับตำแหน่งตามความต้องการ
      const yCoordinate = -3; // ปรับตำแหน่งตามความต้องการ
      const width = 40; // ปรับขนาดตามความต้องการ
      const height = 35; // ปรับขนาดตามความต้องการ
      const imageURL = 'https://scontent.fbkk4-2.fna.fbcdn.net/v/t39.30808-6/309561401_478738054269660_3590383554904477353_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeFjV0xKwYNWFZx2E_pfJlzGj8ygSbLDViuPzKBJssNWK2ATUoa4ZztkcmLPzT9FvVgqhbrhz5TC9rdhSr1GPCm5&_nc_ohc=Mo-sLYZ3QU0AX-ndvby&_nc_zt=23&_nc_ht=scontent.fbkk4-2.fna&oh=00_AfANo3k7SbMJgfA_vgvDdazH0Pvuo9fMGlyrjKp0veuNgw&oe=656C7D24'; // ใส่ URL ของรูปภาพที่นี่
    pdf.addImage(imageURL, "JPEG", xCoordinate, yCoordinate, width, height);
      

      pdf.text(50, 10, "Metro Systems Corporation Public Company Limited");
      pdf.text(
        50,
        15,
        " 400 Chalermprakiat Rama IX Road , Nong Bon, Prawet, Bangkok 10250",
        pdf.setFontSize(10)
      );
      pdf.text(50, 20, " (662) 089 - 4000", pdf.setFontSize(8));
      pdf.text(50, 25, " CRC@metrosystems.co.th", pdf.setFontSize(8));
      pdf.text(
        10,
        30,
        "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------",
        pdf.setFontSize(8)
      );
      pdf.text(
        10,
        50,
        "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------",
        pdf.setFontSize(8)
      );
      pdf.text(
        19,
        35,
        ` Work Title: ${Workcon[1]?.ittle} Contractor: ${Workcon[0]?.ittle}`,
        pdf.setFontSize(10)
      );
      pdf.text(
        20,
        40,
        `Ca-cost: ${datashow.cacost} AssignDate: ${new Date(
          datashow.date
        ).toLocaleDateString()}`,
        pdf.setFontSize(10)
      );
      pdf.text(20, 45, `Year: ${datashow.year}`);
      const dataURL = pdf.output("datauristring");
      const newTab = window.open();
      newTab.document.write(
        '<iframe width="100%" height="100%" src="' + dataURL + '"></iframe>'
      );
    });
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
    <div className="body w-full m-10 h-full text-center">
      <p className="mt-10 text-2xl">ManageWorks</p>
      <div className="custom-table w-full max-h-screen overflow-y-auto">
        <div className="table-container">
          <table className="table-auto w-full border-collapse mt-2   ">
            <thead>
              <tr className="bg-cyan-600 text-white">
                <th>Work-ID:</th>
                <th>Contractor-ID</th>
                <th>AssignedDate</th>
                <th>Ca-Cost</th>
                <th>Date-Work</th>
                <th>Manage</th>


              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.work_id}</td>
                  <td>{item.contractor_id}</td>
                  <td>{new Date(item.assigned_date).toLocaleDateString()}</td>
                  <td>{item.ca_cost}</td>
                  <td>{item.year}</td>
                  <td>
                    <button className='w-20 h-7 bg-green-500 hover:opacity-50 rounded-md '
                      onClick={() =>
                        showwork(
                          item.work_id,
                          item.contractor_id,
                          item.assigned_date,
                          item.ca_cost,
                          item.year
                        )
                      }
                    >
                      About
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
    </div>
    {openpage && (
        <div className=" fixed left-0 right-0 top-0 bottom-0 w-full h-full bg-slate-800 bg-opacity-50 flex items-center justify-center">
          <div className="w-6/12 h-fit bg-white bg-op rounded-md">
            <div className="headger text-center">AssignWork</div>
            <div className="body">
              <div className="r flex items-center justify-center">
                <p className="mr-2">Work: </p>
                <p style={{ color: "red" }}>{Workcon[1]?.ittle}</p>
              </div>
              <div className="r flex items-center justify-center mt-2">
                <p className="mr-2">Contractor: </p>
                <p style={{ color: "red" }}>{Workcon[0]?.ittle}</p>
              </div>
              <div className="r flex items-center justify-center mt-2">
               
                <p style={{ marginLeft: "-22px" }}>Ca-cost:</p>
                <p style={{ color: "red" }}>{datashow.cacost}</p>
                <p style={{ marginLeft: "20px" }}> AssignDate:</p>
                <p style={{ color: "red" }}>
                  {new Date(datashow.date).toLocaleDateString()}
                </p>
              </div>
              <div className="r flex items-center justify-center mt-2">
                <p className="mr-2">Year: </p>
                <p style={{ color: "red" }}>{datashow.year}</p>
              </div>    
            </div>
            <div className="foot p-2 flex items-center justify-end">
              <button
                className="w-20 h-6 bg-green-400 hover:opacity-50 mr-2 rounded-md   "
                onClick={generatePDF}
              >
               PDF
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
  </div>
  )
}

export default Manageworks