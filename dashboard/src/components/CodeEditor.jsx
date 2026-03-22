import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function CodeEditor({ value, onChange, language = 'cpp' }) {
  const { dark } = useTheme();
  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={dark ? 'vs-dark' : 'vs'}
      onChange={onChange}
      onMount={handleMount}
      options={{
        fontSize: 13,
        fontFamily: "'Fira Code', 'SF Mono', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        tabSize: 4,
        wordWrap: 'off',
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
        bracketPairColorization: { enabled: true },
        suggest: { showKeywords: true },
        quickSuggestions: true,
      }}
    />
  );
}
