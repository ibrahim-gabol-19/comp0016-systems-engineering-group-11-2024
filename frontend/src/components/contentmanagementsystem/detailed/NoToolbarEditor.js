import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component
const NoToolbarEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, placeholderText, fontSize}, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    /*const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });*/

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
      quill.root.style.fontSize = fontSize; // Set default font size for normal text (equivalent to p)
      quill.root.style.lineHeight = "1.5"; // Set line height for readability

      // Set minimum and maximum height for the editor container
      quill.root.style.minHeight = "30px"; // Minimum height for the editor
      
      quill.root.style.overflowY = "auto"; // Enable vertical scrolling when content exceeds max height
      quill.root.style.overflowX = "auto";
      // Quill Toolbar Styles
      const toolbar = container.querySelector(".ql-toolbar");
      if (toolbar) {
        toolbar.style.fontFamily = "system-ui";
      }

      ref.current = quill;
      quillRef.current = quill;
      quill.root.style.direction = "ltr";
      // Set the default value if provided
      if (defaultValue) {
        quill.root.innerHTML = defaultValue;
      }
      quill.on("text-change", () => {
        const content = quill.root.innerText.trim();
        onTextChange?.(content);
      });


      // Cleanup on unmount
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref,placeholderText]);

    return <div className="h-12 resize-none" ref={containerRef}></div>;
  }
);

NoToolbarEditor.displayName = "NoToolbarEditor";

export default NoToolbarEditor;
