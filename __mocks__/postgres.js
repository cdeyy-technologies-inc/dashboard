const postgres = jest.fn(() => ({
  then: jest.fn().mockResolvedValue([])
}));

module.exports = postgres;
