import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TitleEditor = forwardRef(
  (
    { readOnly, defaultValue, onTextChange, onSelectionChange,placeholderText, fontSize },
    ref
  ) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);


    useLayoutEffect(() => {
      const container = containerRef.current;
      const editorContainer = document.createElement("div");
      container.appendChild(editorContainer);

      const Font = Quill.import("formats/font");
      Quill.register(Font, true);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholderText,
        modules: {
          toolbar: false,
        },
      });

      quill.root.style.fontFamily = "system-ui";
      quill.root.style.fontSize = fontSize;
      quill.root.style.lineHeight = "1.5";
      quill.root.style.textAlign = "center";
      quill.root.style.fontWeight = "bold";
      quill.root.style.minHeight = "30px";
      quill.root.style.overflowY = "auto";
      
      quill.root.style.direction = "ltr";

      if (defaultValue) {
        quill.root.innerHTML = defaultValue;
      }

      ref.current = quill;
      quillRef.current = quill;

      quill.on("text-change", () => {
        const content = quill.root.innerText.trim();
        onTextChange?.(content);
      });

      return () => {
        ref.current = null;
        quillRef.current = null;
        container.innerHTML = "";
      };
    }, [placeholderText, fontSize]);

    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    /*useEffect(() => {
      if (defaultValue && quillRef.current) {
        quillRef.current.root.innerHTML = defaultValue;
      }
    }, [defaultValue]);*/

    return <div ref={containerRef}></div>;
  }
);

TitleEditor.displayName = "TitleEditor";

export default TitleEditor;
