import { fields } from "../config/fields";
export function buildMessage(values) {
  const lines = [
    "*Dados para Simulação*",
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
