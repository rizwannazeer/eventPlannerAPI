const db = require( "../db");

const findUserByEmail = async (email) => {
  const users = await db.readDB('user', { email });
  if (users?.length === 1){
    return users[0];
  }
  return null;
}

const authenticateUser = async (email, password) => {
  const users = await db.readDB('user', { email, password });
  if (users?.length === 1){
    return users[0];
  }
  return null;
}

const createUser = async (user) => {
  const existingEmail = await db.readDB('user', { email: user.email });
  if (existingEmail && existingEmail?.length > 0) {
    return { error: 'email already exists' };
  }
  const addedUser = await db.writeDB('user', user);
  return {message: 'user created successfully'};
}


const me = async (email) => {
  const users = await db.readDB('user', { email });
  if (users?.length === 1){
    return users[0];
  }
  return null;
}

module.exports = {
  findUserByEmail,
  createUser,
  authenticateUser,
  me,
}
