import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteQuestionService, addQuestionByQuestionGroupService, updateQuestionService, getAllActiveQuestionByQuestionGrIDService, getAllInActiveQuestionByQuestionGrIDService, getQuestionByIdService, activeQuestionService, exportListQuestionOfQuestionGroupService, importListQuestionIntoQuestionGroupService, deleteFileByPathService, uploadFileService } from '../../../services/ApiService';
import { toast } from 'react-toastify';

import Button from '../../../components/form-controls/Button/Button';
import MultipleChoiceAnswers from '../../../components/exam/MultipleChoiceAnswers';
import TrueFalseQuestion from '../../../components/exam/TrueFalseQuestion';
import ShortAnswerQuestion from '../../../components/exam/ShortAnswerQuestion';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import ModalCustom from '../../../components/modal/Modal';
import { useForm } from 'react-hook-form';
import QuestionContentInput from '../../../components/exam/QuestionContentInput';
import InputField from '../../../components/form-controls/InputField/InputField';
import { Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Spinner, Typography } from '@material-tailwind/react';
const CONTENT_QUESTION = 'content';
const QUESTION_GROUP_ID = 'questionGroupId';
const QUESTION_TYPE = 'questionType';
const ID_QUESTION = 'id';
export default function QuestionManagementTeacher() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const initialValue = {
        [CONTENT_QUESTION]: '',
        [QUESTION_GROUP_ID]: '',
        [ID_QUESTION]: '',
        [QUESTION_TYPE]: '',

    };
    const [isClickImport, setIsClickImport] = useState(false);
    const [file, setFile] = useState();
    const { subjectId, questionGroupId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortType, setSortType] = useState('asc');
    const [sortBy, setSortBy] = useState('content');
    const [searchText, setSearchText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isModeActive, setModeActive] = useState(true);
    const [listAnswer, setListAnswer] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionType, setQuestionType] = useState('Multiple Choice');
    const [contentQuestion, setContentQuestion] = useState('');
    const [isChooseTrue, setChooseTrue] = useState(false);
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        content: '',
        difficulty: '',
        questionType: 'Multiple Choice',
        answers: []
    });
    const [questionSelect, setQuestionSelect] = useState({
        id: ''
        , content: ''
        , answers: []
        , questionType: ''
    });
    const sortOptions = [
        { value: 'content', label: t('Question content') },

    ];

    const questionTypeOptions = [
        { value: 'Multiple Choice', label: t('Multiple Choice') },
        { value: 'True/False', label: t('True/False') },
        { value: 'Fill in the blank', label: t('Fill in the blank') }
    ];
    const [questionId, setQuestionId] = useState(null);
    const [imageURL, setImageUrl] = useState(null);
    const [fileInputRef, setFileInputRef] = useState(null);
    const [img, setImg] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const [showAllField, setShowAllField] = useState(false);
    const [audio, setAudio] = useState(null);
    const audioInputRef = useRef(null);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        setAudio(file);
    };

    const handleRemoveAudio = () => {
        setAudio(null);
        audioInputRef.current.value = null;
    };
    const handleRemoveImg = () => {
        setImg(null);
        if (fileInputRef && fileInputRef.value) {
            fileInputRef.value = '';
        }
    };
    const handleImgChange = (e) => {
        setImgLoading(true);
        const file = e.target.files[0];
        if (file) {
            if (file.type.includes("image")) {
                setImg(file);
            } else {
                toast.error("Image not accept!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                handleRemoveImg();
            }
        }
        setImgLoading(false);
    };
    const deleteImage = async () => {
        if (imageURL) {
            try {
                setImgLoading(true);
                await deleteFileByPathService(imageURL);

                setImgLoading(false);
            } catch (e) {
                console.error('Upload failed:', e);
                setImgLoading(false);
            }
        }
    };
    const uploadImage = async () => {
        try {
            setImgLoading(true);
            const formData = new FormData();
            formData.append('file', img);
            const params = {
                parentId: questionId,
                parentType: "QUESTION_IMAGE"
            };
            uploadFileService(formData, params);
            setImgLoading(false);
        } catch (e) {
            console.error('Upload failed:', e);
            setImgLoading(false);
            toast.error(`Update fail !`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    const handleUploadImg = async () => {

        if (img) {
            setImgLoading(true);

            await deleteImage();
            await uploadImage();

            setImgLoading(false);

        } else {
            console.warn('No image selected for upload.');
        }

    };
    const handleShowAllField = () => {
        setShowAllField(true);
        const newBody = {
            content: contentQuestion,
            answers: [],

            questionGroupId: questionGroupId,
            questionType: questionType
        }
        addQuestionByQuestionGroupService(newBody).then((res) => {
            getAllQuestion();
            setQuestionSelect(res.data);
            setQuestionId(res.data.questionId);
            console.log(res)
        }).catch((error) => {
            toast.error(t('Add question fail !'), { position: toast.POSITION.TOP_RIGHT });
        })
    }
    const getAllInActiveQuestionByQuestionGrID = async (page, sortType, column, size, search) => {

        getAllInActiveQuestionByQuestionGrIDService(questionGroupId, page, sortType, column, size, search).then((res) => {
            console.log(res);
            setQuestions(res.data.content);
            setTotalPages(res.data.totalPages);
        }).catch((error) => {
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    };

    const handleInputContent = (data) => {
        setContentQuestion(data);
    }

    const getAllActiveQuestionByQuestionGrID = async (page, sortType, column, size, search) => {

        getAllActiveQuestionByQuestionGrIDService(questionGroupId, page, sortType, column, size, search).then((res) => {
            console.log(res)
            setQuestions(res.data.content);
            setTotalPages(res.data.totalPages);
        }).catch((error) => {
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    };

    const getAllQuestion = (page, sortType, column, size, search) => {

        if (isModeActive)
            getAllActiveQuestionByQuestionGrID(page, sortType, column, size, search);
        else
            getAllInActiveQuestionByQuestionGrID(page, sortType, column, size, search);
    };

    useEffect(() => {
        getAllQuestion(page, sortType, sortBy, 6, searchText);
    }, [questionGroupId, page, sortBy, sortType, searchText, isModeActive]);

    const handleSearch = (e) => {
        console.log(e.target.value)
        setSearchText(e.target.value);
        setPage(0);
    };

    const handleDelete = (item) => {
        setShowDeleteModal(true);

        setQuestionSelect(item);
    };
    const form = useForm({
        mode: 'onSubmit',
        defaultValues: initialValue,
        criteriaMode: "firstError"
    })
    const submitForm = (body) => {
        console.log('submitForm')

        const newBody = {
            content: contentQuestion,
            answers: [],
            id: questionSelect.id,
            questionGroupId: questionGroupId,
            questionType: questionType
        }


        console.log(questionType);
        if (showAddModal) {

            if (questionType === 'Multiple Choice') {
                listAnswer.forEach((item) => {
                    newBody.answers.push({
                        answerContent: item,
                        isCorrect: item === selectedOption
                    });
                });
            }


            if (questionType === 'True/False') {

                const trueFalseAnswers = [
                    { answerContent: 'True', isCorrect: selectedOption === 'True' },
                    { answerContent: 'False', isCorrect: selectedOption === 'False' },
                ];
                newBody.answers = trueFalseAnswers;
            }

            if (questionType === 'Fill in the blank') {
                newBody.answers.push({
                    answerContent: listAnswer[0],
                    isCorrect: true
                });
            }
            console.log(listAnswer[0])
            console.log(newBody);
            handleUploadImg().then(() => {
                updateQuestionService(newBody).then((res) => {
                    getAllQuestion(page, sortType, sortBy, 6, searchText);
                    toast.success(t('Add question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
                    handleClose();
                }).catch((error) => {
                    toast.error(t('Add question fail !'), { position: toast.POSITION.TOP_RIGHT });
                })
            }).catch(console.log)
        }

        if (showDeleteModal)
            deleteQuestionService(body.id).then((res) => {
                getAllQuestion(page, sortType, sortBy, 6, searchText);
                handleClose();
                toast.success(t('Delete question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
            }).catch((error) => {
                toast.error(t('Delete question fail !'), { position: toast.POSITION.TOP_RIGHT });
            })

        if (showEditModal) {
            handleSubmitEdit();
        }


    }
    const handleClickActive = (id) => {
        activeQuestionService(id).then((res) => {
            getAllQuestion(page, sortType, sortBy, 6, searchText);
            handleClose();
        }).catch((error) => {
            toast.error(t('Active subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }
    const handleClose = () => {
        if (showEditModal)
            setShowEditModal(false);
        if (showAddModal)
            setShowAddModal(false);
        if (showDeleteModal)
            setShowDeleteModal(false);
        setShowActiveModal(false)
        setQuestionType('')
        setChooseTrue(false)
        setSelectedOption('');

        setQuestionSelect({});
        setImageUrl(null);
        setShowAllField(null);
        setImg(null);
        setListAnswer([]);

    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        importListQuestionIntoQuestionGroupService(formData, questionGroupId).then((res) => {
            getAllActiveQuestionByQuestionGrID();
            setFile(null)
            setIsClickImport(false)
            toast.success(t('Import successfuly !'), { position: toast.POSITION.TOP_RIGHT });
        }).catch(e => {
            console.log(e)
            toast.error(t("Cannot import file !"), { position: toast.POSITION.TOP_RIGHT })
        })

    };
    const handleClickExport = () => {
        exportListQuestionOfQuestionGroupService(questionGroupId)
            .then((res) => {
                console.log(res)
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Question.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);


            }).catch((e) => {
                toast.error(t('Export question fail !'), { position: toast.POSITION.TOP_RIGHT });
            })
    }
    const handleSubmitEdit = () => {
        console.log("handleSubmitEdit");
        console.log(listAnswer)
        console.log(selectedOption);
        const newBody = {
            content: contentQuestion,
            answers: [],
            id: questionSelect.id,
            questionGroupId: questionSelect.questionGroupId,
            questionType: questionSelect.questionType
        }


        if (questionType === 'Multiple Choice') {
            listAnswer.forEach((item) => {
                newBody.answers.push({
                    answerContent: item,
                    isCorrect: item === selectedOption
                });
            });
        }


        if (questionType === 'True/False') {

            const trueFalseAnswers = [
                { answerContent: 'True', isCorrect: selectedOption === 'True' },
                { answerContent: 'False', isCorrect: selectedOption === 'False' },
            ];
            newBody.answers = trueFalseAnswers;
        }

        if (questionType === 'Fill in the blank') {
            newBody.answers.push({
                answerContent: listAnswer[0],
                isCorrect: true
            });
        }
        console.log(newBody)
        updateQuestionService(newBody).then((res) => {
            getAllQuestion(page, sortType, sortBy, 6, searchText);
            toast.success('Edit question successfuly !', { position: toast.POSITION.TOP_RIGHT });
            handleClose();
        }).catch((error) => {
            toast.error(t('Edit question fail !'), { position: toast.POSITION.TOP_RIGHT });
        })
    }

    const handleOptionChange = (event) => {
        console.log(event.target.value);
        setSelectedOption(event.target.value);
        setChooseTrue(true);
    };

    const openAddModal = () => {
        setNewQuestion({ content: '', difficulty: '', questionType: 'Multiple Choice', answers: [] });
        setShowAddModal(true);
        setQuestionType('Multiple Choice');
    };

    const openEditModal = (question) => {
        console.log("openEditModal ", question);
        setShowEditModal(true);

        getQuestionByIdService(question.id).then((res) => {
            console.log("getQuestionByIdService ", res.data)
            setQuestionSelect(res.data);

            setContentQuestion(res.data.content)
            setQuestionType(res.data.questionType)
            setQuestionId(res.data.questionId)
            setImageUrl(res.data.imageUrl)

            setListAnswer(res.data.answers.map(answer => {
                return answer.answerContent;
            }))
        }).catch(e => {
            toast.error(t('Get question {} fail !').replace('{}', `${question.id}`), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            <div onClick={() => navigate(-1)}
                className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
            </div>
            <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Question management')}</h1>

            <div className="flex items-center mb-4 space-x-4">
                <input
                    type="text"
                    placeholder={t('Search questions')}
                    value={searchText}
                    onChange={(e) => handleSearch(e)}
                    className="border p-2 rounded bg-white"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded bg-white"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border p-2 rounded bg-white"
                >
                    <option value="asc">{t('Ascending')}</option>
                    <option value="desc">{t('Descending')}</option>
                </select>
                <div className='w-[200px]'>
                    <Toggle checked={isModeActive} handleToggle={setModeActive} >{isModeActive ? t('Active') : t('Inactive')}</Toggle>
                </div>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={openAddModal}
                >
                    {t('Add')}
                </button>
                <button className="bg-teal-500 px-4 py-2 text-white rounded-lg" onClick={() => { handleClickExport() }}>{t('Export list question')}</button>
                {!isClickImport &&
                    <>
                        <button className="bg-yellow-500 px-4 py-2 text-white rounded-lg " onClick={() => { setIsClickImport(true) }}>{t('Import list question')}</button>

                    </>}
                {
                    isClickImport && <>
                        <input type="file" id="file-upload" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white h-10 inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset cursor-pointer rounded-lg">
                            {t('Select file')}
                        </label>
                        {
                            file && <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white h-10 inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset rounded-lg">
                                {t('Upload')}
                            </button>
                        }

                    </>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-3">
                    {questions.length > 0 ? (
                        questions.map(question => (
                            <li key={question.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                <div className='w-[80%]'>
                                    <p className="text-lg font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: question.content }} ></p>
                                    <p className="text-sm text-gray-500">{t('Question type')}: {question.questionType}</p>
                                </div>
                                <div className='w-[20%]'>
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                                        onClick={() => openEditModal(question)}
                                    >
                                        {t('Edit')}
                                    </button>
                                    <button onClick={() => handleDelete(question)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2 ">
                                        {t('Delete')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowActiveModal(true)
                                            setQuestionSelect(question);
                                        }}
                                        className={`px-3 py-1 ${isModeActive ? 'bg-gray-300' : ' bg-yellow-500'} text-white rounded hover:bg-yellow-600`}
                                        disabled={isModeActive}
                                    >
                                        {t('Active')}
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">{t("No questions available in this set")}</p>
                    )}
                </ul>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg"
                    >
                        {t('Previous')}
                    </button>
                    <span>{t('Page')} {page + 1} {t('of')} {totalPages}</span>
                    <button
                        onClick={() => setPage(prev => (prev < totalPages - 1 ? prev + 1 : prev))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg"
                    >
                        {t('Next')}
                    </button>
                </div>
            </div>

            {showAddModal && (
                <ModalCustom title={t('Add question')} onClose={() => handleClose()}>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="questionType" className="font-medium">{t('Select question type')}</label>
                        <select
                            id="questionType"
                            value={newQuestion.questionType}
                            onChange={(e) => {
                                setNewQuestion({ ...newQuestion, questionType: e.target.value })
                                setQuestionType(e.target.value);
                            }}
                            className="border p-2 rounded bg-white"
                        >
                            {questionTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <QuestionContentInput onChange={handleInputContent} />
                        {showAllField ? (
                            <>
                                <div className='flex flex-col'>
                                    <div className='my-3 max-w-[40rem] relative mb-0 rounded-lg pt-4 px-4 '>
                                        <div className='w-full min-h-[230px] h-[230px] relative flex border rounded-sm border-[#003a47]'>
                                            <div className='h-full flex justify-center items-center px-8  m-auto w-[240px] max-w-[240px]  bg-[#f0f2f4]'>
                                                {imgLoading ? (
                                                    <Spinner className='w-[60px] object-cover object-center h-auto' color="teal" />
                                                ) : (
                                                    <img
                                                        src={img ? URL.createObjectURL(img) : imageURL}
                                                        className='p-2 h-full object-scale-down object-center'
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-between items-center mt-6 relative h-[40px] border rounded-sm border-[#003a47]'>
                                            <div className='mx-3 w-full h-full flex items-center '>
                                                <Typography className='cursor-default'>
                                                    {img?.name || t("No file selected")}
                                                </Typography>
                                                {img && (
                                                    <span onClick={handleRemoveImg} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                                        <FontAwesomeIcon className='' icon={faXmark} />
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleImgChange}
                                                ref={(fileInput) => (setFileInputRef(fileInput))}
                                            />
                                            <Button handleOnClick={() => fileInputRef && fileInputRef.click()} className="bg-blue-500 hover:bg-blue-700 !rounded-none !w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" > {t("Select")}</Button>
                                        </div>
                                        {/* <label>{t('Audio')}</label>
                                        <div className='w-full flex justify-between items-center relative h-[40px] border rounded-sm border-[#003a47]'>

                                            <div className='mx-3 w-full h-full flex items-center '>
                                                <Typography className='cursor-default'>
                                                    {audio?.name || t("No file selected")}
                                                </Typography>
                                                {audio && (
                                                    <span onClick={handleRemoveAudio} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                                        <FontAwesomeIcon className='' icon={faTimes} />
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="audio/mp3"
                                                style={{ display: 'none' }}
                                                onChange={handleAudioChange}
                                                ref={audioInputRef}
                                            />
                                            <Button handleOnClick={() => audioInputRef.current.click()} className="bg-blue-500 hover:bg-blue-700 !rounded-none !w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" > {t("Select")}</Button>
                                        </div>
                                        {audio && (
                                            <audio controls>
                                                <source src={URL.createObjectURL(audio)} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )} */}
                                    </div>

                                    {/* <Button disable={!img} handleOnClick={() => handleUploadImg()} className="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white max-w-[40rem]" rounded >{t('Save')}</Button> */}
                                </div>

                                <form onSubmit={form.handleSubmit(submitForm)} className="relative mb-0 space-y-4 rounded-lg pt-4 px-4 ">
                                    {questionType === 'Multiple Choice' && (

                                        <MultipleChoiceAnswers
                                            handleOptionChange={handleOptionChange}
                                            selectedOption={selectedOption}
                                            setListAnswer={setListAnswer}
                                            listAnswer={listAnswer}
                                            isChooseTrue={isChooseTrue}
                                        />

                                    )}

                                    {questionType === 'True/False' && (
                                        <TrueFalseQuestion selectedOption={selectedOption} handleOptionChange={handleOptionChange} />
                                    )}

                                    {questionType === 'Fill in the blank' && (
                                        <ShortAnswerQuestion listAnswer={listAnswer} setListAnswer={setListAnswer} />
                                    )}

                                    {/* {questionType === 'Essay' && (
                                                                            <EssayQuestion handleInputContent={handleInputContent} />
                                                                        )} */}
                                </form>
                            </>
                        ) : (
                            <>
                                <div className='w-full flex justify-end'>
                                    <button onClick={() => { handleShowAllField() }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded">
                                        {t('Next')}
                                    </button>
                                </div>
                            </>
                        )}

                    </div>
                </ModalCustom>
            )}
            {
                showEditModal && (
                    questionSelect && (
                        <ModalCustom title={t('Edit question')} onClose={() => handleClose()}>

                            <QuestionContentInput onChange={handleInputContent} defaultContent={questionSelect.content} />

                            <form onSubmit={form.handleSubmit(submitForm)} className="relative mb-0 space-y-4 rounded-lg pt-4 px-4 shadow-lg ">
                                {questionType === 'Multiple Choice' && (<>

                                    <MultipleChoiceAnswers
                                        handleOptionChange={handleOptionChange}
                                        selectedOption={selectedOption}
                                        setListAnswer={setListAnswer}
                                        listAnswer={listAnswer}
                                        isChooseTrue={isChooseTrue}
                                        questionSelect={questionSelect}

                                    />

                                </>
                                )}

                                {questionType === 'True/False' && (
                                    <TrueFalseQuestion selectedOption={selectedOption} handleOptionChange={handleOptionChange} questionSelect={questionSelect} />
                                )}

                                {questionType === 'Fill in the blank' && (
                                    <ShortAnswerQuestion listAnswer={listAnswer} setListAnswer={setListAnswer} questionSelect={questionSelect} />
                                )}


                            </form>


                        </ModalCustom>
                    )
                )

            }
            {showDeleteModal && (
                <>
                    <Modal className="bg-opacity-60 z-[105] " show={true} size="md" popup onClose={() => handleClose()} >
                        <Modal.Header />
                        <Modal.Body>
                            <form onSubmit={form.handleSubmit(submitForm)}
                                className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                            >
                                <InputField name={ID_QUESTION} disabled form={form} defaultValue={questionSelect.id} />
                                <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Warning')} </p>
                                <h1 className='text-[16px] text-center'>{t('Are you sure you want to delete ?')}</h1>
                                <div className='invisible py-3'></div>
                                <div className='flex gap-3'>
                                    <Button className="bg-red-500" type='submit'>{t('Delete')}</Button>
                                    <Button handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal></>)
            }
            {showActiveModal && (
                <Modal
                    className="bg-opacity-60 z-[101]"
                    show={true}
                    size="md"
                    popup
                    onClose={() => handleClose()}
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
                            <p className="text-center text-[20px] font-medium text-yellow-300 uppercase">
                                {t('Warning')}
                            </p>
                            <h1 className="text-[16px] text-center">
                                {t('Are you sure you want to activate this subject?')}
                            </h1>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    handleOnClick={() => handleClickActive(questionSelect.id)}
                                    className="bg-yellow-500 w-[100px]"
                                >
                                    {t('Activate')}
                                </Button>
                                <Button
                                    handleOnClick={() => handleClose()}
                                    className="bg-blue-500"
                                >
                                    {t('Cancel')}
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    )

}
