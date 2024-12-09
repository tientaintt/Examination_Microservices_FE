import { useTranslation } from "react-i18next";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useEffect, useState } from "react";

export default function QuestionContentInput({ onChange, defaultContent }) {
  
  const { t } = useTranslation();
  const [editorData, setEditorData] = useState(defaultContent ? defaultContent : '');
  console.log(editorData);
  console.log(defaultContent);
  return (
    <div>
      <label htmlFor="contentQuestion" className="block pb-1 text-sm font-medium text-gray-700">{t('Question content')}</label>
      <CKEditor
        editor={ClassicEditor}
        data={defaultContent}
        key={defaultContent}
        onReady={editor => {

          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
          
      />
      {/* <CKEditor
        editor={ClassicEditor}

        data={editorData}
      
        onReady={editor => {
          console.log('Editor is ready to use!', editor);

        }}
        onChange={(event, editor) => {
          console.log('Editor is changeing!', editor);
          const data = editor.getData();
          setEditorData(data);
          onChange(data);

        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}

      /> */}
      

    </div>
  );
}
