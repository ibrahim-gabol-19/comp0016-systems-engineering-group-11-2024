import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component
const MainEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, placeholderText }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

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

      // Quill Editor Styles
      quill.root.style.fontFamily = "system-ui";
      quill.root.style.fontSize = "16px"; // Set default font size for normal text (equivalent to p)
      quill.root.style.lineHeight = "1.5"; // Set line height for readability

      // Set minimum and maximum height for the editor container
      quill.root.style.minHeight = "900px"; // Minimum height for the editor
      quill.root.style.maxHeight = "900px"; // Maximum height for the editor
      quill.root.style.overflowY = "auto"; // Enable vertical scrolling when content exceeds max height

      // Quill Toolbar Styles
      const toolbar = container.querySelector(".ql-toolbar");
      if (toolbar) {
        toolbar.style.fontFamily = "system-ui";
      }

      ref.current = quill;

      // Set the default value if provided
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      // Event listeners for text and selection changes
      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      // Cleanup on unmount
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref, placeholderText]);

    return <div className="pt-8" ref={containerRef}></div>;
  }
);

MainEditor.displayName = "MainEditor";

export default MainEditor;
