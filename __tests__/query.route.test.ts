import { GET } from '@/app/query/route';
import postgres from 'postgres';
import { NextResponse } from 'next/server';

// Mock the postgres module
jest.mock('postgres');  // this tells Jest to use __mocks__/postgres.js

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => Promise.resolve(data),
      status: 200
    }))
  }
}));

// Mock console.error to test error handling
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('GET /query', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.POSTGRES_URL = 'mock-url';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return invoice data successfully', async () => {
    const mockSql = jest.fn();
    mockSql.mockReturnValue([{ amount: 666, name: 'Test Customer' }]);
    (postgres as jest.Mock).mockReturnValue(mockSql);

    const response = await GET();
    const data = await response.json();

    expect(postgres).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalled();
    expect(data).toEqual([
      { amount: 666, name: 'Test Customer' }
    ]);
  });

  it('should handle errors and return 500 status', async () => {
    const mockError = new Error('Database connection failed');
    (postgres as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    // Mock an error response
    (NextResponse.json as jest.Mock).mockImplementationOnce((data) => ({
      json: () => Promise.resolve(data),
      status: 500
    }));

    const response = await GET();
    const data = await response.json();

    expect(console.error).toHaveBeenCalledWith('Database error:', mockError);
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Database query failed', status: 500 })
    );
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it('should use SSL when POSTGRES_SSL is not set to false', async () => {
    process.env.POSTGRES_SSL = 'true';
    
    const mockSql = jest.fn();
    mockSql.mockReturnValue([{ amount: 666, name: 'Test Customer' }]);
    (postgres as jest.Mock).mockReturnValue(mockSql);

    await GET();

    expect(postgres).toHaveBeenCalledWith('mock-url', { ssl: 'require' });
  });

  it('should not use SSL when POSTGRES_SSL is set to false', async () => {
    process.env.POSTGRES_SSL = 'false';
    
    const mockSql = jest.fn();
    mockSql.mockReturnValue([{ amount: 666, name: 'Test Customer' }]);
    (postgres as jest.Mock).mockReturnValue(mockSql);

    await GET();

    expect(postgres).toHaveBeenCalledWith('mock-url', { ssl: false });
  });

  it('should handle SQL query errors', async () => {
    const mockSql = jest.fn();
    const sqlError = new Error('SQL query failed');
    mockSql.mockImplementation(() => {
      throw sqlError;
    });
    (postgres as jest.Mock).mockReturnValue(mockSql);
    
    // Mock an error response
    (NextResponse.json as jest.Mock).mockImplementationOnce((data) => ({
      json: () => Promise.resolve(data),
      status: 500
    }));

    const response = await GET();
    const data = await response.json();

    expect(console.error).toHaveBeenCalledWith('Database error:', sqlError);
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Database query failed', status: 500 })
    );
  });
});