import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY || "";

export default function RTE({name, control, defaultValue = ""}) {
  return (
    <div className='w-full bg-[var(--color-eva-panel)]'>
    <Controller 
    name={name || "content"}
    control={control}
    render={({field: {onChange, value}}) => (
         <Editor
        apiKey={TINYMCE_API_KEY}
        value={value}
        init={{
            height: 500,
            menubar: false,
            skin: 'oxide-dark',
            content_css: 'dark',
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            content_style: `
              body { 
                font-family: 'IBM Plex Mono', monospace; 
                font-size: 16px; 
                color: #f1f5f9; 
                background-color: #0a0e1a;
                line-height: 1.8;
                max-width: 72ch;
                margin: 0 auto;
                padding: 2rem 1rem;
              }
              a { color: #00d4ff; text-decoration: underline; }
              blockquote { 
                border-left: 4px solid #7b2fff; 
                padding-left: 1.5em; 
                color: #7b2fff; 
                font-style: italic; 
                background: rgba(123, 47, 255, 0.05); 
                padding-top: 1em; 
                padding-bottom: 1em; 
              }
              h1, h2, h3, h4, h5, h6 {
                font-family: 'Share Tech Mono', monospace;
                color: #00d4ff;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-top: 2em;
              }
            `
        }}
        onEditorChange={onChange}
        />
    )}
    />
    </div>
  )
}
