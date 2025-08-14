const postgres = jest.fn(() => {
  const mockClient = {
    then: jest.fn().mockImplementation((callback) => {
      return callback([{ amount: 666, name: 'Test Customer' }]);
    })
  };
  return mockClient;
});

module.exports = postgres;
