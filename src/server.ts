import cors from "cors";
import express from "express";
import serverless from "serverless-http";
const app = express();

// Import Routers
import DayRouter from "./routes/days";
import AdminRouter from "./routes/admin";
import TimesheetRouter from "./routes/timesheets";

// Setup middleware
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Define the routes
app.use("/days", DayRouter);
app.use("/timesheets", TimesheetRouter);
app.use("/admin", AdminRouter);

// Default return 404
app.use((req: any, res: any) => {
  console.log(req);
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
