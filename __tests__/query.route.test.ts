import { GET } from '@/app/query/route';
import sql from 'postgres';
import { NextResponse } from 'next/server';

// Mock the postgres module
jest.mock('postgres', () => ({
  sql: jest.fn().mockImplementation(() => ({
    // Mock the SQL query method
    then: jest.fn().mockResolvedValue([
      { amount: 666, name: 'Test Customer' }
    ])
  }))
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
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

    expect(sql).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalled();
    expect(data).toEqual([
      { amount: 666, name: 'Test Customer' }
    ]);
  });

  it('should handle errors and return 500 status', async () => {
    // Mock a rejected promise to simulate an error
    (sql as jest.Mock).mockImplementationOnce(() => ({
      then: jest.fn().mockRejectedValue(new Error('Database error'))
    }));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });
});
