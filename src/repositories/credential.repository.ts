import { db } from "@config/db.config";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { EducationalCredentials } from "../models/credential.model";

export const CredentialRepository = {
  async findByPerson(personId: number): Promise<EducationalCredentials[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Educational_Credentials WHERE Person_ID = ?",
      [personId]
    );
    return rows as EducationalCredentials[];
  },

  async create(personId: number, data: Omit<EducationalCredentials, "ID" | "Person_Id">) {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Educational_Credentials
       (Person_ID, Type, Organization, Acquired_credential, Year)
       VALUES (?, ?, ?, ?, ?)`,
      [personId, data.Type, data.Organization, data.Acquired_credential, data.Year]
    );
    return result.insertId;
  }
};
