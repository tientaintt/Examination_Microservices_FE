import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import Button from "../form-controls/Button/Button";
import { toast } from "react-toastify";
import { useState } from "react";


export default function MultipleChoiceAnswers({ questionSelect, listAnswer, setListAnswer, handleOptionChange, selectedOption, isChooseTrue }) {
    const { t } = useTranslation();
    const [isEditingAnswer, setIsEditingAnswer] = useState(null);
    const [answer, setAnswer] = useState('');

    const [clickCount, setClickCount] = useState(1);

    const handleAddAnswer = (event) => {

        event.preventDefault();
        if (answer.trim() === '') {
            return toast.error(t('Please enter answer'), { position: toast.POSITION.TOP_RIGHT });
        }

        if (listAnswer.length >= 4) {
            return toast.error(t('Maximum of 4 answers allowed'), { position: toast.POSITION.TOP_RIGHT });
        }


        // Thêm đáp án mới vào danh sách
        const updatedListAnswer = [...listAnswer, answer];
        setListAnswer(updatedListAnswer);
        setAnswer('');
        setClickCount(listAnswer.length);


    };

    const handleEditAnswer = (index) => {
        console.log("handleEditAnswer ", index);
        setIsEditingAnswer(index);
    };

    const handleDeleteAnswer = (index) => {
        const updatedListAnswer = listAnswer.filter((_, i) => i !== index);
        setListAnswer(updatedListAnswer);
        toast.success(t('Answer deleted successfully'), { position: toast.POSITION.TOP_RIGHT });
    };

    const handleInputAnswer = (event) => {
        setAnswer(event.target.value);
    }

    const handleEditValueAnswer = (event) => {
        if (isEditingAnswer != null) {
            const updatedAnswers = listAnswer.map((item, index) => {
                if (questionSelect != null) {
                    if (index === isEditingAnswer)
                        return {
                            ...item,
                            'answerContent': event.target.value
                        }
                    return item
                } else {

                    if (index === isEditingAnswer)
                        return event.target.value
                    return item;
                }
            });
            setListAnswer(updatedAnswers);

        }
    }
    return (
        <>

            <label className="block pb-1 text-sm font-medium text-gray-700">{t('Answer')}</label>
            <div className="relative flex justify-center">
                <input
                    value={answer}
                    onChange={handleInputAnswer}
                    type="text"
                    className={`text-opacity-50 border-2 border-gray-500/75 rounded-lg p-4 pe-12 text-sm shadow-sm w-full h-full ${clickCount <= 4 ? '' : 'pointer-events-none opacity-50'}`}
                    placeholder={t('Enter answer')}
                />
                <button
                    onClick={handleAddAnswer}
                    className={`hover:bg-black hover:text-white font-bold border-2 m-1 px-5 py-3 border-black rounded-lg bg-white text-sm ${clickCount <= 4 ? '' : 'pointer-events-none opacity-50'}`}
                >
                    {t('Add')}
                </button>
            </div>
            <div className="answers-list">
                {listAnswer?.map((ans, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="options"
                            value={questionSelect ? ans.idAnswerQuestion : ans}
                            className="mr-2"
                            checked={questionSelect ? (selectedOption == ans.idAnswerQuestion) : (selectedOption === ans)}
                            onChange={(event) => handleOptionChange(event)}
                        />
                        {
                            isEditingAnswer === index ? (<input
                                className="border border-gray-300  rounded-lg p-2 pe-12 text-sm shadow-sm"
                                type="text"
                                defaultValue={questionSelect ? ans.answerContent : ans}
                                onChange={(event) => handleEditValueAnswer(event)}
                            />) : (<span className="mr-2 rounded-lg p-4 pe-12 text-sm shadow-sm">{questionSelect ? ans.answerContent : ans}</span>)
                        }
                        {
                            isEditingAnswer === index ? (<button
                                type="button"
                                onClick={() => handleEditAnswer(null)}
                                className="text-blue-500 hover:text-blue-700 mx-1"
                            >
                                {t('Ok')}
                            </button>) : (<button
                                type="button"
                                onClick={() => handleEditAnswer(index)}
                                className="text-blue-500 hover:text-blue-700 mx-1"
                            >
                                {t('Edit')}
                            </button>)
                        }

                        {questionSelect &&
                            <button
                                type="button"
                                onClick={() => handleDeleteAnswer(index)}
                                className="text-red-500 hover:text-red-700 mx-1"
                            >
                                {t('Delete')}
                            </button>
                        }
                    </div>
                ))}
            </div>

            {/* <div ref={showAnswer} className="showAnswer flex flex-col"></div> */}
            <Button className={clsx((clickCount <= 0 || !isChooseTrue) ? 'pointer-events-none opacity-50 bg-blue-800' : "bg-blue-800")} type="submit">{t('Submit')}</Button>
        </>
    );
}
