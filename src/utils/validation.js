import { fields, isFieldActive } from "../config/fields";

function isValidBirthDate(value) {
  return !value || /^\d{2}\/\d{2}\/\d{4}$/.test(value);
}

export function validateForm(values) {
  const errors = {};

  fields.forEach((field) => {
    if (!isFieldActive(field, values)) return;

    if (field.required && !values[field.id]?.trim()) {
      errors[field.id] = "Campo obrigatório";
    }
  });

  if (values.nascimento && !isValidBirthDate(values.nascimento)) {
    errors.nascimento = "Digite a data no formato DD/MM/AAAA";
  }

  return errors;
}
