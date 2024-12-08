import React, { useEffect, useState } from 'react'
import ButtonE from '../../../components/form-controls/Button/Button'
import InputField from '../../../components/form-controls/InputField/InputField'
import { Modal } from 'flowbite-react'
import { addExamByIdClassroomService, convertDateToMiliseconds, deleteExamService, getAllExamOfClassService, getFormattedDateTimeByMilisecond, removeCredential, setFormatDateYYYYMMDD, updateExamService } from '../../../services/ApiService'
import Path from '../../../utils/Path'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Toggle from '../../../components/form-controls/Toggle/Toggle'
import PaginationNav from '../../../components/pagination/PaginationNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button
} from "@material-tailwind/react";
import { DatePicker } from '../../../components/form-controls/Datepicker/DatePicker'
import { QuestionGroup } from './Questiongroupmanager'
import { Questionmanager } from './Questionmanager'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useTranslation } from 'react-i18next'
const ID_EXAM = 'id';
const EXAM_NAME = 'testName';
const START_DATE = 'startDate';
const END_DATE = 'endDate';
const EXAM_TEST_TIME = 'testingTime';
const ID_SUBJECT = 'subjectId';
const DESCRIPTION = 'description';
const TARGET_SCORE = 'targetScore';

export const Examinationmanager = () => {
    const { t } = useTranslation();
    document.title = t('Examination management');
    const { idClassRoom } = useParams();
    const navigate = useNavigate();
    const [chooseQuestionByQuestionGr, setChooseQuestionByQr] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [listAllExam, setListAllExam] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFirst, setIsFirst] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [offset, setOffset] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [examSelect, setExamSelect] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);
    const [checkExamStart, setCheckExamStart] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [isShowRamdomQuestion, setIsShowRandomQuestion] = useState(false);
    const [isShowManualQuestion, setIsShowManualQuestion] = useState(false);
    const [questionsSelect, setQuestionsSelect] = useState([]);

    const initialValue = {
        [ID_EXAM]: '',
        [START_DATE]: '',
        [EXAM_NAME]: '',
        [END_DATE]: '',
        [EXAM_TEST_TIME]: '',
        [DESCRIPTION]: '',
        [TARGET_SCORE]: ''
    };
    const yupObject = yup.object().shape({
        [START_DATE]: yup
            .string()
            .required(t("The start date of exam is required.")),
        [END_DATE]: yup
            .string()
            .required(t("The end date of exam is required.")),
        [EXAM_NAME]: yup
            .string()
            .required(t("The name of exam is required.")),
        [EXAM_TEST_TIME]: yup
            .string()
            .required(t("The testing time of exam is required.")),
        [DESCRIPTION]: yup
            .string()
            .required(t("The description of exam is required.")),
        [TARGET_SCORE]: yup
            .string()
            .required(t("The target score of exam is required."))
    });
    const handleClickDelete = (item) => {
        setIsDelete(true);
        setExamSelect(item);
    }

    const handleClose = () => {
        if (isEdit)
            setIsEdit(false);
        if (isAdd)
            setIsAdd(false);
        if (isDelete)
            setIsDelete(false);
        setQuestionsSelect([]);
        setChooseQuestionByQr([]);
    }

    const handleShowStudentScore = (item) => {
        console.log(`/admin/score/${item.id}`)
        navigate(`/admin/score/${item.id}`);
    }

    const handleCloseShowChooseRandomQuestion = () => {
        setIsShowRandomQuestion(false);
        setQuestionsSelect([]);
    }

    const handleCloseShowChooseManualQuestion = () => {
        setIsShowManualQuestion(false);
        setChooseQuestionByQr([]);
    }

    const handleOpenManualQuestion = () => {
        setIsShowManualQuestion(true);
    }

    const handleClickAdd = () => {
        setIsAdd(true);
    }

    const form = useForm({
        mode: 'onSubmit',
        defaultValues: initialValue,
        criteriaMode: "firstError",
        resolver: yupResolver(yupObject)
    })

    const submitForm = (body) => {
        handleClose();
        body.startDate = convertDateToMiliseconds(body.startDate);
        body.endDate = convertDateToMiliseconds(body.endDate);
        if (convertDateToMiliseconds(body.startDate) - convertDateToMiliseconds(body.endDate) >= 0) {
            toast.error(t("Please choose end date must be after start date"), toast.POSITION.TOP_RIGHT);
        } else if (body.targetScore < 0 || body.targetScore > 10) {
            toast.error(t("The target score must be from 0 to 10"), toast.POSITION.TOP_RIGHT);
        } else if (isEdit) {
            let { subjectId, ...newBody } = body;
            updateExam(newBody);
        } else if (isAdd) {
            let { id, ...newBody } = body;
            if (questionsSelect.length != 0)
                newBody = { ...newBody, questionIds: questionsSelect };
            else
                newBody = { ...newBody, randomQuestions: chooseQuestionByQuestionGr };
            addExamByIdClassroom(newBody);
        }
        if (isDelete)
            deleteExam(body.id);

        setActiveIndex(0);

    }

    const handleOpenRandomQuestion = () => {
        setIsShowRandomQuestion(true);
    }

    const handleClickPage = (index) => {
        setActiveIndex(index);
        getAllExam(index);
    };

    const handlePrevious = (index) => {

        setActiveIndex(index - 1);
        getAllExam(index - 1);
    }

    const handleNext = (index) => {

        setActiveIndex(index + 1);
        getAllExam(index + 1);
    }

    const checkTimeStart = (list) => {
        list.map((item, index) => {
            let time = item.startDate;
            let timeReal = convertDateToMiliseconds(new Date());
            if (time - timeReal < 0) {
                setCheckExamStart((preValue) => [...preValue, item.id]);
            }
            return 0;
        })

    }

    const handleSearch = (data) => {
        getAllExamOfClassService(idClassRoom, isEnded, undefined, undefined, undefined, undefined, data).then((res) => {
            checkTimeStart(res.data.content);
            setListAllExam(res.data.content);
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
            toast.error(t('Get exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });

    }

    const handleClickEdit = (item) => {
        form.clearErrors();
        setIsEdit(true);
        setTimeout(() => {
            setExamSelect(item);
        });
    }

    const updateExam = (body) => {
        updateExamService(body).then((res) => {
            getAllExam();
        }).catch((error) => {
            toast.error(t('Update exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
    }

    const deleteExam = (id) => {
        deleteExamService(id).then((res) => {
            getAllExam();
        }).catch((error) => {
            toast.error(t('Delete exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
    }

    const addExamByIdClassroom = (body) => {
        addExamByIdClassroomService(body).then((res) => {
            getAllExam();
            toast.success(t('Add exam successful !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch((error) => {
            toast.error(t('Add exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
    }

    const getAllExamOfClassroom = async (page, sortType, column, size, search) => {
        getAllExamOfClassService(idClassRoom, isEnded, page, sortType, column, size, search).then((res) => {
            setListAllExam(res.data.content);
            setIsLast(res.data.last);
            setIsFirst(res.data.first);
            checkTimeStart(res.data.content);
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
            toast.error(t('Get exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllExam = (page, sortType, column, size, search) => {
        getAllExamOfClassroom(page, sortType, column, size, search);
    }

    const isActive = (index) => {
        return index === activeIndex;
    };

    useEffect(() => {

        setCheckExamStart([]);
        if (idClassRoom)
            getAllExam();
        else {
            navigate(Path.AMCLASSMANAGER);
        }
    }, [isEnded]);

    return (
        <>
            <div className=" p-4 h-full w-full flex-row flex justify-center">
                <div className="p-4 dark:border-gray-700">
                    <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
                        {t('Examination management')}
                    </div>
                    <div className="flex items-center justify-start h-auto mb-4 bg-gray-100">
                        <div className=" overflow-auto shadow-md sm:rounded-lg">
                            <div className='p-3 items-center flex gap-4 justify-between mb-[14px]'>
                                <div onClick={() => navigate(-1)}
                                    className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                                    <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
                                </div>
                                <div className='w-[150px]'>
                                    <Toggle checked={isEnded} handleToggle={setIsEnded} >{isEnded ? t('Finished') : t('On Going')}</Toggle>
                                </div>
                                <div className="relative float-right">
                                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 ">
                                        <ButtonE handleOnClick={() => { handleSearch(searchData) }} >
                                            <svg className="w-5 h-5 text-white dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </ButtonE>
                                    </div>
                                    <input onChange={(e) => { setSearchData(e.target.value) }} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t("Search for items")} />

                                </div>
                                <div className='flex gap-4  items-center justify-between'>
                                    <ButtonE className="bg-blue-800" handleOnClick={() => { handleClickAdd() }}>{t('Add exam')}</ButtonE>

                                </div>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>

                                        <th scope="col" className="px-6 py-3">
                                            {t('ID exam')}
                                        </th>
                                        <th scope="col" className="px-6 py-3  w-[300px]" >
                                            {t('Exam name')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('Start date')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('End date')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('Exam time')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('Target score')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[60px]" >
                                            {t('Action')}
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !isLoading &&
                                        (listAllExam.length !== 0 && (
                                            listAllExam.map(
                                                (item, index) => {

                                                    return (
                                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                                            <th scope="row" className="w-[62px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                                                {item.id}
                                                            </th>
                                                            <td className="px-6 py-4 w-[300px] ">
                                                                <p onClick={() => { }} className="cursor-pointer font-medium dark:text-blue-500 hover:underline max-w-[200px] line-clamp-1" title={item.testName}>{item.testName}</p>
                                                            </td>
                                                            <td className="px-6 py-4 w-[150px] " >
                                                                <p className=" truncate font-medium  max-w-[150px] line-clamp-1" title={getFormattedDateTimeByMilisecond(item.startDate)}>{getFormattedDateTimeByMilisecond(item.startDate)}</p>
                                                            </td>
                                                            <td className="px-6 py-4 w-[150px] " >
                                                                <p className=" truncate font-medium  max-w-[150px] line-clamp-1" title={getFormattedDateTimeByMilisecond(item.endDate)}>{getFormattedDateTimeByMilisecond(item.endDate)}</p>
                                                            </td>

                                                            <td className="px-6 py-4 w-[150px] " >
                                                                <p className="flex justify-center truncate font-medium  max-w-[150px] line-clamp-1" title={item.testingTime}>{item.testingTime}</p>
                                                            </td>
                                                            <td className="px-6 py-4 w-[150px] " >
                                                                <p className="flex justify-center truncate font-medium  max-w-[150px] line-clamp-1" title={item.targetScore}>{item.targetScore}</p>
                                                            </td>
                                                            <td className="px-6 py-4 w-[60px]">
                                                                <Menu >
                                                                    <MenuHandler>
                                                                        <Button className='bg-slate-400'>
                                                                            <FontAwesomeIcon icon={faBars} />
                                                                        </Button>
                                                                    </MenuHandler>
                                                                    <MenuList className='rounded-md'>
                                                                        {
                                                                            checkExamStart.indexOf(item.id) > -1 ?
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleShowStudentScore(item) }}>{t('Show student score has joined exam')}</MenuItem> : (<>
                                                                                    <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickEdit(item) }}>{t('Edit')}</MenuItem>
                                                                                    <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickDelete(item) }} >{t('Delete')}</MenuItem>
                                                                                </>)
                                                                        }
                                                                    </MenuList>
                                                                </Menu>

                                                            </td>
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
                        </>) : (listAllExam.length === 0 && (
                            <>
                                <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                    <div className="text-center">
                                        <h1
                                            className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                        >
                                            Uh-oh!
                                        </h1>
                                        <p className="mt-4 text-gray-500">{t('We cannot find any exam.')}</p>
                                    </div>
                                </div>
                            </>))

                    }
                </div>
                {isEdit && (
                    <>
                        <Modal className="bg-opacity-60 z-[101]" show={true} theme={{ 'content': { 'base': 'w-1/2 m-10' } }} popup onClose={() => handleClose()} >
                            <Modal.Body>
                                <form onSubmit={form.handleSubmit(submitForm)}
                                    className="relative mb-0 space-y-4 rounded-lg pt-4 px-4 "
                                >
                                    <p className="text-center text-lg font-medium">{t('Edit exam')}</p>
                                    <InputField name={EXAM_NAME} label={t("Exam name")} form={form} defaultValue={examSelect.testName} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={examSelect.description || ""} />
                                    <InputField name={ID_EXAM} disabled form={form} defaultValue={examSelect.id} />
                                    <InputField type='number' name={EXAM_TEST_TIME} label={t("Exam time")} form={form} defaultValue={examSelect.testingTime} />
                                    <InputField type='number' name={TARGET_SCORE} label={t("Target score")} form={form} defaultValue={examSelect.targetScore} />
                                    <div className='flex'>
                                        <DatePicker name={START_DATE} label={t("Start date")} form={form} defaultValue={setFormatDateYYYYMMDD(examSelect.startDate)} />
                                        <DatePicker name={END_DATE} label={t("End date")} form={form} defaultValue={setFormatDateYYYYMMDD(examSelect.endDate)} />
                                    </div>
                                    <div className='flex justify-around'>
                                        <ButtonE onClick={() => handleClose()} className="bg-blue-800 w-[100px]" type='submit'>{t('Submit')}</ButtonE>
                                    </div>
                                    <div className='flex justify-center m-0'>
                                        <Modal.Header />
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal></>)
                }
                {isAdd && (
                    <>
                        <Modal className="bg-opacity-60 z-[101]" show={true} theme={{ 'content': { 'base': 'w-1/2 m-10' } }} popup onClose={() => handleClose()} >

                            <Modal.Body>
                                <form onSubmit={form.handleSubmit(submitForm)}
                                    className="relative mb-0 space-y-4 rounded-lg px-4 pt-4 "
                                >
                                    <div className='flex items-center justify-center'>
                                        <p className="text-center text-lg font-medium">{t('Add exam')}</p>

                                    </div>
                                    <InputField name={EXAM_NAME} label={t("Exam name")} form={form} defaultValue={''} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={''} />
                                    <InputField name={ID_SUBJECT} disabled form={form} defaultValue={idClassRoom} />
                                    <InputField type='number' name={EXAM_TEST_TIME} label={t("Time test (minutes)")} form={form} defaultValue={''} />
                                    <InputField type='number' name={TARGET_SCORE} label={t("Target score (x/10)")} form={form} defaultValue={''} />
                                    <div className='flex'>
                                        <DatePicker name={START_DATE} label={t("Start date")} form={form} defaultValue={''} />
                                        <DatePicker name={END_DATE} label={t("End date")} form={form} defaultValue={''} />
                                        <div className=' w-[150px]'>
                                            <Menu placement='bottom-start' >
                                                <MenuHandler>
                                                    <Button className='bg-black mt-[20px] hover:bg-gray-500'>
                                                        {t('Add question')}
                                                    </Button>
                                                </MenuHandler >
                                                <MenuList className='rounded-md z-[102]'>
                                                    <MenuItem className='z-[102]rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleOpenRandomQuestion() }}>{t('Add random by question group')}</MenuItem>
                                                    <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleOpenManualQuestion() }}>{t('Add manual')}</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                    </div>

                                    <div className='flex justify-around'>
                                        <ButtonE onClick={() => handleClose()} className="bg-blue-800 !w-[80px]" type='submit'>{t('Submit')}</ButtonE>
                                    </div>

                                </form>
                                <div className='flex justify-center m-0'>
                                    <Modal.Header />
                                </div>
                            </Modal.Body>
                        </Modal></>)
                }
                {isDelete && (
                    <>
                        <Modal className="bg-opacity-60 z-[101] " show={true} size="md" popup onClose={() => handleClose()} >
                            <Modal.Header />
                            <Modal.Body>
                                <form onSubmit={form.handleSubmit(submitForm)}
                                    className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                                >
                                    <InputField name={ID_EXAM} disabled form={form} defaultValue={examSelect.id} />
                                    <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Warning')} </p>
                                    <h1 className='text-[16px] text-center'>{t('Are you sure you want to delete ?')}</h1>
                                    <div className='invisible py-3'></div>
                                    <div className='flex gap-3'>
                                        <ButtonE className="bg-red-500" type='submit'>{t('Delete')}</ButtonE>
                                        <ButtonE handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</ButtonE>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal></>)
                }
                {isShowRamdomQuestion && (
                    <>
                        <Modal className=" bg-opacity-60 z-[103] h-full-[500px]" show={true} theme={{ 'content': { 'base': 'w-[1000px]' } }} popup onClose={() => handleCloseShowChooseRandomQuestion()} >
                            <Modal.Header />
                            <Modal.Body className='flex justify-center flex-col'>
                                <div className='flex justify-center'>
                                    <QuestionGroup id={idClassRoom} chooseQuestionGroup={setChooseQuestionByQr} listQuestionGrChoose={chooseQuestionByQuestionGr} />
                                </div>

                                <div className="flex justify-around pb-4 ">
                                    <Button
                                        onClick={() => handleCloseShowChooseRandomQuestion()} className="bg-blue-400">{t('Submit')}</Button>
                                    <Modal.Header className='hover:cursor-pointer  border-[2px] rounded-lg' />
                                </div>
                            </Modal.Body>


                        </Modal></>)
                }
                {isShowManualQuestion && (
                    <>
                        <Modal className="bg-opacity-60 z-[103]" show={true} theme={{ 'content': { 'base': 'w-[1200px] ' } }} popup onClose={() => handleCloseShowChooseManualQuestion()} >
                            <Modal.Header >
                                <h1>{t('Choose question')}</h1>
                                <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />
                            </Modal.Header>
                            <Modal.Body>
                                <div className='flex justify-center'>
                                    <Questionmanager isAddManual={true} idClassroom={idClassRoom} setQuestionsSelect={setQuestionsSelect} idQuestionSelect={questionsSelect} />

                                </div>
                                <div className="flex justify-center p-4">
                                    <Button onClick={() => { handleCloseShowChooseManualQuestion() }} className="bg-blue-400">{t('Submit')}</Button>
                                </div>

                            </Modal.Body>
                        </Modal></>)
                }

            </div >
        </ >

    )
}
