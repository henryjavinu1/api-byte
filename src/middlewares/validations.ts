export function validateNIT(nit: string): { valid: boolean; reason?: string } {
  const clean = nit.replace(/[\s.-]/g, "");

  if (clean.length < 2) {
    return {
      valid: false,
      reason: "El NIT debe tener al menos cuerpo y dígito verificador.",
    };
  }

  const cuerpo = clean.slice(0, -1);
  const dvIngresado = clean.slice(-1).toUpperCase();

  if (!/^\d+$/.test(cuerpo)) {
    return {
      valid: false,
      reason: "El cuerpo del NIT solo puede contener números.",
    };
  }

  const digits = cuerpo.split("").map(Number);
  let peso = 2;
  let suma = 0;

  for (let i = digits.length - 1; i >= 0; i--) {
    suma += digits[i] * peso;
    peso++;
  }

  const residuo = suma % 11;
  let dvCalcNum = (11 - residuo) % 11;

  const dvCalculado = dvCalcNum === 10 ? "K" : dvCalcNum.toString();

  if (dvCalculado !== dvIngresado) {
    return {
      valid: false,
      reason: `Dígito verificador incorrecto. Se esperaba ${dvCalculado}.`,
    };
  }

  return { valid: true };
}

export function isValidName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(name);
}

export const VALID_CREDENTIAL_TYPES = [
  "Llave",
  "Valor",
  "GED",
  "Diversificado",
  "BACHELORS",
  "Licenciatura",
  "MASTERS",
  "Maestría",
  "PHD",
  "Doctorado",
  "CERTIFICATION",
  "Certificación",
];

export function validateCredential(c: any) {
  if (!VALID_CREDENTIAL_TYPES.includes(c.Type)) {
    throw new Error(`Invalid Credential Type: ${c.Type}`);
  }
  if (!c.Organization || !c.Acquired_credential) {
    throw new Error("Organization and Acquired_credential are required.");
  }
  const year = Number(c.Year);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 1900 || year > currentYear) {
    throw new Error("Invalid Year.");
  }
}
