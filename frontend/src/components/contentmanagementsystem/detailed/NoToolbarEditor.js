import React, { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component
const NoToolbarEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, placeholderText, fontSize }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);

    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const fontSizeRef = useRef(fontSize);

    // Update refs whenever props change
    useEffect(() => {
      defaultValueRef.current = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
      onTextChangeRef.current = onTextChange;
    }, [onTextChange]);

    useEffect(() => {
      fontSizeRef.current = fontSize;
    }, [fontSize]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      // Register Styles
      const Font = Quill.import("formats/font");
      Quill.register(Font, true);

      // Initialize Quill
      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholderText,
        modules: {
          toolbar: false,
        },
      });

      // Quill Editor Styles
      quill.root.style.fontFamily = "system-ui";
      quill.root.style.fontSize = fontSizeRef.current; // Use the latest font size from the ref
      quill.root.style.lineHeight = "1.5"; // Set line height for readability
      quill.root.style.minHeight = "30px"; // Minimum height for the editor
      quill.root.style.overflowY = "auto"; // Enable vertical scrolling
      quill.root.style.overflowX = "auto";

      ref.current = quill;
      quillRef.current = quill;
      quill.root.style.direction = "ltr";

      // Set the default value if provided
      if (defaultValueRef.current) {
        quill.root.innerHTML = defaultValueRef.current;
      }

      // Handle text changes
      quill.on("text-change", () => {
        const content = quill.root.innerText.trim();
        onTextChangeRef.current?.(content); // Use the latest onTextChange from the ref
      });

      // Cleanup on unmount
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref, placeholderText]);

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [readOnly, ref]);

    return <div className="h-12 resize-none" ref={containerRef}></div>;
  }
);

NoToolbarEditor.displayName = "NoToolbarEditor";

export default NoToolbarEditor;
