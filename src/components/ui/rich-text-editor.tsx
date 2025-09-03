"use client";

import React from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  showHtml?: boolean; // Para mostrar HTML em modo somente leitura
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite o conteúdo...",
  readOnly = false,
  className = "",
  showHtml = false,
}) => {
  // Se for somente leitura e mostrar HTML, renderizar o HTML diretamente
  if (readOnly && showHtml && value.includes("<")) {
    return (
      <div className={`rich-text-editor ${className}`}>
        <div
          className="min-h-[200px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={8}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none min-h-[200px]"
      />
    </div>
  );
};
