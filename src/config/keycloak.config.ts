import session from "express-session";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

import dotenv from "dotenv";
dotenv.config();

interface KeycloakConfigExtended extends KeycloakConfig {
  "confidential-port": number;
  credentials: {
    secret: string;
  };
}

const memoryStore = new session.MemoryStore();

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "super-secret",
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
});

const keycloakConfig: KeycloakConfigExtended = {
  realm: process.env.KEYCLOAK_REALM || "",
  "auth-server-url": process.env.KEYCLOAK_AUTH_URL || "",
  "ssl-required": process.env.KEYCLOAK_SSL_REQUIRED || "external",
  resource: process.env.KEYCLOAK_CLIENT_ID || "",
  "confidential-port": 0,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET || "",
  },
};

export const keycloak = new Keycloak(
  { store: memoryStore },
  keycloakConfig
);
