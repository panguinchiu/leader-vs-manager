import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'quiz-admin-secret-key-2024';

export function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAdminToken(request) {
  try {
    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      return jwt.verify(token, JWT_SECRET);
    }

    // Check cookie
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(';').map((c) => {
          const [k, ...v] = c.trim().split('=');
          return [k.trim(), v.join('=')];
        })
      );
      if (cookies.admin_token) {
        return jwt.verify(cookies.admin_token, JWT_SECRET);
      }
    }

    return null;
  } catch {
    return null;
  }
}
