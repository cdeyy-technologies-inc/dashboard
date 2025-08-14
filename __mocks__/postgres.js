const postgres = jest.fn(() => {
  // Mock the sql function that gets called with template strings
  const sql = jest.fn().mockImplementation(() => {
    return Promise.resolve([{ amount: 666, name: 'Test Customer' }]);
  });
  return sql;
});

module.exports = postgres;
