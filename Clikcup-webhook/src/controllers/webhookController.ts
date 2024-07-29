import { Request, Response } from "express";
import axios from "axios";

const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;

export const handleWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  try {
    let taskDetails;

    switch (event.event) {
      case "taskCreated":
      case "taskUpdated":
        taskDetails = await getTaskDetails(event.task_id);
        console.log(
          `Task ${event.event === "taskCreated" ? "created" : "updated"}:`,
          taskDetails
        );
        break;
      default:
        return res.status(400).send({ error: "Invalid event type" });
    }

    res.status(200).send({ message: "Webhook received", task: taskDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getTaskDetails = async (taskId: string) => {
  const response = await axios.get(`${CLICKUP_API_BASE_URL}/task/${taskId}`, {
    headers: {
      Authorization: CLICKUP_API_TOKEN,
    },
  });
  return response.data;
};
