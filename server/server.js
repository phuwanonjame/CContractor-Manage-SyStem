const sql = require("mssql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const config = {
  user: "phuwanon",
  password: "0881509604",
  server: "localhost",
  database: "ContractDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

sql
  .connect(config)
  .then((p) => {
    pool = p;
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

app.get("/", (req, res) => {
  if (!pool) {
    res.status(500).json({ error: "ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้" });
    return;
  }

  const request = pool.request();
  request.query("SELECT * FROM tblWork WHERE status = 1", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการ query ข้อมูล" });
    } else {
      res.json(result.recordset);
    }
  });
});

app.post("/add", (req, res) => {
  const data = req.body;
  const Case = req.body.Case;
  if (Case == 1) {
    const sqlQuery =
      "INSERT INTO tblWork (ittle, location, ts_number, ts_amount ,status ) VALUES (@Title, @Location, @Number, @Amount,1)";

    const request = pool.request();
    request.input("Title", sql.NVarChar, data.Title);
    request.input("Location", sql.NVarChar, data.Location);
    request.input("Number", sql.NVarChar, data.Number);
    request.input("Amount", sql.Int, data.Amount);

    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          error: "เกิดข้อผิดพลาดไม่สามารถเพิ่มข้อมูลเข้าสู่ฐานข้อมูลได้",
        });
      } else {
        res.json({ success: true });
      }
    });
  } else if (Case == 2) {
    const contractorSql =
      "INSERT INTO tblContractor (Full_name,address) VALUES (@Fname,@Address)";

    const request = pool.request();
    request.input("Fname", sql.NVarChar, data.Fname);
    request.input("Address", sql.NVarChar, data.Address);

    request.query(contractorSql, (err, result) => {
      if (err) {
        res.status(500).json({ error: "เกิดข้อผิดพลากในการบันทึกข้อมูล" });
      } else {
        res.json({ success: true });
      }
    });
  } else if (Case == 4) {
    const queryInsert =
      "INSERT INTO tblWorkAssigned (work_id, contractor_id, ca_cost, assigned_date, year) VALUES (@workid, @conid, @cacost, @date, @year)";
    const requestInsert = pool.request();
    requestInsert.input("workid", sql.Int, data.Workid);
    requestInsert.input("conid", sql.Int, data.Conid);
    requestInsert.input("cacost", sql.Decimal(18, 0), data.Cacost);
    requestInsert.input("date", sql.DateTime, data.Asdate);
    requestInsert.input("year", sql.NVarChar, data.Year);
  
    requestInsert.query(queryInsert, (errInsert, resultInsert) => {
      if (errInsert) {
        res.status(500).json({ err: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
      } else {

        const queryUpdate =
          "UPDATE tblWork SET status = 2 WHERE id = @workid";
  
        const requestUpdate = pool.request();
        requestUpdate.input("workid",sql.Int,data.Workid)
        requestUpdate.query(queryUpdate, (errUpdate, resultUpdate) => {
          if (errUpdate) {
            res.status(500).json({ err: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" });
          } else {
            res.json(resultUpdate.recordset);
          }
        });
      }
    });
  }
  });  
  

  app.post("/dashboard", (req, res) => {
    const sql =
      "SELECT *, (SELECT COUNT(*) FROM tblWork WHERE status = 1) AS tblWork FROM tblWork WHERE status = 1;";
    const request = pool.request();
    request.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ err: "เกิดปัญหาในการดึงข้อมูลมาแสดง" });
      } else {
        const tblWorkCount = result.recordset[0]?.tblWork || 0;
        res.json(tblWorkCount);
      }
    });
  });
app.post("/dbassign", (req, res) => {
  const sql =
    "SELECT *, (SELECT COUNT(*) FROM tblWorkAssigned ) AS tblWorkAssigned FROM tblWorkAssigned;  ;";
  const request = pool.request();
  request.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ err: "เกิดปัญหาในการดึงข้อมูลมาแสดง" });
    } else {
      res.json(result.recordset[0].tblWorkAssigned);
    }
  });
});
app.post("/assign", (req, res) => {
  const sql = "SELECT id, Full_name, address FROM tblContractor";

  const request = pool.request();
  request.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ err: "เกิดข้อผิดพลาดในการแสดงข้อมูล" });
    } else {
      res.json(result.recordset);
    }
  });
});
app.get("/contractors", (req, res) => {
  const request = pool.request();
  const sql = "SELECT * FROM tblContractor";

  request.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการ query ข้อมูล" });
    } else {
      res.json(result.recordset);
    }
  });
});
app.post("/Assignworks", (req, res) => {
  const sql = "SELECT * FROM tblWorkAssigned";
  const request = pool.request();
  request.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err, "เกิดข้อผิดพลาดในการเรียกข้อมูล");
    } else {
      res.json(result.recordset);
    }
  });
});
app.post("/showwork", (req, res) => {
  const data = req.body;

  const sql =
    "SELECT ittle FROM tblWork WHERE id = @workid UNION SELECT Full_name FROM tblContractor WHERE id = @contractorid;";
  const request = pool.request();
  request.input("workid", data.work);
  request.input("contractorid", data.contractor);
  request.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err, "เกิดข้อผิดพลาด");
    } else {
      res.json(result.recordset);
    }
  });
});
app.post("/delete", (req, res) => {
  const contractorId = req.body.id;  
  const sqlDeleteWorkAssigned = "DELETE FROM dbo.tblWorkAssigned WHERE contractor_id  = @ContractorId";
  const requestWorkAssigned = pool.request();
  requestWorkAssigned.input("ContractorId", sql.Int, contractorId);
  requestWorkAssigned.query(sqlDeleteWorkAssigned, (errWorkAssigned, resultWorkAssigned) => {
    if (errWorkAssigned) {
      console.log(errWorkAssigned);
      res.status(500).send("Error deleting related records in tblWorkAssigned.");
    } else {
      const sqlDeleteContractor = "DELETE FROM dbo.tblContractor WHERE id = @ContractorId";
      const requestContractor = pool.request();
      requestContractor.input("ContractorId", sql.Int, contractorId);
      requestContractor.query(sqlDeleteContractor, (errContractor, resultContractor) => {
        if (errContractor) {
          console.log(errContractor);
          res.status(500).send("Error deleting record in tblContractor.");
        } else {
          res.json(resultContractor.recordset);
        }
      });
    }
  });
});
app.post("/ginlo", async (req, res) => {
  const { user, pass } = req.body;

  if (!user.trim() || !pass.trim()) {
    return res.status(400).send("Invalid username or password");
  }

  try {
    const pool = await sql.connect(config);

    const sqlQuery =
      "SELECT * FROM tblUsers WHERE UserName = @user AND Password = @pass";
    const request = pool.request();
    request.input("user", sql.NVarChar, user);
    request.input("pass", sql.NVarChar, pass);

    const result = await request.query(sqlQuery);

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
