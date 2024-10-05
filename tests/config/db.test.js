// tests/config/db.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import connectDB, { closeDbConnection } from '../../src/config/db.js';

// Use importOriginal to get the real models and mock only the methods needed
vi.mock('../../src/models/index.models.js', async () => {
  const originalModels = await vi.importActual('../../src/models/index.models.js');
  return {
    ...originalModels,
    User: {
      ...originalModels.User,
      countDocuments: vi.fn(),
      create: vi.fn(),
    },
    Tenant: {
      ...originalModels.Tenant,
      create: vi.fn(),
    },
  };
});

// Use importOriginal to get the real mongoose for utilities
vi.mock('mongoose', async () => {
  const mongoose = await vi.importActual('mongoose');
  return {
    ...mongoose,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
});

// Import models after mocks
import { connect, disconnect } from 'mongoose';
import { User, Tenant } from '../../src/models/index.models.js';

describe('connectDB', () => {
  beforeEach(async () => {
    // Ensure the database is disconnected before starting each test
    await disconnect();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  afterEach(async () => {
    await closeDbConnection(); // Ensure clean disconnection after each test
  });

  it('should connect to the database and create default documents if no users exist', async () => {
    User.countDocuments.mockResolvedValue(0);
    User.create.mockResolvedValue({ firstName: 'Admin' });
    Tenant.create.mockResolvedValue({ name: 'demo' });

    const result = await connectDB();

    expect(connect).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(Tenant.create).toHaveBeenCalled();
    expect(result).toBe(0);
  });

  it('should fail if there is a connection error', async () => {
    connect.mockRejectedValue(new Error('Connection failed'));
    await expect(connectDB()).rejects.toThrow('Connection failed');
  });
});
