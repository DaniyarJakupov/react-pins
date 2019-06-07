const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  //verify auth token
  const googleUser = await verifyAuthToken(token);
  //check if user exists
  const user = await checkIfUserExists(googleUser.email);
  //return user or create a new one in db
  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (e) {
    console.error(`Error verifying auth token`, e);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
