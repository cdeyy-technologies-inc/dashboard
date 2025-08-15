import { GET } from '@/app/query/route';
import postgres from 'postgres';
import { NextResponse } from 'next/server';

// Mock the postgres module
// jest.mock('postgres', () => jest.fn(() => {
//   return jest.fn().mockResolvedValue([{ amount: 666, name: 'Test Customer' }]);
// }));

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


describe('GET /query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    // Mock the postgres module
    const mockSql = "error condition"; //jest.fn();
    //mockSql.mockReturnValue({ error: 'Internal Server Error' });
    (postgres as jest.Mock).mockReturnValue(mockSql);
    // Mock an error response
    (NextResponse.json as jest.Mock).mockImplementationOnce((data, options) => ({
      json: () => Promise.resolve(data),
      status: 500
    }));

    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.anything() , "status": 500})
    );
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });
});
