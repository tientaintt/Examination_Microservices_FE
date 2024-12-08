import { useTranslation } from "react-i18next";
import Button from "../form-controls/Button/Button";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function ShortAnswerQuestion({ listAnswer, setListAnswer, questionSelect }) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState(null);

  const handleInputAnswer = (event) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);


  };
  const handleSubmit = (event) => {
    // if (answer.trim() === '') {
    //   return toast.error(t('Please enter an answer'), { position: toast.POSITION.TOP_RIGHT });
    // }

    // toast.success(t('Answer submitted successfully'), { position: toast.POSITION.TOP_RIGHT });
    console.log(listAnswer);
    if(questionSelect){
      setListAnswer(prevList =>
        prevList.map((element, index) => 
          index === 0 ? { ...element, answerContent: answer } : element
        )
      );
      
    }else{
      if (Array.isArray(listAnswer)) {
        setListAnswer([...listAnswer, answer]);
      } else {
  
        setListAnswer([answer]);
      }
    }
   
    setAnswer(null);

  };

  useEffect(() => {
    if (questionSelect) {
      setAnswer(listAnswer[0].answerContent);
    }
    // return () => {
    //   // This function will run on unmount
    //   handleSubmit(); // Call handleSubmit when the component unmounts
    // };
  }, [])
  return (
    <>
      <label className="block pb-1 text-sm font-medium text-gray-700">{t('Answer')}</label>
      <input
        type="text"
        defaultValue={answer}
        onChange={(event) => handleInputAnswer(event)}
        className="border-2 border-gray-500/75 rounded-lg p-4 w-full text-sm mb-2"
        placeholder={t('Enter answer')}
      />
      <Button type="submit" handleOnClick={()=>handleSubmit()} className={answer ? "bg-blue-800 mb-2" : "pointer-events-none opacity-50 bg-blue-800"}>
        {t('Submit')}
      </Button>
    </>
  );
}
