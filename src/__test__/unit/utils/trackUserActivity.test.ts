import { trackUserActivity } from "../../../utils/trackUserActivity";
import { prisma } from "../../../database/prisma.client";
import { ActivityType } from "../../../types";

// Mock the prisma client
jest.mock("../../../database/prisma.client", () => ({
  prisma: {
    activity: {
      create: jest.fn(),
    },
  },
}));

describe("trackUserActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = "test-user-id";
  const mockIpAddress = "127.0.0.1";

  it("should create activity record with basic information", async () => {
    const activityType: ActivityType = "LOGIN";

    await trackUserActivity(mockUserId, activityType, mockIpAddress);

    expect(prisma.activity.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        activityType,
        ipAddress: mockIpAddress,
        details: {},
      },
    });
    expect(prisma.activity.create).toHaveBeenCalledTimes(1);
  });
});
