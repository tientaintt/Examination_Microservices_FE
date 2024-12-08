import { useTranslation } from "react-i18next";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useEffect, useState } from "react";

export default function QuestionContentInput({ onChange, defaultContent }) {
  const { t } = useTranslation();
  const [editorData, setEditorData] = useState(defaultContent || '');
  const customFractionPlugin = (editor) => {
    editor.ui.componentFactory.add('fractionButton', locale => {
      const buttonView = new editor.ui.view.ButtonView(locale);

      buttonView.set({
        label: 'Insert Fraction',
        withText: true,
        tooltip: true,
      });

      buttonView.on('execute', () => {
        const fragment = editor.data.processor.toView('<span class="fraction">½</span>');
        editor.model.insertContent(editor.model.toSelection(fragment));
      });

      return buttonView;
    });
  };
  return (
    <div>
      <label htmlFor="contentQuestion" className="block pb-1 text-sm font-medium text-gray-700">{t('Question content')}</label>
      {/* <CKEditor
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
          
      /> */}
      <CKEditor
        editor={ClassicEditor}

        data={editorData}

        onReady={editor => {
          console.log('Editor is ready to use!', editor);

        }}
        onChange={(event, editor) => {
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

      />
      

    </div>
  );
}
