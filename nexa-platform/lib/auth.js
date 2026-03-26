const { SignJWT, jwtVerify } = require('jose');
const { cookies } = require('next/headers');

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nexa-platform-secret-key-2026-change-in-production');

async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexa_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

module.exports = { signToken, verifyToken, getSession, JWT_SECRET };
