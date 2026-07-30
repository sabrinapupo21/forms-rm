import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { fields, isFieldActive } from "./config/fields";
import { validateForm } from "./utils/validation";
import { buildMessage } from "./utils/buildMessage";
import FormField from "./components/FormField";
import {
  formatCPF,
  formatPhone,
  formatCurrency,
  formatDate,
} from "./utils/formatters";
import { WHATSAPP_NUMBER, COMPANY_LOGO, COMPANY_TITLE } from "./config/client";
import "./App.css";

const formatters = {
  cpf: formatCPF,
  phone: formatPhone,
  renda: formatCurrency,
  nascimento: formatDate,
  recursosProprios: formatCurrency,
  valorFGTS: formatCurrency,
};

export default function WhatsAppForm() {
  const initialValues = Object.fromEntries(fields.map((f) => [f.id, ""]));
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(id, rawValue) {
    const format = formatters[id];
    const value = format ? format(rawValue) : rawValue;

    setValues((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const text = buildMessage(values);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text,
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="whatsapp-form">
      <div className="whatsapp-form__header">
        {COMPANY_LOGO ? (
          <img
            src={COMPANY_LOGO}
            alt="Logo da Empresa"
            className="whatsapp-form__logo"
          />
        ) : (
          <MessageCircle className="whatsapp-form__header-icon" size={36} />
        )}

        <h2 className="whatsapp-form__title">{COMPANY_TITLE}</h2>
      </div>

      {fields.map((field) =>
        isFieldActive(field, values) ? (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            values={values}
            onChange={handleChange}
          />
        ) : null,
      )}

      <button type="submit" className="whatsapp-form__button">
        <Send size={18} />
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}
