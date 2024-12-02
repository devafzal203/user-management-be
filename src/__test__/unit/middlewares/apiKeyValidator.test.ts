import { Request, Response, NextFunction } from "express";
import { apiKeyValidator } from "../../../middlewares/apiKeyValidator";

describe("API Key Validator Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no API key is provided", async () => {
    await apiKeyValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "forbidden" });
  });

  it("should return 400 if invalid API key is provided", async () => {
    mockRequest.headers = { "x-api-key": "invalid-key" };

    await apiKeyValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid API Key",
    });
  });

  it("should call next() if valid API key is provided", async () => {
    mockRequest.headers = { "x-api-key": process.env.X_API_KEY };

    await apiKeyValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });
});
