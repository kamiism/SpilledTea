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
                font-size: 15px; 
                color: #e8e8e8; 
                background-color: #111827;
                line-height: 1.8;
                max-width: 72ch;
                margin: 0 auto;
                padding: 1rem;
              }
              a { color: #ff6600; text-decoration: underline; }
              blockquote { 
                border-left: 4px solid #ff6600; 
                padding-left: 1em; 
                color: #ff6600; 
                font-style: italic; 
                background: rgba(255, 102, 0, 0.05); 
                padding-top: 0.5em; 
                padding-bottom: 0.5em; 
              }
              h1, h2, h3, h4, h5, h6 {
                font-family: 'Share Tech Mono', monospace;
                color: #ff6600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
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
