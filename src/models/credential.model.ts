export interface EducationalCredentials {
  ID: number;
  Person_Id: number;
  Type: string;
  Organization: string;
  Acquired_credential: string;
  Year: number;       
}

export type CredentialInput = Omit<EducationalCredentials, "ID" | "Person_Id">;