import dotenv from "dotenv";

dotenv.config({ path: ".env" });

process.env.X_API_KEY = "test-api-key";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret";

beforeAll(() => {
  // To setup any global test configuration
});

afterAll(() => {
  // To cleanup after all tests
});
