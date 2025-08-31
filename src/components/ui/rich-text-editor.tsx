"use client";

import { ContentState, EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
  const [editorState, setEditorState] = useState(() => {
    const emptyState = EditorState.createEmpty();
    return emptyState;
  });

  // Função para forçar direção LTR
  const forceLTR = (state: EditorState) => {
    const content = state.getCurrentContent();
    if (content.getPlainText() === "") {
      return state;
    }
    return state;
  };

  useEffect(() => {
    if (value) {
      try {
        // Se o valor contém HTML, tentar converter
        if (value.includes("<") && value.includes(">")) {
          // Para HTML, criar estado vazio por enquanto
          // Em uma implementação mais avançada, você poderia usar htmlToDraft
          setEditorState(EditorState.createEmpty());
        } else {
          // Para texto simples, converter para EditorState
          const contentState = ContentState.createFromText(value);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        // Se falhar, criar estado vazio
        setEditorState(EditorState.createEmpty());
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  // Forçar direção LTR sempre que o componente for montado
  useEffect(() => {
    const forceLTRStyles = () => {
      const editorElements = document.querySelectorAll(
        ".rich-text-editor .public-DraftEditor-content"
      );
      editorElements.forEach((element) => {
        (element as HTMLElement).style.direction = "ltr";
        (element as HTMLElement).style.textAlign = "left";
        (element as HTMLElement).style.unicodeBidi = "embed";
      });
    };

    // Aplicar imediatamente
    forceLTRStyles();

    // Aplicar após um pequeno delay para garantir que o DOM esteja pronto
    const timer = setTimeout(forceLTRStyles, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleEditorStateChange = (newEditorState: EditorState) => {
    // Forçar direção LTR no estado
    const contentState = newEditorState.getCurrentContent();
    const textContent = contentState.getPlainText();

    setEditorState(newEditorState);
    onChange(textContent);
  };

  const toolbarOptions = {
    options: [
      "inline",
      "blockType",
      "list",
      "textAlign",
      "link",
      "emoji",
      "history",
    ],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["bold", "italic", "underline", "strikethrough"],
    },
    blockType: {
      inDropdown: true,
      options: [
        "Normal",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "Blockquote",
        "Code",
      ],
    },
    list: {
      inDropdown: false,
      options: ["unordered", "ordered"],
    },
    textAlign: {
      inDropdown: false,
      options: ["left", "center", "right", "justify"],
    },
    link: {
      inDropdown: false,
      options: ["link", "unlink"],
    },
    history: {
      inDropdown: false,
      options: ["undo", "redo"],
    },
  };

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
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={toolbarOptions}
        placeholder={placeholder}
        readOnly={readOnly}
        editorClassName="min-h-[200px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
        toolbarClassName="bg-gray-50 px-3 py-2 border-b border-gray-300"
        wrapperClassName="border border-gray-300 rounded-lg overflow-hidden"
        textAlignment="left"
        editorStyle={{
          direction: "ltr",
          textAlign: "left",
          unicodeBidi: "embed",
        }}
        onFocus={() => {
          // Forçar direção LTR ao focar
          const editorElement = document.querySelector(
            ".rich-text-editor .public-DraftEditor-content"
          );
          if (editorElement) {
            (editorElement as HTMLElement).style.direction = "ltr";
            (editorElement as HTMLElement).style.textAlign = "left";
            (editorElement as HTMLElement).style.unicodeBidi = "embed";
          }
        }}
      />
    </div>
  );
};
