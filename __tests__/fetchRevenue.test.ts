
describe('fetchRevenue function', () => {
  let mockSql: jest.Mock;
  let fetchRevenue: typeof import('@/app/lib/data').fetchRevenue;
  
  beforeEach(() => {
    // Clear all mocks and reset modules before each test
    jest.resetModules();
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock console to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the postgres module
    mockSql = jest.fn();
    jest.mock('postgres', () => {
      return jest.fn(() => mockSql);
    });
    
    // Import the function after mocking dependencies
    fetchRevenue = require('@/app/lib/data').fetchRevenue as typeof import('@/app/lib/data').fetchRevenue;
  });
  
  afterEach(() => {
    // Restore timers
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

   it('should handle empty data', async () => {
    // Arrange: Set up the mock to return empty array
    mockSql.mockResolvedValueOnce([]);
    
    // Act: Call the function
    const promise = fetchRevenue();
    
    // Fast-forward through the artificial delay
    jest.advanceTimersByTime(3000);
    
    // Wait for the promise to resolve
    const result = await promise;
    
    // Assert: Verify the function returns an empty array
    expect(result).toEqual([]);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });
  
  it('should return data from the database', async () => {
    // Arrange: Set up the mock to return sample data
    const mockData = [
      { month: '2023-01', revenue: 1000 },
      { month: '2023-02', revenue: 2000 }
    ];
    mockSql.mockResolvedValueOnce(mockData);
    
    // Act: Call the function
    const promise = fetchRevenue();
    
    // Fast-forward through the artificial delay
    jest.advanceTimersByTime(3000);
    
    // Wait for the promise to resolve
    const result = await promise;
    
    // Assert: Verify the function returns the expected data
    expect(result).toEqual(mockData);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });
  
 
  it('should throw an error when the database query fails', async () => {
    // Arrange: Set up the mock to throw an error
    mockSql.mockRejectedValueOnce(new Error('Database error'));
    
    // Act & Assert: Verify the function throws the expected error
    const promise = fetchRevenue();
    
    // Fast-forward through the artificial delay
    jest.advanceTimersByTime(3000);
    
    // Wait for the promise to reject
    await expect(promise).rejects.toThrow('Failed to fetch revenue data.');
    expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
  });
});