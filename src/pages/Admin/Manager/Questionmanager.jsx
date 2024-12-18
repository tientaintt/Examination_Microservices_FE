import React, { useEffect, useRef, useState } from 'react'
import Button from '../../../components/form-controls/Button/Button';
import { Modal, Spinner, Toast } from 'flowbite-react';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import InputField from '../../../components/form-controls/InputField/InputField';
import PaginationNav from '../../../components/pagination/PaginationNav';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button as ButtonMenu,
    Typography,

} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faQuestionCircle, faEdit, faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons';

import { exportListQuestionOfQuestionGroupService, activeQuestionService, addQuestionByQuestionGroupService, deleteQuestionService, getAllActiveQuestionByIdClassroomService, getAllActiveQuestionByQuestionGrIDService, getAllInActiveQuestionByIdClassroomService, getAllInActiveQuestionByQuestionGrIDService, getQuestionByIdService, removeCredential, updateQuestionService, importListQuestionIntoQuestionGroupService, deleteFileByPathService, uploadFileByPathService, uploadFileService } from '../../../services/ApiService';
import Path from '../../../utils/Path';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import QuestionContentInput from '../../../components/exam/QuestionContentInput';
import MultipleChoiceAnswers from '../../../components/exam/MultipleChoiceAnswers';
import TrueFalseQuestion from '../../../components/exam/TrueFalseQuestion';
import ShortAnswerQuestion from '../../../components/exam/ShortAnswerQuestion';
const CONTENT_QUESTION = 'content';
const QUESTION_GROUP_ID = 'questionGroupId';
const QUESTION_TYPE = 'questionType';
const ID_QUESTION = 'id';
export const Questionmanager = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [questionType, setQuestionType] = useState('');
    const [contentQuestion, setContentQuestion] = useState('');
    const [listAnswer, setListAnswer] = useState([]);
    const [isClickImport, setIsClickImport] = useState(false);
    const [isQuestionGroupOpen, setIsQuestionGroupOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [listAllQuestion, setListAllQuestion] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFirst, setIsFirst] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [offset, setOffset] = useState(0);
    const [size, setSize] = useState(6);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [file, setFile] = useState();
    const [isChooseTrue, setChooseTrue] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionId, setQuestionId] = useState(null);
    const [questionSelect, setQuestionSelect] = useState({
        id: ''
        , content: ''
        , answers: []
        , questionType: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);

    const [isModeActive, setIsModeActivate] = useState(true);


    const [listCheckBox, setListCheckBox] = useState([]);
    const [isAllCheckBox, setIsAllCheckBox] = useState(true);
    const [isChooseActive, setIsChooseActive] = useState(false);
    const [showOptions, setShowOptions] = useState(true);

    const [imageURL, setImageUrl] = useState(null);
    const [fileInputRef, setFileInputRef] = useState(null);
    const [img, setImg] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const [showAllField, setShowAllField] = useState(false)
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
    const handleConfirmSelection = () => {
        setShowOptions(false);
    };

    const handleQuestionTypeChange = (type) => {
        setQuestionType(type);
        handleConfirmSelection();
    };

    const handleInputContent = (data) => {
        setContentQuestion(data);
    }



    // const showAnswer = useRef(null);

    const initialValue = {
        [CONTENT_QUESTION]: '',
        [QUESTION_GROUP_ID]: '',
        [ID_QUESTION]: '',
        [QUESTION_TYPE]: '',

    };
    // const handleAddAnswer = (event) => {
    //     event.preventDefault();
    //     if (answer === '') {
    //         toast.error(t('Please enter answer'), { position: toast.POSITION.TOP_RIGHT })
    //     }
    //     else {
    //         const updatedListAnswer = [...listAnswer];
    //         if (listAnswer.length === 0) {
    //             updatedListAnswer.push(answer);
    //             const label = document.createElement('label');
    //             const input = document.createElement('input');
    //             input.type = 'radio';
    //             input.name = 'options';
    //             input.value = answer;
    //             input.className = 'mr-[5px]';
    //             label.className = 'flex items-center'
    //             setListAnswer(updatedListAnswer);
    //             input.checked = selectedOption === input.value;
    //             input.addEventListener('change', handleOptionChange);
    //             // Object.assign(input, form.register('asnwer' + clickCount));
    //             label.appendChild(input);
    //             label.appendChild(document.createTextNode(answer));
    //             showAnswer.current.appendChild(label);
    //             setClickCount(clickCount + 1);
    //             setAnswer('');
    //         }
    //         else {
    //             if (updatedListAnswer.indexOf(answer) === -1) {
    //                 updatedListAnswer.push(answer);
    //                 const label = document.createElement('label');
    //                 const input = document.createElement('input');
    //                 input.type = 'radio';
    //                 input.name = 'options';
    //                 input.value = answer;
    //                 input.className = 'mr-[5px]';
    //                 label.className = 'flex items-center'
    //                 setListAnswer(updatedListAnswer);
    //                 input.checked = selectedOption === input.value;
    //                 input.addEventListener('change', (event) => handleOptionChange(event));
    //                 label.appendChild(input);
    //                 label.appendChild(document.createTextNode(answer));
    //                 showAnswer.current.appendChild(label);
    //                 setClickCount(clickCount + 1);
    //                 setAnswer('');
    //             }
    //             else {
    //                 toast.error(t('Please enter an answer different from the one already given'), toast.POSITION.TOP_RIGHT);
    //             }
    //         }

    //     }


    // }


    // const handleAddAnswer = (event) => {
    //     event.preventDefault();
    //     if (answer.trim() === '') {
    //         return toast.error(t('Please enter answer'), { position: toast.POSITION.TOP_RIGHT });
    //     }

    //     if (listAnswer.length >= 4) {
    //         return toast.error(t('Maximum of 4 answers allowed'), { position: toast.POSITION.TOP_RIGHT });
    //     }

    //     if (isEditingAnswer !== null) {
    //         // Cập nhật đáp án đang được chỉnh sửa
    //         const updatedAnswers = listAnswer.map((item, index) => 
    //             index === isEditingAnswer ? answer : item
    //         );
    //         setListAnswer(updatedAnswers);
    //         setIsEditingAnswer(null);
    //         setAnswer('');
    //         toast.success(t('Answer updated successfully'), { position: toast.POSITION.TOP_RIGHT });
    //     } else {
    //         // Thêm đáp án mới vào danh sách
    //         const updatedListAnswer = [...listAnswer, answer];
    //         setListAnswer(updatedListAnswer);
    //         setAnswer('');
    //     }
    // };

    // const handleEditAnswer = (index) => {
    //     // Đưa đáp án vào ô input để chỉnh sửa
    //     setAnswer(listAnswer[index]);
    //     setIsEditingAnswer(index);
    // };
    // const handleInputAnswer = (event) => {
    //     setAnswer(event.target.value);
    // }

    const isChecked = (itemId) => {
        const filteredItems = listCheckBox.filter((item) => item === itemId);
        return filteredItems.length > 0;
    };

    const handleCheckboxChange = (event, id, isAll) => {
        if (isAll === true) {
            setListCheckBox(listAllQuestion.map((item, index) => {
                return item.id;
            }));
            if (props.setQuestionsSelect) {
                props.setQuestionsSelect(listAllQuestion.map((item, index) => {
                    return item.id;
                }))
            }
            setIsAllCheckBox(!isAll);
        } else if (isAll === false) {
            setListCheckBox([]);
            if (props.setQuestionsSelect) {
                props.setQuestionsSelect([]);
            }
            setIsAllCheckBox(!isAll);
        }
        else {
            const isChecked = event.target.checked;

            if (isChecked) {
                setListCheckBox((prevSelected) => [...prevSelected, id]);
                if (props.setQuestionsSelect) {
                    props.setQuestionsSelect([...listCheckBox, id]
                    )
                }
            } else {
                setListCheckBox((prevSelected) =>
                    prevSelected.filter((value) => value !== id)
                );
                if (props.setQuestionsSelect) {
                    props.setQuestionsSelect(listCheckBox.filter((value) => value !== id))
                }
            }
        }

    };

    const handleClickDelete = (item) => {
        setIsDelete(true);
        setQuestionSelect(item);
    }

    const handleClose = () => {
        if (isEdit)
            setIsEdit(false);
        if (isAdd)
            setIsAdd(false);
        if (isDelete)
            setIsDelete(false);
        if (isQuestionGroupOpen)
            setIsQuestionGroupOpen(false);
        if (isChooseActive)
            setIsChooseActive(false);
        if (showAllField)
            setShowAllField(false)
        setShowOptions(true)
        setQuestionType('')
        setChooseTrue(false)
        setSelectedOption('');
        setFile(undefined);
        setImg(undefined);
        // setAnswer('');


        setListAnswer([]);

    }
    const handleClickExport = () => {
        exportListQuestionOfQuestionGroupService(props.id)
            .then((res) => {
                console.log(res)
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Question.xlsx`); // Tên file
                document.body.appendChild(link);
                link.click();
                link.remove();
                // Giải phóng URL để tránh rò rỉ bộ nhớ
                window.URL.revokeObjectURL(url);


            }).catch((e) => {
                toast.error(t('Export question fail !'), { position: toast.POSITION.TOP_RIGHT });
            })
    }

    const handleClickAdd = () => {
        setIsAdd(true);
    }

    const form = useForm({
        mode: 'onSubmit',
        defaultValues: initialValue,
        criteriaMode: "firstError"
    })

    // const { defaultValue,on ...otherProps } = form.register(CONTENT_QUESTION);
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
            getAllQuestion();
            toast.success('Edit question successfuly !', { position: toast.POSITION.TOP_RIGHT });
            handleClose();
        }).catch((error) => {
            toast.error(t('Edit question fail !'), { position: toast.POSITION.TOP_RIGHT });
        })
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        importListQuestionIntoQuestionGroupService(formData, props.id).then((res) => {
            getAllActiveQuestionByQuestionGrID();
            setIsClickImport(false);
            setFile(null);
            toast.success(t('Import successfuly !'), { position: toast.POSITION.TOP_RIGHT });
        }).catch(e => {
            console.log(e)
            toast.error(t("Cannot import file !"), { position: toast.POSITION.TOP_RIGHT })
        })

    };

    const handleShowAllField = () => {
        setShowAllField(true);
        const newBody = {
            content: contentQuestion,
            answers: [],

            questionGroupId: props.id,
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


    const submitForm = (body) => {
        console.log('submitForm')
        handleClose();
        const newBody = {
            content: contentQuestion,
            answers: [],
            id: questionSelect.id,
            questionGroupId: body.questionGroupId,
            questionType: questionType
        }
        // listAnswer.map((item, index) => {
        //     newBody.answers.push({
        //         'answerContent': item,
        //         'isCorrect': false
        //     })
        // })


        if (isAdd) {

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
            // addQuestionByQuestionGroupService(newBody).then((res) => {
            //     getAllQuestion();
            //     toast.success(t('Add question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
            // }).catch((error) => {
            //     toast.error(t('Add question fail !'), { position: toast.POSITION.TOP_RIGHT });
            // })
            handleUploadImg().then(() => {
                updateQuestionService(newBody).then((res) => {
                    getAllQuestion();
                    toast.success(t('Add question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
                    handleClose();
                }).catch((error) => {
                    toast.error(t('Add question fail !'), { position: toast.POSITION.TOP_RIGHT });
                })
            }).catch(console.log)

        }

        if (isDelete)
            deleteQuestionService(body.id).then((res) => {
                getAllQuestion();
                toast.success(t('Delete question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
            }).catch((error) => {
                toast.error(t('Delete question fail !'), { position: toast.POSITION.TOP_RIGHT });
            })
        if (isChooseActive)
            activeQuestionService(body.id).then((res) => {
                getAllQuestion();
                toast.success(t('Active question successfuly !'), { position: toast.POSITION.TOP_RIGHT });
            }).catch((error) => {
                toast.error(t('Active question fail !'), { position: toast.POSITION.TOP_RIGHT });
            })
        if (isEdit) {
            handleUploadImg().then(()=> handleSubmitEdit()).catch(console.log);
            
        }
        setActiveIndex(0);

    }

    const handleClickPage = (index) => {
        setActiveIndex(index);
        getAllQuestion(index);
    };

    const handlePrevious = (index) => {

        setActiveIndex(index - 1);
        getAllQuestion(index - 1);
    }

    const handleNext = (index) => {

        setActiveIndex(index + 1);
        getAllQuestion(index + 1);
    }
    const handleOptionChange = (event) => {
        console.log(event.target.value);

        setSelectedOption(event.target.value);
        setChooseTrue(true);
    };

    const handleSearch = (data) => {
        if (props.idClassroom)
            if (isModeActive)
                getAllActiveQuestionByIdClassroomService(props.idClassroom, undefined, undefined, undefined, size, data).then((res) => {
                    setListAllQuestion(res.data.content);
                    setIsLast(res.data.last);
                    setIsFirst(res.data.first);

                    const pageNumbers2 = [];
                    for (let i = 1; i <= res.data.totalPages; i++) {
                        pageNumbers2.push(i);
                    }
                    setPageNumbers(pageNumbers2);
                    setTotalElements(res.data.totalElements);
                    setOffset(res.data.pageable.offset);
                    setNumberOfElements(res.data.numberOfElements);
                    setIsLoading(false);
                }).catch((error) => {
                    setIsLoading(false);
                    toast.error(t('Search question fail !'), {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    removeCredential();
                    navigate(Path.LOGIN);
                })
            else
                getAllInActiveQuestionByIdClassroomService(props.idClassroom, undefined, undefined, undefined, size, data).then((res) => {
                    setListAllQuestion(res.data.content);
                    setIsLast(res.data.last);
                    setIsFirst(res.data.first);

                    const pageNumbers2 = [];
                    for (let i = 1; i <= res.data.totalPages; i++) {
                        pageNumbers2.push(i);
                    }
                    setPageNumbers(pageNumbers2);
                    setTotalElements(res.data.totalElements);
                    setOffset(res.data.pageable.offset);
                    setNumberOfElements(res.data.numberOfElements);
                    setIsLoading(false);
                }).catch((error) => {
                    setIsLoading(false);
                    toast.error(t('Get question fail !'), {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    removeCredential();
                    navigate(Path.LOGIN);
                })
        else
            if (isModeActive)
                getAllActiveQuestionByQuestionGrIDService(props.id, undefined, undefined, undefined, size, data).then((res) => {
                    setListAllQuestion(res.data.content);
                    setIsLast(res.data.last);
                    setIsFirst(res.data.first);

                    const pageNumbers2 = [];
                    for (let i = 1; i <= res.data.totalPages; i++) {
                        pageNumbers2.push(i);
                    }
                    setPageNumbers(pageNumbers2);
                    setTotalElements(res.data.totalElements);
                    setOffset(res.data.pageable.offset);
                    setNumberOfElements(res.data.numberOfElements);
                    setIsLoading(false);
                }).catch((error) => {
                    setIsLoading(false);
                    toast.error(t('Search question fail !'), {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    removeCredential();
                    navigate(Path.LOGIN);
                });
            else
                getAllInActiveQuestionByQuestionGrIDService(props.id, undefined, undefined, undefined, size, data).then((res) => {
                    setListAllQuestion(res.data.content);
                    setIsLast(res.data.last);
                    setIsFirst(res.data.first);

                    const pageNumbers2 = [];
                    for (let i = 1; i <= res.data.totalPages; i++) {
                        pageNumbers2.push(i);
                    }
                    setPageNumbers(pageNumbers2);
                    setTotalElements(res.data.totalElements);
                    setOffset(res.data.pageable.offset);
                    setNumberOfElements(res.data.numberOfElements);
                    setIsLoading(false);
                }).catch((error) => {
                    setIsLoading(false);
                    toast.error(t('Search question fail !'), {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    removeCredential();
                    navigate(Path.LOGIN);
                });
    }

    const handleClickActive = (item) => {

        setIsChooseActive(true);
        setTimeout(() => {
            setQuestionSelect(item);
        });
    }

    const handleClickEdit = (item) => {
        setContentQuestion(item.content);
        setIsEdit(true);
        getQuestionByIdService(item.id).then((res) => {
            console.log("getQuestionByIdService ", res.data)
            setQuestionSelect(res.data)
            setQuestionType(res.data.questionType)
            setQuestionId(res.data.questionId)
            setImageUrl(res.data.imageUrl)
            
            setListAnswer(res.data.answers.map(answer=>{
                return answer.answerContent;
            }))
        }).catch(e => {
            toast.error(t('Get question {} fail !').replace('{}', `${item.id}`), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const getAllInActiveQuestionByQuestionGrID = async (page, sortType, column, size, search) => {
        getAllInActiveQuestionByQuestionGrIDService(props.id, page, sortType, column, size, search).then((res) => {
            setListAllQuestion(res.data.content);
            setIsLast(res.data.last);
            setIsFirst(res.data.first);
            const pageNumbers2 = [];
            for (let i = 1; i <= res.data.totalPages; i++) {
                pageNumbers2.push(i);
            }
            setPageNumbers(pageNumbers2);
            setTotalElements(res.data.totalElements);
            setOffset(res.data.pageable.offset);
            setNumberOfElements(res.data.numberOfElements);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllActiveQuestionByQuestionGrID = async (page, sortType, column, size = 6, search) => {
        getAllActiveQuestionByQuestionGrIDService(props.id, page, sortType, column, size, search).then((res) => {
            setListAllQuestion(res.data.content);
            setIsLast(res.data.last);
            setIsFirst(res.data.first);

            const pageNumbers2 = [];
            for (let i = 1; i <= res.data.totalPages; i++) {
                pageNumbers2.push(i);
            }
            setPageNumbers(pageNumbers2);
            setTotalElements(res.data.totalElements);
            setOffset(res.data.pageable.offset);
            setNumberOfElements(res.data.numberOfElements);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllActiveQuestionByIdClassroom = async (page, sortType, column, size, search) => {
        getAllActiveQuestionByIdClassroomService(props.idClassroom, page, sortType, column, size, search).then((res) => {
            setListAllQuestion(res.data.content);
            setIsLast(res.data.last);
            setIsFirst(res.data.first);

            const pageNumbers2 = [];
            for (let i = 1; i <= res.data.totalPages; i++) {
                pageNumbers2.push(i);
            }
            setPageNumbers(pageNumbers2);
            setTotalElements(res.data.totalElements);
            setOffset(res.data.pageable.offset);
            setNumberOfElements(res.data.numberOfElements);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllInActiveQuestionByIdClassroom = async (page, sortType, column, size, search) => {
        getAllInActiveQuestionByIdClassroomService(props.idClassroom, page, sortType, column, size, search).then((res) => {
            setListAllQuestion(res.data.content);
            setIsLast(res.data.last);
            setIsFirst(res.data.first);

            const pageNumbers2 = [];
            for (let i = 1; i <= res.data.totalPages; i++) {
                pageNumbers2.push(i);
            }
            setPageNumbers(pageNumbers2);
            setTotalElements(res.data.totalElements);
            setOffset(res.data.pageable.offset);
            setNumberOfElements(res.data.numberOfElements);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            toast.error(t('Get question fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllQuestion = (page, sortType, column, size, search) => {
        if (props.idQuestionSelect)
            setListCheckBox(props.idQuestionSelect);
        if (props.idClassroom)
            if (isModeActive)
                getAllActiveQuestionByIdClassroom(page, sortType, column, size = 6, search);
            else
                getAllInActiveQuestionByIdClassroom(page, sortType, column, size = 6, search);
        else
            if (isModeActive)
                getAllActiveQuestionByQuestionGrID(page, sortType, column, size = 6, search);
            else
                getAllInActiveQuestionByQuestionGrID(page, sortType, column, size = 6, search);
    }

    const isActive = (index) => {
        return index === activeIndex;
    };

    useEffect(() => {
        console.log("Mount")
        if (props.id || props.idClassroom)
            getAllQuestion();
        else
            navigate(Path.AMCLASSMANAGER);
    }, [isModeActive]);


    return (
        <>
            <div className=" pt-1 h-fit w-full flex-row flex justify-center items-center ">
                <div className="pt-4 dark:border-gray-700 w-full">
                    <div className="flex items-center justify-start h-auto mb-4 bg-gray-100">
                        <div className="w-full overflow-auto shadow-md sm:rounded-lg">
                            <div className='p-3 items-center flex gap-4 float-right mb-[14px]'>
                                {!props?.isAddManual &&
                                    <div className='w-[150px]'>
                                        <Toggle checked={isModeActive} handleToggle={setIsModeActivate} >{isModeActive ? t('Active') : t('Inactive')}</Toggle>
                                    </div>
                                }


                                <div className="relative float-right">
                                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 ">
                                        <Button handleOnClick={() => { handleSearch(searchData) }} >
                                            <svg className="w-5 h-5 text-white dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </Button>
                                    </div>
                                    <input onChange={(e) => { setSearchData(e.target.value) }} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t("Search for items")} />

                                </div>
                                {props.id &&
                                    <div className='flex gap-4  items-center justify-between'>

                                        <Button className="bg-blue-800" handleOnClick={() => { handleClickAdd() }}>{t('Add question')}</Button>
                                        <Button className="bg-green-500 w-auto " handleOnClick={() => { handleClickExport() }}>{t('Export list question')}</Button>
                                        {!isClickImport &&
                                            <>
                                                <Button className="bg-yellow-500 w-auto " handleOnClick={() => { setIsClickImport(true) }}>{t('Import list question')}</Button>

                                            </>}
                                        {
                                            isClickImport && <>
                                                <input type="file" id="file-upload" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                                                <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white h-10 w-full inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset cursor-pointer rounded-lg">
                                                    {t('Select file')}
                                                </label>
                                                {
                                                    file && <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white h-10 inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset rounded-lg">
                                                        {t('Upload')}
                                                    </button>
                                                }

                                            </>}



                                    </div>
                                }

                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4 w-4">
                                            <div className="flex items-center">
                                                <input onChange={() => handleCheckboxChange(undefined, undefined, isAllCheckBox)} id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-1 w-[70px]">
                                            {t('ID question')}
                                        </th>
                                        <th scope="col" className="px-6 py-1 w-[300px] " >
                                            {t('Question content')}
                                        </th>
                                        <th scope="col" className="px-6 py-1 w-[150px]">
                                            {t('Question type')}
                                        </th>

                                        {
                                            props.id && (<th scope="col" className="px-6 py-1 w-[70px]">
                                                {t('Action')}
                                            </th>)
                                        }


                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !isLoading &&
                                        (listAllQuestion.length !== 0 && (
                                            listAllQuestion.map(
                                                (item, index) => {

                                                    return (
                                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                            <td className="w-4 px-4 py-1 ">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        checked={isChecked(item.id)}
                                                                        onChange={(e) => handleCheckboxChange(e, item.id)}
                                                                        id={`checkbox-table-search-${index}`}
                                                                        type="checkbox"
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                    />
                                                                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                                                </div>
                                                            </td>
                                                            <th scope="row" className="w-[150px] px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                                                {item.id}
                                                            </th>
                                                            <td className="px-6 py-1 w-[300px] ">
                                                                <p onClick={() => { }} className="cursor-pointer font-medium dark:text-blue-500 hover:underline max-w-[300px] line-clamp-1" title={item.content} dangerouslySetInnerHTML={{ __html: item.content }}></p>
                                                            </td>
                                                            <td className="px-6 py-1 w-[150px] " >
                                                                <p className=" truncate font-medium  max-w-[150px] line-clamp-1" title={item.questionType}>{item.questionType}</p>
                                                            </td>

                                                            {
                                                                props.id && (<td className="px-6 py-1 w-[60px]">
                                                                    <Menu >
                                                                        <MenuHandler>
                                                                            <ButtonMenu className='bg-slate-400'>
                                                                                <FontAwesomeIcon icon={faBars} />
                                                                            </ButtonMenu>
                                                                        </MenuHandler>

                                                                        {
                                                                            isModeActive ? (<MenuList className='rounded-md z-[105]'> <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickEdit(item) }}>{t('Edit')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickDelete(item) }} >{t('Delete')}</MenuItem></MenuList>)
                                                                                : (<MenuList className='rounded-md z-[105]'><MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickActive(item) }} >{t('Active')}</MenuItem></MenuList>)
                                                                        }



                                                                    </Menu>

                                                                </td>)
                                                            }

                                                        </tr>
                                                    )
                                                }
                                            )))
                                    }
                                </tbody>
                            </table>
                            <PaginationNav
                                pageNumbers={pageNumbers}
                                handlePrevious={handlePrevious}
                                handleNext={handleNext}
                                activeIndex={activeIndex}
                                handleClickPage={handleClickPage}
                                offset={offset}
                                numberOfElements={numberOfElements}
                                totalElements={totalElements}
                                isFirst={isFirst}
                                isLast={isLast}
                                isActive={isActive} />
                        </div>
                    </div>
                    {
                        isLoading ? (<>
                            <h1 className='text-sm pl-1'>{t('Loading...')}</h1>
                        </>) : (listAllQuestion.length === 0 && (<>
                            <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                <div className="text-center">
                                    <h1
                                        className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                    >
                                        Uh-oh!
                                    </h1>
                                    <p className="mt-4 text-gray-500">{t('We cannot find any question.')}</p>
                                </div>
                            </div>
                        </>))
                    }
                </div>
                {isEdit && (
                    <>
                        <Modal className="bg-opacity-60 z-[105] m-auto" show={true} theme={{ 'content': { 'base': 'w-1/2 m-10' } }} popup onClose={() => handleClose()} >

                            <Modal.Body>
                                {
                                    questionSelect && (


                                        <>
                                            <p className="text-center text-lg font-medium">{t('Edit question')}</p>
                                            <QuestionContentInput onChange={handleInputContent} defaultContent={questionSelect.content} />
                                            {/* <label htmlFor={CONTENT_QUESTION} className="block pb-1 text-sm font-medium text-gray-700">{t('Question content')}</label>
                                                <textarea className='border-2 resize-none outline-none border-gray-500/75 w-full rounded-lg p-4 pe-12 text-sm ' defaultValue={questionSelect.content} onChange={(event) => { handleInputContent(event) }} ></textarea> */}

                                            {/* <InputField name={CONTENT_QUESTION} label="Question" form={form} defaultValue={questionSelect.content} /> */}

                                            {

                                                // questionSelect?.answers?.map(
                                                //     (item, index) => {
                                                //         return (
                                                //             <>
                                                //                 <label htmlFor={item} className="block pb-1 text-sm font-medium text-gray-700">{t("Answer ") + index}</label>
                                                //                 <div className="relative flex justify-center">
                                                //                     <input

                                                //                         defaultValue={item.answerContent}
                                                //                         type={'text'}
                                                //                         name={item}
                                                //                         className={clsx("text-opacity-50", "border-2", "border-gray-500/75", "w-full", "rounded-lg", "p-4", "pe-12", "text-sm", "shadow-sm")}
                                                //                         placeholder={t('Enter answer ') + index}
                                                //                         onChange={(e) => handleChangeAnswer(e, item.idAnswerQuestion)}
                                                //                     />
                                                //                     <input
                                                //                         className=' absolute mt-0 mb-0 mr-1 top-[25%] right-0  w-6 h-1/2'
                                                //                         type="radio"

                                                //                         value={item.idAnswerQuestion}
                                                //                         checked={selectedOption == item.idAnswerQuestion}
                                                //                         onChange={(event) => handleOptionChange(event)}
                                                //                     />
                                                //                 </div>
                                                //             </>

                                                //         )
                                                //     })
                                                questionSelect && (
                                                    <>
                                                        <div className='flex flex-col'>
                                                            <div className='my-6 max-w-[40rem]'>
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
                                                            </div>

                                                            {/* <Button disable={!img} handleOnClick={() => handleUploadImg()} className="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white max-w-[40rem]" rounded >{t('Save')}</Button> */}
                                                        </div>
                                                        <form onSubmit={form.handleSubmit(submitForm)} className="relative mb-0 space-y-4 rounded-lg pt-4 px-4 ">
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

                                                            {/* {questionType === 'Essay' && (
                                                        <EssayQuestion handleInputContent={handleInputContent} />
                                                    )} */}
                                                        </form>
                                                        <div className='flex justify-center'>
                                                            <Modal.Header />
                                                        </div>
                                                    </>
                                                )

                                            }

                                        </>
                                    )
                                }
                            </Modal.Body>
                        </Modal></>)
                }
                {isAdd && (
                    <>
                        <Modal className="bg-opacity-60 z-[105]" show={true} theme={{ 'content': { 'base': 'w-1/2' } }} popup onClose={() => handleClose()} >
                            <Modal.Body>

                                {showOptions && (
                                    // <div className='h-auto flex flex-col relative mb-0 space-y-4 rounded-lg pt-4 px-4 '>
                                    //     <p className="text-center text-lg font-medium">Chọn loại câu hỏi</p>
                                    //     <label className='flex items-center '>
                                    //         <input
                                    //             className='mx-2'
                                    //             type="radio"
                                    //             value="Multiple Choice"
                                    //             checked={questionType === 'Multiple Choice'}
                                    //             onChange={handleQuestionTypeChange}
                                    //         />
                                    //         <FontAwesomeIcon className='mx-1' icon={faQuestionCircle} />
                                    //         <span>Multiple Choice</span>
                                    //     </label>
                                    //     <label className='flex items-center '>
                                    //         <input
                                    //             className='mx-2'
                                    //             type="radio"
                                    //             value="Fill in the blank"
                                    //             checked={questionType === 'Fill in the blank'}
                                    //             onChange={handleQuestionTypeChange}
                                    //         />
                                    //         <FontAwesomeIcon className='mx-1' icon={faEdit} />
                                    //         <span>Fill in the blank</span>
                                    //     </label>
                                    //     <button onClick={handleConfirmSelection} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    //         Submit
                                    //     </button>
                                    //     <div className='flex justify-center'>
                                    //         <Modal.Header />
                                    //     </div>
                                    // </div>
                                    <div className='flex flex-col relative mb-0 space-y-4 rounded-lg pt-4 px-4 '>
                                        <p className="text-center text-lg font-medium">{t('Choose question type')}</p>
                                        <button className='flex items-center bg-gray-200 hover:bg-gray-300 p-2 rounded' onClick={() => handleQuestionTypeChange('Multiple Choice')}>
                                            <FontAwesomeIcon className='mx-1' icon={faQuestionCircle} />
                                            <span>{t('Muitiple choice')}</span>
                                        </button>
                                        <button className='flex items-center bg-gray-200 hover:bg-gray-300 p-2 rounded' onClick={() => handleQuestionTypeChange('Fill in the blank')}>
                                            <FontAwesomeIcon className='mx-1' icon={faEdit} />
                                            <span>{t('Fill in the blank')}</span>
                                        </button>
                                        <button className='flex items-center bg-gray-200 hover:bg-gray-300 p-2 rounded' onClick={() => handleQuestionTypeChange('True/False')}>
                                            <FontAwesomeIcon className='mx-1' icon={faCheckCircle} />
                                            <span>{t('True/False')}</span>
                                        </button>
                                        <div className='flex justify-center'>
                                            <Modal.Header />
                                        </div>
                                    </div>
                                )}
                                {!showOptions &&
                                    <>
                                        <p className="text-center text-lg font-medium m-2">{t('Add question')}</p>
                                        <InputField name={QUESTION_GROUP_ID} disabled form={form} defaultValue={props.id} />
                                        <QuestionContentInput onChange={handleInputContent} />
                                        {showAllField ? (
                                            <>
                                                <div className='flex flex-col'>
                                                    <div className='my-6 max-w-[40rem]'>
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
                                        <div className='flex justify-center'>
                                            <Modal.Header />
                                        </div>
                                    </>
                                }
                            </Modal.Body>
                        </Modal></>)
                }
                {isDelete && (
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
                {isChooseActive && (
                    <>
                        <Modal className="bg-opacity-60 z-[105] " show={true} size="md" popup onClose={() => handleClose()} >
                            <Modal.Header />
                            <Modal.Body>
                                <form onSubmit={form.handleSubmit(submitForm)}
                                    className="relative mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                                >
                                    <InputField name={ID_QUESTION} disabled form={form} defaultValue={questionSelect.id} />
                                    <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Confirm')} </p>
                                    <h1 className='text-[16px] text-center'>{t('Are you sure you want to active ?')}</h1>
                                    <div className='invisible py-3'></div>
                                    <div className='flex gap-3'>
                                        <Button className="bg-red-500" type='submit'>{t('Confirm')}</Button>
                                        <Button handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</Button>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal></>)
                }

            </div >
        </ >

    )
}
