export const sql = jest.fn(() => ({
  then: jest.fn().mockResolvedValue([])
}));
