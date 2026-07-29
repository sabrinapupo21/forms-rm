import { useState } from "react";
import {
  Send,
  MessageCircle,
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  formatCPF,
  formatPhone,
  formatCurrency,
  formatDate,
} from "./utils/formatters";
import logoLocal from "./assets/logos/logo-rm-consultoria.svg";
import "./App.css";

// 1) Seu número do WhatsApp (com DDD e Código do País 55, sem + ou traços)
const WHATSAPP_NUMBER = "5518997252281";
const COMPANY_LOGO = logoLocal;

// 2) Definição dos campos
const fields = [
  {
    id: "name",
    label: "Nome",
    type: "text",
    icon: User,
    required: true,
    placeholder: "Seu nome completo",
  },
  {
    id: "cpf",
    label: "CPF",
    type: "text",
    inputMode: "numeric",
    maxLength: 14,
    placeholder: "000.000.000-00",
    icon: CreditCard,
    required: true,
  },
  {
    id: "phone",
    label: "Whatsapp para resposta (com DDD)",
    type: "tel",
    inputMode: "numeric",
    maxLength: 15,
    icon: Phone,
    required: true,
    placeholder: "(18) 99999-9999",
  },
  {
    id: "email",
    label: "E-mail",
    type: "email",
    icon: Mail,
    required: true,
    placeholder: "voce@email.com",
  },
  {
    id: "modalidade",
    label: "Qual tipo de financiamento você deseja?",
    type: "select",
    icon: MessageCircle,
    required: true,
    options: [
      "Aquisição de Imóvel Usado",
      "Aquisição de Imóvel Novo",
      "Construção em Terreno Próprio",
      "Aquisição de Terreno e Construção",
      "Reforma",
      "Ampliação",
      "Outro",
    ],
  },
  {
    id: "modalidadeOutro",
    label: "Digite a modalidade",
    type: "text",
    icon: MessageCircle,
    required: false,
    placeholder: "Ex: Financiamento de energia solar",
  },
  {
    id: "cidade",
    label: "Em qual Cidade está Localizado o Imóvel?",
    type: "text",
    icon: MapPin,
    required: true,
    placeholder: "Digite a Cidade",
  },
  {
    id: "renda",
    label: "Qual é a renda bruta familiar?",
    type: "text",
    inputMode: "numeric",
    icon: DollarSign,
    required: true,
    placeholder: "R$ 0,00",
  },
  {
    id: "possuiFgts",
    label:
      "Possui 3 anos de trabalho sob regime do FGTS, somando-se todos os períodos trabalhados?",
    type: "radio",
    required: true,
    options: ["Sim", "Não"],
  },
  {
    id: "nascimento",
    label:
      "Qual é a data de nascimento do participante de maior idade? (Ex: 15/08/1990)",
    type: "text",
    inputMode: "numeric",
    maxLength: 10,
    icon: Calendar,
    required: true,
    placeholder: "DD/MM/AA",
  },
];

// 3) Formatação da mensagem
function buildMessage(values) {
  const lines = [
    "*Novo contato pelo formulário*",
    "",
    ...fields
      .filter((f) => f.id !== "modalidadeOutro")
      .map((f) => {
        if (f.id === "modalidade" && values.modalidade === "Outro") {
          return `*${f.label}:* ${values.modalidadeOutro || "-"}`;
        }

        return `*${f.label}:* ${values[f.id] || "-"}`;
      }),
  ];

  return lines.join("\n");
}

export default function WhatsAppForm() {
  const initialValues = Object.fromEntries(fields.map((f) => [f.id, ""]));
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(id, value) {
    if (id === "cpf") {
      value = formatCPF(value);
    }

    if (id === "phone") {
      value = formatPhone(value);
    }

    // 💡 AQUI ENTRA O FORMATCURRENCY!
    if (id === "renda") {
      value = formatCurrency(value);
    }
    if (id === "nascimento") value = formatDate(value);
    setValues((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  }

  function validate() {
    const nextErrors = {};

    fields.forEach((f) => {
      if (f.id === "modalidadeOutro" && values.modalidade !== "Outro") {
        return;
      }

      if (f.required && !values[f.id].trim()) {
        nextErrors[f.id] = "Campo obrigatório";
      }
    });
    if (values.nascimento) {
      // Se você usa o formato DD/MM/AAAA (10 caracteres, ex: 15/08/1990)
      if (values.nascimento.length < 10) {
        nextErrors.nascimento = "Digite a data completa (ex: 15/08/1990)";
      } else {
        // Opcional: Valida se o mês e o dia são números válidos
        const [day, month, year] = values.nascimento.split("/").map(Number);

        if (
          day < 1 ||
          day > 31 ||
          month < 1 ||
          month > 12 ||
          year < 1920 ||
          year > 2010
        ) {
          nextErrors.nascimento = "Digite uma data válida";
        }
      }
    }
    if (values.modalidade === "Outro" && !values.modalidadeOutro.trim()) {
      nextErrors.modalidadeOutro = "Campo obrigatório";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

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

        <h2 className="whatsapp-form__title">
          Solicite uma simulação pelo nosso Whatsapp
        </h2>
      </div>

      {fields.map((f) => {
        if (f.id === "modalidadeOutro" && values.modalidade !== "Outro") {
          return null;
        }

        const Icon = f.icon;

        return (
          <div key={f.id} className="whatsapp-form__field">
            <label className="whatsapp-form__label">
              {f.label}{" "}
              {f.required && <span className="whatsapp-form__required">*</span>}
            </label>

            <div className="whatsapp-form__input-wrapper">
              {Icon && <Icon className="whatsapp-form__input-icon" size={18} />}

              {f.type === "textarea" ? (
                <textarea
                  value={values[f.id]}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className={`whatsapp-form__textarea ${
                    errors[f.id] ? "whatsapp-form__textarea--error" : ""
                  }`}
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.id]}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  className={`whatsapp-form__select ${
                    errors[f.id] ? "whatsapp-form__select--error" : ""
                  }`}
                >
                  <option value="">Selecione...</option>

                  {f.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : f.type === "radio" ? (
                <div className="whatsapp-form__radio-group">
                  {f.options.map((option) => (
                    <label key={option} className="whatsapp-form__radio-label">
                      <input
                        type="radio"
                        name={f.id}
                        value={option}
                        checked={values[f.id] === option}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        className="whatsapp-form__radio-input"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={f.type}
                  inputMode={f.inputMode}
                  maxLength={f.maxLength}
                  value={values[f.id]}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  className={`whatsapp-form__input ${
                    errors[f.id] ? "whatsapp-form__input--error" : ""
                  }`}
                />
              )}
            </div>

            {errors[f.id] && (
              <p className="whatsapp-form__error">{errors[f.id]}</p>
            )}
          </div>
        );
      })}

      <button type="submit" className="whatsapp-form__button">
        <Send size={18} />
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}
