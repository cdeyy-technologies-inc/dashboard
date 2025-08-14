import { GET } from '@/app/query/route';
import postgres from 'postgres';
import { NextResponse } from 'next/server';

// Mock the postgres module
jest.mock('postgres', () => jest.fn(() => {
  return jest.fn().mockResolvedValue([{ amount: 666, name: 'Test Customer' }]);
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => Promise.resolve(data),
      status: 200
    }))
  }
}));

describe('GET /query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invoice data successfully', async () => {
    const response = await GET();
    const data = await response.json();

    expect(postgres).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalled();
    expect(data).toEqual([
      { amount: 666, name: 'Test Customer' }
    ]);
  });

  it('should handle errors and return 500 status', async () => {
    // Mock an error response
    (NextResponse.json as jest.Mock).mockImplementationOnce((data, options) => ({
      json: () => Promise.resolve(data),
      status: 500
    }));

    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.anything() }),
      { status: 500 }
    );
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });
});
