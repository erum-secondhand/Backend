import 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData> & { userId?: number };
  }
}
