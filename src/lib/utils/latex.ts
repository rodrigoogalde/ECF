export function preprocessLatex(content: string): string {
  let processed = content;

  // Convertir \[ ... \] a $$ ... $$ (display math)
  processed = processed.replace(/\\\[/g, "\n$$");
  processed = processed.replace(/\\\]/g, "$$\n");

  // Convertir \( ... \) a $ ... $ (inline math)
  processed = processed.replace(/\\\(/g, "$");
  processed = processed.replace(/\\\)/g, "$");

  // Convertir \textbf{...} a **...** (negrita en Markdown)
  // Usar regex que soporte contenido con $ dentro
  processed = processed.replace(/\\textbf\{([^}]*(?:\$[^$]*\$[^}]*)*)\}/g, "**$1**");

  // Convertir \textit{...} a *...* (cursiva en Markdown)
  processed = processed.replace(/\\textit\{([^}]*(?:\$[^$]*\$[^}]*)*)\}/g, "*$1*");

  // Convertir entornos itemize/enumerate a listas Markdown
  processed = processed.replace(/\\begin\{itemize\}/g, "");
  processed = processed.replace(/\\end\{itemize\}/g, "");
  processed = processed.replace(/\\begin\{enumerate\}/g, "");
  processed = processed.replace(/\\end\{enumerate\}/g, "");
  processed = processed.replace(/\\item\s*/g, "\n- ");

  // Convertir \\ a saltos de línea (fuera de contexto matemático)
  processed = processed.replace(/\\\\\s*(?!\$)/g, "\n\n");

  return processed;
}