import { Request, Response, NextFunction } from "express";
import * as jose from "jose";

const publicIssuer = `http://localhost:8180/realms/${process.env.KEYCLOAK_REALM}`;

const internalIssuer = `http://keycloak:8080/realms/${process.env.KEYCLOAK_REALM}`;

const jwks = jose.createRemoteJWKSet(
  new URL(`${internalIssuer}/protocol/openid-connect/certs`)
);

export async function verifyToken(req: Request, res: Response, next: NextFunction) {

  try {
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = auth.split(" ")[1];
    const { payload } = await jose.jwtVerify(token, jwks, {
      issuer: publicIssuer, 
      audience: "account"
    });

    (req as any).user = payload;

    next();
  } catch (err: any) {
    console.log(">>> ERROR IN VERIFY TOKEN <<<");
    console.error(err);
    return res.status(401).json({
      error: "Invalid or expired token",
      details: err.message,
    });
  }
}
