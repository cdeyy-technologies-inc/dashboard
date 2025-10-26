// Set up fake timers
jest.useFakeTimers();

// Create a mock SQL function that we can control in tests
const mockSql = jest.fn();

// Use doMock instead of mock to prevent hoisting
jest.doMock('postgres', () => {
  return jest.fn(() => mockSql);
});

// Mock the utils module
jest.doMock('@/app/lib/utils', () => ({
  formatCurrency: jest.fn((amount) => `$${(amount / 100).toFixed(2)}`),
  formatDateToLocal: jest.fn((date) => date),
}));

// Mock console methods to prevent noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

// Import after mocking - must use require instead of import with doMock
const {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
  fetchFilteredInvoices,
  fetchInvoicesPages,
  fetchInvoiceById,
  fetchCustomers,
  fetchFilteredCustomers,
} = require('@/app/lib/data');

describe('Data Module Comprehensive Tests', () => {
    afterEach(() => {
      // Restore timers
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    afterAll(()=>{
      jest.useRealTimers();
    });


  describe('fetchRevenue', () => {
    it('should handle empty revenue data', async () => {
      // Mock empty revenue data
      mockSql.mockResolvedValueOnce([]);

      const promise = fetchRevenue();
      // Fast-forward through the artificial delay
      jest.advanceTimersByTime(3000);

      // Wait for the promise to resolve
      const result = await promise;

      expect(result).toEqual([]);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should throw an error with a specific message when database fails', async () => {
      // Mock database error
      mockSql.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(fetchRevenue()).rejects.toThrow('Failed to fetch revenue data.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });

    it('should return revenue data in the correct format', async () => {
      const mockData = [
        { month: '2023-01', revenue: 10000 },
        { month: '2023-02', revenue: 15000 },
      ];

      mockSql.mockResolvedValueOnce(mockData);

      const result = await fetchRevenue();

      expect(result).toEqual(mockData);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('revenue');
      expect(typeof result[0].revenue).toBe('number');
    });
  });

  describe('fetchLatestInvoices', () => {
    it('should format the amount using formatCurrency', async () => {
      const { formatCurrency } = require('@/app/lib/utils');

      const mockData = [
        { id: '1', amount: 10000, name: 'Customer 1', image_url: 'url1', email: 'customer1@example.com' },
        { id: '2', amount: 20000, name: 'Customer 2', image_url: 'url2', email: 'customer2@example.com' },
      ];

      mockSql.mockResolvedValueOnce(mockData);

      const result = await fetchLatestInvoices();

      expect(formatCurrency).toHaveBeenCalledWith(10000);
      expect(formatCurrency).toHaveBeenCalledWith(20000);
      expect(result[0].amount).not.toBe(10000); // Should be formatted
      expect(result.length).toBe(2);
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchLatestInvoices()).rejects.toThrow('Failed to fetch the latest invoices.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });

    it('should handle empty invoice data', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await fetchLatestInvoices();

      expect(result).toEqual([]);
    });
  });

  describe('fetchCardData', () => {
    it('should handle null values in database response', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: null }])  // invoiceCountPromise
        .mockResolvedValueOnce([{ count: null }])  // customerCountPromise
        .mockResolvedValueOnce([{ paid: null, pending: null }]);  // invoiceStatusPromise

      const result = await fetchCardData();

      expect(result.numberOfInvoices).toBe(0);
      expect(result.numberOfCustomers).toBe(0);
      expect(result.totalPaidInvoices).toBeDefined();
      expect(result.totalPendingInvoices).toBeDefined();
    });

    it('should correctly process numeric values', async () => {
      const { formatCurrency } = require('@/app/lib/utils');

      mockSql
        .mockResolvedValueOnce([{ count: '5' }])  // invoiceCountPromise
        .mockResolvedValueOnce([{ count: '10' }])  // customerCountPromise
        .mockResolvedValueOnce([{ paid: '10000', pending: '5000' }]);  // invoiceStatusPromise

      const result = await fetchCardData();

      expect(result.numberOfInvoices).toBe(5);
      expect(result.numberOfCustomers).toBe(10);
      expect(formatCurrency).toHaveBeenCalledWith('10000');
      expect(formatCurrency).toHaveBeenCalledWith('5000');
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchCardData()).rejects.toThrow('Failed to fetch card data.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('fetchFilteredInvoices', () => {
    it('should calculate offset correctly based on page number', async () => {
      mockSql.mockResolvedValueOnce([]);

      await fetchFilteredInvoices('test', 1);
      expect(mockSql).toHaveBeenCalled();

      mockSql.mockClear();
      mockSql.mockResolvedValueOnce([]);

      await fetchFilteredInvoices('test', 2);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle empty search results', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await fetchFilteredInvoices('nonexistent', 1);

      expect(result).toEqual([]);
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchFilteredInvoices('test', 1)).rejects.toThrow('Failed to fetch invoices.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('fetchInvoicesPages', () => {
    it('should calculate total pages correctly', async () => {
      // Test with 12 items (should be 2 pages with ITEMS_PER_PAGE = 6)
      mockSql.mockResolvedValueOnce([{ count: '12' }]);

      const result = await fetchInvoicesPages('test');

      expect(result).toBe(2);
    });

    it('should handle zero results', async () => {
      mockSql.mockResolvedValueOnce([{ count: '0' }]);

      const result = await fetchInvoicesPages('nonexistent');

      expect(result).toBe(0);
    });

    it('should round up when calculating pages', async () => {
      // Test with 7 items (should be 2 pages with ITEMS_PER_PAGE = 6)
      mockSql.mockResolvedValueOnce([{ count: '7' }]);

      const result = await fetchInvoicesPages('test');

      expect(result).toBe(2);
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchInvoicesPages('test')).rejects.toThrow('Failed to fetch total number of invoices.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('fetchInvoiceById', () => {
    it('should convert amount from cents to dollars', async () => {
      const mockInvoice = [{ id: '1', customer_id: 'cus_1', amount: 10000, status: 'paid' }];
      mockSql.mockResolvedValueOnce(mockInvoice);

      const result = await fetchInvoiceById('1');

      expect(result.amount).toBe(100); // 10000 cents = 100 dollars
    });

    it('should return undefined if no invoice found', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await fetchInvoiceById('nonexistent');

      expect(result).toBeUndefined();
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchInvoiceById('1')).rejects.toThrow('Failed to fetch invoice.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('fetchCustomers', () => {
    it('should return customers in alphabetical order', async () => {
      const mockCustomers = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];
      mockSql.mockResolvedValueOnce(mockCustomers);

      const result = await fetchCustomers();

      expect(result).toEqual(mockCustomers);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle empty customer list', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await fetchCustomers();

      expect(result).toEqual([]);
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchCustomers()).rejects.toThrow('Failed to fetch all customers.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('fetchFilteredCustomers', () => {
    it('should format total_pending and total_paid using formatCurrency', async () => {
      const { formatCurrency } = require('@/app/lib/utils');

      const mockCustomers = [
        {
          id: '1',
          name: 'Alice',
          email: 'alice@example.com',
          image_url: 'url1',
          total_invoices: '2',
          total_pending: 5000,
          total_paid: 10000
        }
      ];
      mockSql.mockResolvedValueOnce(mockCustomers);

      const result = await fetchFilteredCustomers('Alice');

      expect(formatCurrency).toHaveBeenCalledWith(5000);
      expect(formatCurrency).toHaveBeenCalledWith(10000);
      expect(result[0].total_pending).not.toBe(5000); // Should be formatted
      expect(result[0].total_paid).not.toBe(10000); // Should be formatted
    });

    it('should handle empty search results', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await fetchFilteredCustomers('nonexistent');

      expect(result).toEqual([]);
    });

    it('should throw an error with a specific message when database fails', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(fetchFilteredCustomers('test')).rejects.toThrow('Failed to fetch customer table.');
      expect(console.error).toHaveBeenCalledWith('Database Error:', expect.any(Error));
    });
  });

  describe('Integration between functions', () => {
    it('should handle the complete invoice workflow', async () => {
      // Mock for fetchFilteredInvoices
      const mockInvoices = [{ id: '1', amount: 10000, status: 'pending' }];

      // Mock for fetchInvoicesPages
      const mockCount = [{ count: '1' }];

      // Mock for fetchInvoiceById
      const mockInvoice = [{ id: '1', customer_id: 'cus_1', amount: 10000, status: 'pending' }];

      mockSql
        .mockResolvedValueOnce(mockInvoices)  // fetchFilteredInvoices
        .mockResolvedValueOnce(mockCount)     // fetchInvoicesPages
        .mockResolvedValueOnce(mockInvoice);  // fetchInvoiceById

      // Test the workflow: search, get pages, get details
      const invoices = await fetchFilteredInvoices('test', 1);
      const pages = await fetchInvoicesPages('test');
      const invoice = await fetchInvoiceById('1');

      expect(invoices).toEqual(mockInvoices);
      expect(pages).toBe(1);
      expect(invoice.amount).toBe(100); // 10000 cents = 100 dollars
    });

    it('should handle the complete customer workflow', async () => {
      // Mock for fetchCustomers
      const mockAllCustomers = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];

      // Mock for fetchFilteredCustomers
      const mockFilteredCustomers = [
        {
          id: '1',
          name: 'Alice',
          email: 'alice@example.com',
          image_url: 'url1',
          total_invoices: '2',
          total_pending: 5000,
          total_paid: 10000
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockAllCustomers)      // fetchCustomers
        .mockResolvedValueOnce(mockFilteredCustomers); // fetchFilteredCustomers

      // Test the workflow: get all, then filter
      const customers = await fetchCustomers();
      const filtered = await fetchFilteredCustomers('Alice');

      expect(customers).toEqual(mockAllCustomers);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Alice');
    });
  });

});