import { useTranslation } from "react-i18next";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useEffect, useState } from "react";

export default function QuestionContentInput({ onChange, defaultContent }) {
  
  const { t } = useTranslation();
  const [editorData, setEditorData] = useState(defaultContent ? defaultContent : '');
  console.log(editorData);
  console.log(defaultContent);
//   const uploadAdapter = (loader) => {
//     return {
//         upload: () => {
//             return new Promise((resolve, reject) => {
//                 const body = new FormData();
//                 loader.file.then((file) => {
//                     body.append("file", file);
//                     const params = {
//                         parent_id: parent_id || userData?.id,
//                         parent_type: type || "USER_PROFILE_DESCRIPTION"
//                     };
//                     apiUploadFile(body, params)
//                         .then((res => res.data?.path_file))
//                         .then((res) => {
//                             resolve({ default: res });
//                         })
//                         .catch((err) => {
//                             reject(err);
//                         });
//                 });
//             });
//         }
//     };
// };
// function uploadPlugin(editor) {
//     editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
//         return uploadAdapter(loader);
//     }
// }
  return (
    <div>
      <label htmlFor="contentQuestion" className="block pb-1 text-sm font-medium text-gray-700">{t('Question content')}</label>
      <CKEditor
        editor={ClassicEditor}
        data={defaultContent}
        key={defaultContent}
        config={
          {
            // extraPlugins:[uploadPlugin],
            toolbar: [
              'heading', '|',
              'bold', 'italic', '|',
              'numberedList', 'bulletedList', '|',
              'link', '|',
              'undo', 'redo'
          ],
          }
        }
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
