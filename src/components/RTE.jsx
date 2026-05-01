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
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: `
              body { 
                font-family: Inter, Helvetica, Arial, sans-serif; 
                font-size: 15px; 
                color: #f2f0eb; 
                background-color: #141210;
                line-height: 1.75;
                max-width: 72ch;
                margin: 0 auto;
                padding: 1rem;
              }
              a { color: #a9927d; }
              blockquote { border-left: 3px solid #49111c; padding-left: 1em; color: rgba(242,240,235,0.7); }
            `
        }}
        onEditorChange={onChange}
        />
    )}
    />

    </div>
  )
}
