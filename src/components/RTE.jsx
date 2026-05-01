import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY || "";

export default function RTE({name, control, label, defaultValue = ""}) {
  return (
    <div className='w-full'>
        {label && <label className='inline-block mb-2 pl-0.5 brutalist-label'>
        {label}</label>}

    <Controller 
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
         <Editor
        apiKey={TINYMCE_API_KEY}
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            skin: 'oxide',
            content_css: 'default',
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
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: `
              body { 
                font-family: Inter, Helvetica, Arial, sans-serif; 
                font-size: 15px; 
                color: #171D1C; 
                background-color: #ffffff;
                line-height: 1.75;
                max-width: 72ch;
                margin: 0 auto;
                padding: 1rem;
              }
              a { color: #5863F8; }
              blockquote { border-left: 3px solid #16BAC5; padding-left: 1em; color: rgba(23,29,28,0.7); }
            `
        }}
        onEditorChange={onChange}
        />
    )}
    />

    </div>
  )
}
