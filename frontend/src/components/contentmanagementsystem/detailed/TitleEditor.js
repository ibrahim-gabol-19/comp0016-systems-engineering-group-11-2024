import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TitleEditor = forwardRef(
  (
    { readOnly, defaultValue, onTextChange, onSelectionChange, placeholderText, fontSize },
    ref
  ) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    
    // Create refs for defaultValue, onTextChange, and placeholderText to avoid re-initializing the effect
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const fontSizeRef = useRef(fontSize);
    const placeholderTextRef = useRef(placeholderText);
    
    useLayoutEffect(() => {
      defaultValueRef.current = defaultValue;
      onTextChangeRef.current = onTextChange;
      fontSizeRef.current = fontSize;
      placeholderTextRef.current = placeholderText;
    }, [defaultValue, onTextChange, fontSize, placeholderText]);

    useLayoutEffect(() => {
      const container = containerRef.current;
      const editorContainer = document.createElement("div");
      container.appendChild(editorContainer);

      const Font = Quill.import("formats/font");
      Quill.register(Font, true);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholderTextRef.current,
        modules: {
          toolbar: false,
        },
      });

      quill.root.style.fontFamily = "system-ui";
      quill.root.style.fontSize = fontSizeRef.current;
      quill.root.style.lineHeight = "1.5";
      quill.root.style.textAlign = "center";
      quill.root.style.fontWeight = "bold";
      quill.root.style.minHeight = "30px";
      quill.root.style.overflowY = "auto";
      quill.root.style.direction = "ltr";

      if (defaultValueRef.current) {
        quill.root.innerHTML = defaultValueRef.current;
      }

      // Ensure ref is included as a dependency to avoid the warning
      ref.current = quill;
      quillRef.current = quill;

      quill.on("text-change", () => {
        const content = quill.root.innerText.trim();
        onTextChangeRef.current?.(content);
      });

      return () => {
        ref.current = null;
        quillRef.current = null;
        container.innerHTML = "";
      };
    }, [placeholderText, fontSize, ref]); // Add 'ref' to the dependency array

    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    return <div ref={containerRef}></div>;
  }
);

TitleEditor.displayName = "TitleEditor";

export default TitleEditor;
