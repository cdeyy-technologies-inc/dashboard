// const postgres = jest.fn(() => {
//   const mockClient = {
//     sql: jest.fn().mockImplementation((callback) => {
//       return callback([{ amount: 666, name: 'Test Customer' }]);
//     })
//   };
//   return mockClient;
// });

// module.exports = postgres;

const postgres = jest.fn(() => {
    sql = jest.fn().mockImplementation(() => {
      return [{ amount: 666, name: 'Test Customer' }];
    });
    return sql;
});

module.exports = postgres;
