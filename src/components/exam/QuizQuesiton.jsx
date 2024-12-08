import React, { useEffect, useState } from 'react';
import Latex from 'react-latex';

const QuizQuestion = React.memo(({ question, handleChooseAnswer, indexQuestion, showScore, listSubmitAnswer }) => {
    const [answer, setAnswer] = useState('');
    const render = (content) => {
        return <Latex>{content}</Latex>;
    };
    const handleAnswerChange = (e) => {
        const inputValue = e.target.value;
        setAnswer(inputValue);
        if (question.questionType === 'Fill in the blank') {
            handleChooseAnswer(question.id, inputValue);
        }
    };

    const isAnswerSelected = (answerContent, questionId) => {
        const submittedAnswer = listSubmitAnswer?.find(ans => ans.questionId === questionId);
        console.log(listSubmitAnswer)
        return submittedAnswer ? submittedAnswer.answer === answerContent : false;
    };

    return (
        <div >

            {question.questionType === 'Multiple Choice' && (
                <div>
                    <h3 className="pl-3 mb-4 font-semibold text-black dark:text-white flex flex-row" dangerouslySetInnerHTML={{ __html: `${indexQuestion + 1}. ${question.content}` }}></h3>
                    <ul className="w-[90%] text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {question.answers.map((choice, index) => (
                            <li key={`${choice.id}-${index}`} className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    {
                                        showScore ? (<>

                                            <input
                                                id={`choice-${question.id}-${choice.id}`}
                                                type="radio"
                                                name={`question-${question.id}`} // Unique name for each question
                                                disabled
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                checked={choice.answerContent === question.submittedAnswer}
                                            />
                                            <label
                                                htmlFor={`choice-${question.id}-${choice.id}`}
                                                className={`w-full py-3 ms-2 text-sm font-medium ${question.correctAnswer === choice.answerContent
                                                    ? "text-green-600 font-semibold"
                                                    : choice.answerContent === question.submittedAnswer && question.correctAnswer !== question.submittedAnswer
                                                        ? "text-red-500"
                                                        : "text-gray-900 dark:text-gray-300"
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: choice.answerContent }}
                                            ></label>


                                            {question.correctAnswer === choice.answerContent && (question.submittedAnswer !== question.correctAnswer || question.submittedAnswer == question.correctAnswer) ? (
                                                <span className="mx-2 h-2 text-center flex items-center text-green-500">&#10003;</span> // Dấu tick xanh cho đáp án đúng 
                                            ) : choice.answerContent === question.submittedAnswer && question.correctAnswer !== question.submittedAnswer ? (
                                                <span className="mx-2 h-2 text-center flex items-center text-red-500">&#10007;</span> // Dấu x đỏ nếu đáp án sai
                                            ) : null}
                                        </>)
                                            :
                                            (<>
                                                <input
                                                    id={`choice-${question.id}-${choice.id}`}
                                                    type="radio"
                                                    name={`question-${question.id}`} // Unique name for each question
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                    checked={isAnswerSelected(choice.answerContent, question.id)}
                                                    onChange={() => handleChooseAnswer(question.id, choice.answerContent)}
                                                />
                                                <label htmlFor={`choice-${question.id}-${choice.id}`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: choice.answerContent }}></label>

                                            </>)
                                    }

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* True/False Questions */}
            {/* {question.questionType === 'True/False' && (
                <div>
                    <h3 className="pl-3 mb-4 font-semibold text-black dark:text-white flex flex-row" dangerouslySetInnerHTML={{ __html: `${indexQuestion + 1}. ${question.content}` }}></h3>
                    <ul className="w-[90%] text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {['True', 'False'].map((choice) => (
                            <li key={choice} className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input
                                        id={`true-false-${question.id}-${choice}`}
                                        type="radio"
                                        name={`true-false-${question.id}`} // Unique name for each question
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        checked={isAnswerSelected(choice, question.id)}
                                        onChange={() => handleChooseAnswer(question.id, choice)}
                                    />
                                    <label htmlFor={`true-false-${question.id}-${choice}`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {choice}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
            {question.questionType === 'True/False' && (
                <div>
                    <h3 className="pl-3 mb-4 font-semibold text-black dark:text-white flex flex-row" dangerouslySetInnerHTML={{ __html: `${indexQuestion + 1}. ${question.content}` }}></h3>
                    <ul className="w-[90%] text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {['True', 'False'].map((choice) => (
                            <li key={choice} className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    {showScore ? (
                                        <>
                                            <input
                                                id={`true-false-${question.id}-${choice}`}
                                                type="radio"
                                                name={`true-false-${question.id}`} // Unique name for each question
                                                disabled
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                checked={choice === question.submittedAnswer}
                                            />
                                            <label
                                                htmlFor={`true-false-${question.id}-${choice}`}
                                                className={`w-full py-3 ms-2 text-sm font-medium ${question.correctAnswer === choice
                                                    ? "text-green-600 font-semibold"
                                                    : choice === question.submittedAnswer && question.correctAnswer !== question.submittedAnswer
                                                        ? "text-red-500"
                                                        : "text-gray-900 dark:text-gray-300"
                                                    }`}
                                            >
                                                {choice}
                                            </label>
                                            {question.correctAnswer === choice && (question.submittedAnswer !== question.correctAnswer || question.submittedAnswer == question.correctAnswer) ? (
                                                <span className="mx-2 h-2 text-center flex items-center text-green-500">&#10003;</span> // Dấu tick xanh cho đáp án đúng
                                            ) : choice === question.submittedAnswer && question.correctAnswer !== question.submittedAnswer ? (
                                                <span className="mx-2 h-2 text-center flex items-center text-red-500">&#10007;</span> // Dấu x đỏ nếu đáp án sai
                                            ) : null}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id={`true-false-${question.id}-${choice}`}
                                                type="radio"
                                                name={`true-false-${question.id}`} // Unique name for each question
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                checked={isAnswerSelected(choice, question.id)}
                                                onChange={() => handleChooseAnswer(question.id, choice)}
                                            />
                                            <label
                                                htmlFor={`true-false-${question.id}-${choice}`}
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                {choice}
                                            </label>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {/* Fill in the Blank Questions */}
            {question.questionType === 'Fill in the blank' && (
                <div>
                    <h3 className="pl-3 mb-4 font-semibold text-black dark:text-white flex flex-row" dangerouslySetInnerHTML={{ __html: `${indexQuestion + 1}. ${question.content}` }}></h3>
                    {!showScore && (
                        <input
                            type="text"
                            value={answer}
                            onChange={handleAnswerChange}
                            className="border-2 border-gray-500/75 rounded-lg p-4 text-sm mb-2 w-[90%]"
                            placeholder="Enter your answer here"
                        />
                    )}
                    {showScore && (
                        <>
                            <p
                                className="border-2 border-gray-500/75 rounded-lg p-4 text-sm mb-2 w-[90%]"
                                dangerouslySetInnerHTML={{ __html: question.submittedAnswer }}
                            />
                            <p className={`mt-2 ${question.submittedAnswer === answer ? 'text-green-500' : 'text-red-500'}`}>
                                {question.submittedAnswer === answer ? 'Correct!' : `Incorrect! The correct answer is: ${question.correctAnswer}`}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

export default QuizQuestion;
