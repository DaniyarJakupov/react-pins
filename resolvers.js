const user = {
  id: "1",
  name: "John",
  email: "john@gmail.com",
  picture: "pic"
};

module.exports = {
  Query: {
    me: () => user
  }
};
