import { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.realm_access || !user.realm_access.roles) {
      return res.status(403).json({ error: "No roles found in token" });
    }

    if (!user.realm_access.roles.includes(role)) {
      return res.status(403).json({ error: "Insufficient role" });
    }

    next();
  };
}
