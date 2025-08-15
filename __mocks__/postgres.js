const postgres = jest.fn(() => {
  // Mock the sql function that gets called with template strings
  const sql = jest.fn();
  return sql;
});

module.exports = postgres;
