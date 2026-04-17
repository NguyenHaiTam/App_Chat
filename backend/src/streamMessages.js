import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import axios from "axios"; 

// connect MongoDB
console.log("MONGO URI =", process.env.MONGODB_CONNECTIONSTRING);
await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
console.log("Connected MongoDB");

// change stream
const changeStream = mongoose.connection.collection("messages").watch();

// folder
const DIR = "/app/data";
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

// file
const FILE_PATH = "/app/data/messages_stream.json";

// Databricks config
const DATABRICKS_URL =
  "https://dbc-af3b0cfd-02cb.cloud.databricks.com/api/2.1/jobs/run-now";

const TOKEN = "dapie78dd242662008d7a2c67bb8c8910151";    
const JOB_ID = 392716720304302;     

changeStream.on("change", async (change) => {
  if (change.operationType === "insert") {
    const msg = change.fullDocument;

    console.log("FULL MESSAGE:", msg);

    // lưu file
    fs.appendFileSync(FILE_PATH, JSON.stringify(msg) + "\n");

    // xử lý text
    const cleanText = msg.content
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^\x00-\x7F]/g, ""); // remove emoji

    try {
      await axios.post(
        DATABRICKS_URL,
        {
          job_id: JOB_ID,
          notebook_params: {
            message: cleanText || "empty"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      console.log("Sent to Databricks:", cleanText);
    } catch (err) {
      console.error(
        "Error sending to Databricks:",
        err.response?.data || err.message
      );
    }

    console.log("New message streamed:", msg.content);
  }
});