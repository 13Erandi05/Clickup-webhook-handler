import request from "supertest";
import app from "../src/server";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ClickUp Webhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 OK for valid webhook request", async () => {
    const event = {
      event: "taskCreated",
      task_id: "task_id",
    };

    mockedAxios.get.mockResolvedValue({
      data: { id: "task_id", name: "Sample Task" },
    });

    const response = await request(app)
      .post("/webhook")
      .send(event)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({
      message: "Webhook received",
      task: { id: "task_id", name: "Sample Task" },
    });
  });

  it("should handle taskCreated event and fetch task details", async () => {
    const event = {
      event: "taskCreated",
      task_id: "task_id",
    };

    mockedAxios.get.mockResolvedValue({
      data: { id: "task_id", name: "Sample Task" },
    });

    const response = await request(app)
      .post("/webhook")
      .send(event)
      .expect(200);

    expect(response.body.task).toEqual({ id: "task_id", name: "Sample Task" });
  });

  it("should handle taskUpdated event and fetch task details", async () => {
    const event = {
      event: "taskUpdated",
      task_id: "task_id",
    };

    mockedAxios.get.mockResolvedValue({
      data: { id: "task_id", name: "Updated Task" },
    });

    const response = await request(app)
      .post("/webhook")
      .send(event)
      .expect(200);

    expect(response.body.task).toEqual({ id: "task_id", name: "Updated Task" });
  });

  it("should return 400 Bad Request for invalid event", async () => {
    const event = {
      event: "invalidEvent",
      task_id: "task_id",
    };

    const response = await request(app)
      .post("/webhook")
      .send(event)
      .expect(400);

    expect(response.body).toEqual({ error: "Invalid event type" });
  });

  it("should return 500 Internal Server Error for server errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const event = {
      event: "taskCreated",
      task_id: "task_id",
    };

    mockedAxios.get.mockRejectedValue(new Error("Simulated server error"));

    const response = await request(app)
      .post("/webhook")
      .send(event)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
