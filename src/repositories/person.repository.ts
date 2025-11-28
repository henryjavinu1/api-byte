// src/repositories/person.repository.ts
import { db } from "@config/db.config";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PaginationParams } from "../models/PaginationParams";
import { Person } from "../models/person.model";
import { EducationalCredentials } from "../models/credential.model";

const SORT_BY_COLUMN_MAP: Record<string, string> = {
  id: "ID",
  name: "Name"
};

const SORT_ORDER_ALLOWED: Set<string> = new Set(["ASC", "DESC"]);

export const PersonRepository = {
    
  async findPaginated({
    page,
    limit,
    name,
    sortBy = "id",
    sortOrder = "ASC"
  }: PaginationParams): Promise<Person[]> {
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM Person WHERE 1=1`;
    const params: (string | number)[] = [];

    if (name) {
      query += " AND Name LIKE ?";
      params.push(`%${name}%`);
    }

    // Mapear sortBy a columna segura
    const column = SORT_BY_COLUMN_MAP[sortBy] ?? SORT_BY_COLUMN_MAP["id"];
    // Validar order
    const order = SORT_ORDER_ALLOWED.has(sortOrder) ? sortOrder : "ASC";

    query += ` ORDER BY ${column} ${order}`;

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows as Person[];
  },

  async count(name?: string): Promise<number> {
    let query = `SELECT COUNT(*) AS total FROM Person WHERE 1=1`;
    const params: any[] = [];

    if (name) {
      query += " AND Name LIKE ?";
      params.push(`%${name}%`);
    }

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows[0].total as number;
  },

  async findById(id: number): Promise<Person | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Person WHERE ID = ?",
      [id]
    );
    return rows.length > 0 ? (rows[0] as Person) : null;
  },

  async findByNIT(nit: string): Promise<Person | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Person WHERE NIT = ?",
      [nit]
    );
    return rows.length > 0 ? (rows[0] as Person) : null;
  },

  async create(data: Omit<Person, "ID">): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Person (NIT, Name, Address, Phone_Number)
       VALUES (?, ?, ?, ?)`,
      [data.NIT, data.Name, data.Address, data.Phone_Number]
    );

    return result.insertId;
  },

  async update(id: number, data: Partial<Person>): Promise<void> {
    await db.query(
      `UPDATE Person
       SET Name = ?, Address = ?, Phone_Number = ?
       WHERE ID = ?`,
      [data.Name, data.Address, data.Phone_Number, id]
    );
  },

  async delete(id: number): Promise<void> {
    await db.query("DELETE FROM Educational_Credentials WHERE Person_ID = ?", [id]);
    await db.query("DELETE FROM Person WHERE ID = ?", [id]);
  }
};
