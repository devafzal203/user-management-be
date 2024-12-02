import { Request, Response, NextFunction } from "express";
import { authenticateOrRefresh } from "../../../middlewares/authenticateOrRefresh";
import { generateAccessToken } from "../../../utils/jwtUtils";

jest.mock("../../../database/prisma.client");

describe("Authentication Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      cookies: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should authenticate with valid access token", async () => {
    const userId = "test-user-id";
    const accessToken = generateAccessToken(userId);
    mockRequest.cookies = { accessToken };

    await authenticateOrRefresh(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.user).toEqual({ id: userId });
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 401 when no tokens are present", async () => {
    await authenticateOrRefresh(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "No valid token found",
    });
  });
});
