export type PreferredContactMethod = "Telefon" | "E-post";

export type LeadContactInput = {
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: PreferredContactMethod;
  consentGiven: boolean;
};

export type LeadContactValidation = {
  valid: boolean;
  errors: Partial<Record<keyof LeadContactInput | "consent", string>>;
};

export function validateLeadContact(input: LeadContactInput): LeadContactValidation {
  const errors: LeadContactValidation["errors"] = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();

  if (name.length < 2) {
    errors.name = "Ange ditt namn (minst 2 tecken).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ange en giltig e-postadress.";
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 6) {
    errors.phone = "Ange ett giltigt telefonnummer.";
  }

  if (!input.consentGiven) {
    errors.consent = "Du behöver godkänna kontakt för att spara.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function normalizeLeadContact(input: LeadContactInput): LeadContactInput & {
  consentTimestamp: string;
} {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    preferredContactMethod: input.preferredContactMethod,
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
  };
}
