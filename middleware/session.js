const crypto = require('crypto');

const sessions = new Map();
const SESSION_NAME = 'sid';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }

  return header.split(';').reduce((cookies, part) => {
    const [key, ...valueParts] = part.trim().split('=');
    if (key) {
      cookies[key] = decodeURIComponent(valueParts.join('='));
    }
    return cookies;
  }, {});
}

function setSessionCookie(res, sessionId) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_NAME}=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE / 1000}; SameSite=Lax`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

function sessionMiddleware(req, res, next) {
  const cookies = parseCookies(req);
  let sessionId = cookies[SESSION_NAME];
  let session = sessionId ? sessions.get(sessionId) : null;

  if (!session) {
    sessionId = crypto.randomUUID();
    session = {};
    sessions.set(sessionId, session);
    setSessionCookie(res, sessionId);
  }

  req.session = session;
  req.sessionId = sessionId;

  req.destroySession = () => {
    sessions.delete(sessionId);
    clearSessionCookie(res);
    req.session = {};
  };

  next();
}

module.exports = sessionMiddleware;
