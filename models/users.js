const crypto = require('crypto');

const users = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function findByEmail(email) {
  return users.get(email.toLowerCase());
}

function createUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();

  if (users.has(normalizedEmail)) {
    return { error: 'อีเมลนี้ถูกใช้งานแล้ว' };
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return { user: { id: user.id, name: user.name, email: user.email } };
}

function verifyUser(email, password) {
  const user = findByEmail(email);

  if (!user || user.password !== hashPassword(password)) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email };
}

module.exports = {
  createUser,
  verifyUser,
  findByEmail,
};
