import { PersonService } from '../src/services/person.service';

// Mock repositorios y validaciones
const mockFindPaginated = jest.fn();
const mockCount = jest.fn();
const mockFindById = jest.fn();
const mockFindByNIT = jest.fn();
const mockCreatePerson = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockFindByPersonCred = jest.fn();
const mockCreateCred = jest.fn();

jest.mock('../src/repositories/person.repository', () => ({
  PersonRepository: {
    findPaginated: (...args: any[]) => mockFindPaginated(...args),
    count: (...args: any[]) => mockCount(...args),
    findById: (...args: any[]) => mockFindById(...args),
    findByNIT: (...args: any[]) => mockFindByNIT(...args),
    create: (...args: any[]) => mockCreatePerson(...args),
    update: (...args: any[]) => mockUpdate(...args),
    delete: (...args: any[]) => mockDelete(...args),
  }
}));

jest.mock('../src/repositories/credential.repository', () => ({
  CredentialRepository: {
    findByPerson: (...args: any[]) => mockFindByPersonCred(...args),
    create: (...args: any[]) => mockCreateCred(...args),
  }
}));

jest.mock('../src/middlewares/validations', () => ({
  isValidName: jest.fn().mockReturnValue(true),
  validateNIT: jest.fn().mockReturnValue({ valid: true }),
  validateCredential: jest.fn(),
}));

describe('PersonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPaginated devuelve resultados paginados', async () => {
    mockFindPaginated.mockResolvedValue([{ ID: 1, NIT: '1234', Name: 'Juan' }]);
    mockCount.mockResolvedValue(1);

    const res = await PersonService.getPaginated({ page: 1, limit: 5 });

    expect(mockFindPaginated).toHaveBeenCalled();
    expect(mockCount).toHaveBeenCalled();
    expect(res).toHaveProperty('data');
    expect(res.total).toBe(1);
  });

  test('getById lanza error si no existe', async () => {
    mockFindById.mockResolvedValue(null);
    await expect(PersonService.getById(999)).rejects.toThrow('Person not found');
  });

  test('getById devuelve persona con detalles', async () => {
    const person = { ID: 2, NIT: '1111', Name: 'Ana' };
    const creds = [{ ID: 1, Person_ID: 2, Type: 'BACHELORS', Organization: 'U', Acquired_credential: 'B', Year: 2000 }];
    mockFindById.mockResolvedValue(person);
    mockFindByPersonCred.mockResolvedValue(creds);

    const res = await PersonService.getById(2);
    expect(res).toMatchObject({ ID: 2, Name: 'Ana' });
    expect(res.details).toEqual(creds);
  });

  test('create valida nit y crea persona y credenciales', async () => {
    const input = {
      NIT: '12345K',
      Name: 'Luis',
      details: [{ Type: 'BACHELORS', Organization: 'U', Acquired_credential: 'B', Year: 2010 }]
    } as any;

    mockFindByNIT.mockResolvedValue(null);
    mockCreatePerson.mockResolvedValue(10);
    mockCreateCred.mockResolvedValue(100);
    const person = { ID: 10, NIT: input.NIT, Name: input.Name };
    mockFindById.mockResolvedValue(person);
    mockFindByPersonCred.mockResolvedValue(input.details);

    const res = await PersonService.create(input);

    expect(mockFindByNIT).toHaveBeenCalledWith(input.NIT);
    expect(mockCreatePerson).toHaveBeenCalled();
    expect(mockCreateCred).toHaveBeenCalled();
    expect(res).toHaveProperty('ID', 10);
    expect(res.details).toEqual(input.details);
  });

  test('create lanza error si NIT inválido', async () => {
    const validations = require('../src/middlewares/validations');
    validations.validateNIT.mockReturnValue({ valid: false, reason: 'bad' });

    const input = { NIT: 'bad', Name: 'X', details: [{ Type: 'BACHELORS', Organization: 'U', Acquired_credential: 'B', Year: 2010 }] } as any;

    await expect(PersonService.create(input)).rejects.toThrow(/Invalid NIT/);
  });

  test('update lanza error si persona no existe', async () => {
    mockFindById.mockResolvedValue(null);
    await expect(PersonService.update(5, { Name: 'New' } as any)).rejects.toThrow('Person not found');
  });

  test('update actualiza y retorna persona', async () => {
    const person = { ID: 6, NIT: '1', Name: 'Old' };
    mockFindById.mockResolvedValue(person);
    mockUpdate.mockResolvedValue(undefined);
    mockFindById.mockResolvedValueOnce(person);
    mockFindByPersonCred.mockResolvedValue([]);

    const res = await PersonService.update(6, { Name: 'New' } as any);
    expect(mockUpdate).toHaveBeenCalledWith(6, { Name: 'New' });
    expect(res).toHaveProperty('ID', 6);
  });

  test('remove lanza error si persona no existe', async () => {
    mockFindById.mockResolvedValue(null);
    await expect(PersonService.remove(7)).rejects.toThrow('Person not found');
  });

  test('remove elimina persona', async () => {
    const person = { ID: 8, NIT: '2', Name: 'ToDelete' };
    mockFindById.mockResolvedValue(person);
    mockDelete.mockResolvedValue(undefined);

    const res = await PersonService.remove(8);
    expect(mockDelete).toHaveBeenCalledWith(8);
    expect(res).toEqual({ deleted: true });
  });
});
