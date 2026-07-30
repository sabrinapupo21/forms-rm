import { isFieldActive } from "../config/fields";

export default function FormField({ field, value, error, values, onChange }) {
  if (!isFieldActive(field, values)) return null;

  const Icon = field.icon;
  const errorClass = (base) => `${base} ${error ? `${base}--error` : ""}`;

  return (
    <div className="whatsapp-form__field">
      <label className="whatsapp-form__label">
        {field.label}{" "}
        {field.required && <span className="whatsapp-form__required">*</span>}
      </label>

      <div className="whatsapp-form__input-wrapper">
        {Icon && <Icon className="whatsapp-form__input-icon" size={18} />}
        {renderControl(field, value, errorClass, onChange)}
      </div>

      {error && <p className="whatsapp-form__error">{error}</p>}
    </div>
  );
}

function renderControl(field, value, errorClass, onChange) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={errorClass("whatsapp-form__textarea")}
        />
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={errorClass("whatsapp-form__select")}
        >
          <option value="">Selecione...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="whatsapp-form__radio-group">
          {field.options.map((option) => (
            <label key={option} className="whatsapp-form__radio-label">
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="whatsapp-form__radio-input"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    default:
      return (
        <input
          type={field.type}
          inputMode={field.inputMode}
          maxLength={field.maxLength}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className={errorClass("whatsapp-form__input")}
        />
      );
  }
}
