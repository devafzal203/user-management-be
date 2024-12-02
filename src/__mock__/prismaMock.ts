import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const mockPrisma = mockDeep<PrismaClient>();

export const createMockContext = (): MockContext => {
  return {
    prisma: mockPrisma,
  };
};
