import { PersonRepository } from "../repositories/person.repository";
import { CredentialRepository } from "../repositories/credential.repository";
import {
  isValidName,
  validateNIT,
  validateCredential,
} from "../middlewares/validations";
import { Person } from "../models/person.model";
import {
  EducationalCredentials,
  CredentialInput,
} from "../models/credential.model";
import { PaginationParams } from "../models/PaginationParams";
import { PaginatedResult } from "../models/PaginatedResult";

// Tipo de input para crear o actualizar una persona con sus credenciales
export interface PersonInput {
  NIT: string;
  Name: string;
  Address?: string;
  Phone_Number?: string;
  details: CredentialInput[];
}

export const PersonService = {
  async getPaginated(
    params: PaginationParams
  ): Promise<PaginatedResult<Person>> {
    const { page, limit, name, sortBy = "id", sortOrder = "ASC" } = params;

    const data = await PersonRepository.findPaginated({
      page,
      limit,
      name,
      sortBy,
      sortOrder,
    });
    const total = await PersonRepository.count(name);

    return { data, total, page, limit };
  },

  async getById(
    id: number
  ): Promise<Person & { details: EducationalCredentials[] }> {
    const person = await PersonRepository.findById(id);
    if (!person) throw new Error("Person not found");

    const details = await CredentialRepository.findByPerson(id);
    return { ...person, details };
  },

  async create(
    data: PersonInput
  ): Promise<Person & { details: EducationalCredentials[] }> {
      const nitCheck = validateNIT(data.NIT);
        if (!nitCheck.valid) {
            throw new Error(`Invalid NIT (Modulo 11): ${nitCheck.reason}`);
        }
    if (!isValidName(data.Name))
      throw new Error("Name contains invalid characters");

    const exists = await PersonRepository.findByNIT(data.NIT);
    if (exists) throw new Error("NIT already registered");

    if (!data.details || data.details.length === 0)
      throw new Error("At least one credential detail is required");

    data.details.forEach(validateCredential);

    const personData: Omit<Person, "ID"> = {
      NIT: data.NIT,
      Name: data.Name,
      Address: data.Address,
      Phone_Number: data.Phone_Number,
    };

    const newId = await PersonRepository.create(personData);

    for (const c of data.details) {
      await CredentialRepository.create(newId, c);
    }

    return this.getById(newId);
  },

  async update(
    id: number,
    data: Partial<Omit<PersonInput, "details">>
  ): Promise<Person & { details: EducationalCredentials[] }> {
    const person = await PersonRepository.findById(id);
    if (!person) throw new Error("Person not found");

    // No se puede modificar NIT ni ID
    delete data.NIT;
    delete (data as any).ID;

    if (data.Name && !isValidName(data.Name)) throw new Error("Invalid name");

    await PersonRepository.update(id, data);

    return this.getById(id);
  },

  async remove(id: number): Promise<{ deleted: true }> {
    const person = await PersonRepository.findById(id);
    if (!person) throw new Error("Person not found");

    await PersonRepository.delete(id);
    return { deleted: true };
  },
};
