import React, { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component
const MainEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, placeholderText }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onTextChangeRef = useRef(onTextChange); // Ref to track the latest onTextChange
    const defaultValueRef = useRef(defaultValue); // Ref to track the latest defaultValue

    // Update refs whenever props change
    useEffect(() => {
      onTextChangeRef.current = onTextChange;
    }, [onTextChange]);

    useEffect(() => {
      defaultValueRef.current = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      // Register Styles
      const Font = Quill.import("formats/font");
      Quill.register(Font, true);

      // Toolbar options
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
      ];

      // Initialize Quill
      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholderText,
        modules: {
          toolbar: toolbarOptions,
        },
      });

      // Set Quill styles
      quill.root.style.fontFamily = "system-ui";
      quill.root.style.fontSize = "16px";
      quill.root.style.lineHeight = "1.5";
      quill.root.style.minHeight = "100%";
      quill.root.style.maxHeight = "100%";
      quill.root.style.overflowY = "auto";

      // Set the default value if provided
      if (defaultValueRef.current) {
        quill.root.innerHTML = defaultValueRef.current;
      }

      ref.current = quill;
      quillRef.current = quill;

      quill.on("text-change", () => {
        const content = quill.root.innerText.trim();
        onTextChangeRef.current?.(content); // Use the latest onTextChange function
      });

      // Cleanup on unmount
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref, placeholderText]);

    // Handle readOnly changes
    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [readOnly, ref]);

    return <div className="pb-10 pt-8 h-5/6" ref={containerRef}></div>;
  }
);

MainEditor.displayName = "MainEditor";

export default MainEditor;
