import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwtUtils";

describe("JWT Utils", () => {
  const userId = "test-user-id";

  describe("Access Token", () => {
    it("should generate and verify access token", () => {
      const token = generateAccessToken(userId);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(userId);
    });

    it("should throw on invalid access token", () => {
      expect(() => {
        verifyAccessToken("invalid-token");
      }).toThrow();
    });
  });

  describe("Refresh Token", () => {
    it("should generate and verify refresh token", () => {
      const token = generateRefreshToken(userId);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(userId);
    });
  });
});
