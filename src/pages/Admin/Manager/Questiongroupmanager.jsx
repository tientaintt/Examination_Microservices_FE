import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { useForm } from 'react-hook-form';
import InputField from '../../../components/form-controls/InputField/InputField';
import Button from '../../../components/form-controls/Button/Button';
import { Modal } from 'flowbite-react';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import { activeQuestionGroupService, addQuestionGroupService, deleteQuestionGroupService, getAllActivateQuestionGroupService, getAllUnActiveQuestionGroupService, removeCredential, updateQuestionGroupService } from '../../../services/ApiService';
import PaginationNav from '../../../components/pagination/PaginationNav';
import Path from '../../../utils/Path';
import { Questionmanager } from './Questionmanager';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
const QUESTIONGROUP_CODE = 'code';
const QUESTIONGROUP_NAME = 'name';
const DESCRIPTION = 'description';
const IS_ENABLE = 'isEnable';
const ID_QUESTIONGROUP = 'id';
const ID_CLASSROOM = 'subjectId';

export const QuestionGroup = (props) => {
    const {t}= useTranslation();
    document.title = t('Question group management');
    let { id } = useParams();
    const [isShowQuestion, setIsShowQuestion] = useState(false);
    const [isModeActive, setIsModeActivate] = useState(true);
    const [isAdd, setIsAdd] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [listQuestionGroup, setlistQuestionGroup] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFirst, setIsFirst] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [offset, setOffset] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [questionGroupSelect, setQuestionGroupSelect] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);
    const [isChooseActionActive, setIsChooseActionActive] = useState(false);
    const [valueNumberOfQuestion, setValueNumberOfQuestion] = useState({});

    const navigate = useNavigate();

    const initialValue = {
        [QUESTIONGROUP_CODE]: '',
        [QUESTIONGROUP_NAME]: '',
        [DESCRIPTION]: '',
        [IS_ENABLE]: '',
        [ID_QUESTIONGROUP]: '',
        [ID_CLASSROOM]: ''
    };
    const yupObject = yup.object().shape({
        [QUESTIONGROUP_CODE]: yup
            .string()
            .required(t("The code of question group is required.")),
        [QUESTIONGROUP_NAME]: yup
            .string()
            .required(t("The name of question group is required.")),
        [DESCRIPTION]: yup
            .string()
            .required(t("The description of question group is required.")),
    });
    const handleClickDelete = (item) => {
        setIsDelete(true);
        setQuestionGroupSelect(item);
    }

    const handleEnterNumberQuestion = (event, item) => {
        let value = event.target.value;
        if (value !== '') {
            if (item.totalQuestion < Number(value)) {
                // toast.error(`Number question of question group is ${item.totalQuestion}.Please enter again.`, toast.POSITION.TOP_RIGHT);
                event.target.value = '';

            }
            else {
                props.chooseQuestionGroup((preValue) => {
                    const existingQuestionGroup = preValue.find((group) => group.questionGroupId === Number(item.id));
                    if (existingQuestionGroup) {
                        return preValue.map((group) => {
                            if (group.questionGroupId === Number(item.id)) {
                                return {
                                    ...group,
                                    numberOfQuestion: value
                                };
                            }
                            return group;
                        });
                    } else {
                        return [
                            ...preValue,
                            {
                                questionGroupId: Number(item.id),
                                numberOfQuestion: value
                            }
                        ];
                    }
                })
            }

        } else {
            props.chooseQuestionGroup((preValue) => preValue.filter((valueS) => valueS.questionGroupId != Number(item.id)))
        }
    }

    const handleClose = () => {
        setIsEdit(false);
        setIsAdd(false);
        setIsDelete(false);
        setIsShowQuestion(false);
        setIsChooseActionActive(false);
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

    const handleShowQuestion = (item) => {
        setIsShowQuestion(true);
        setQuestionGroupSelect(item);
    }

    const submitForm = (body) => {
        if (isEdit)
            updateQuestionGroupService(body).then((res) => {

                getAllQuestionGroup();
            }).catch((error) => {
                toast.error(t('Update question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

        if (isAdd)
            addQuestionGroupService(body).then((res) => {

                getAllQuestionGroup();
            }
            ).catch((error) => {
                toast.error(t('Add question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        // if (isDelete)
        //     deleteQuestionGroupService(body).then((res) => {

        //         getAllQuestionGroup();
        //     }).catch((error) => {
        //         toast.error(`Delete question group fail !`, {
        //             position: toast.POSITION.TOP_RIGHT,
        //         });
        //     })
        // if (isChooseActionActive)
        //     activeQuestionGroupService(body.id).then((res) => {

        //         getAllQuestionGroup();
        //     }).catch((error) => {
        //         toast.error(`Active question group fail !`, {
        //             position: toast.POSITION.TOP_RIGHT,
        //         });
        //     })
        handleClose();
        setActiveIndex(0);
    }

    const handleShowDefaultValue = (id) => {
        const foundItem = valueNumberOfQuestion.find((item) => item.questionGroupId == Number(id));
        if (foundItem) {
            return foundItem.numberOfQuestion;
        }
        return null;
    }
    const handleDeleteQuestionGr = (questionGrId) => {
        if (isDelete) {
            handleClose();
            deleteQuestionGroupService(questionGrId).then((res) => {
                getAllQuestionGroup();
                toast.success(t('Delete question group successfuly !'), { position: toast.POSITION.TOP_RIGHT });
            }).catch((error) => {
                toast.error(t('Delete question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        }

    }
    const handleActiveQuestionGr = (questionGrId) => {
        if (isChooseActionActive) {
            handleClose();
            activeQuestionGroupService(questionGrId).then((res) => {
                toast.success('Active question group successfuly !', { position: toast.POSITION.TOP_RIGHT });
                getAllQuestionGroup();
            }).catch((error) => {
                toast.error(t('Active question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        }
    }

    const handleClickPage = (index) => {
        setActiveIndex(index);
        getAllQuestionGroup(index);
    };

    const handlePrevious = (index) => {
        setActiveIndex(index - 1);
        getAllQuestionGroup(index - 1);
    }

    const handleNext = (index) => {
        setActiveIndex(index + 1);
        getAllQuestionGroup(index + 1);
    }

    const handleSearch = (data) => {

        if (isModeActive)
            getAllActivateQuestionGroupService(id, undefined, undefined, undefined, undefined, data).then((res) => {

                setlistQuestionGroup(res.data.content);
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
            }
            ).catch((error) => {
                setIsLoading(false);
                toast.error('Search question group fail !', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            );
        else
            getAllUnActiveQuestionGroupService(id, undefined, undefined, undefined, undefined, data).then((res) => {
                setlistQuestionGroup(res.data.content);
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
            }
            ).catch((error) => {
                setIsLoading(false);
                toast.error('Search question group fail !', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                removeCredential();
                navigate(Path.LOGIN);
            });
    }

    const handleClickActive = (item) => {
        setIsChooseActionActive(true);
        setTimeout(() => {
            setQuestionGroupSelect(item);
        });
    }

    const handleClickEdit = (item) => {
        form.clearErrors();
        setIsEdit(true);
        setTimeout(() => {
            setQuestionGroupSelect(item);
        });
    }

    const getAllActiveQuestionGroup = (page, sortType, column, size, search) => {

        getAllActivateQuestionGroupService(id, page, sortType, column, size, search).then((res) => {
            setlistQuestionGroup(res.data.content);
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
        }
        ).catch((error) => {
            setIsLoading(false);
            toast.error(t('Get question group fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        }
        );
    }

    const getAllUnActiveQuestionGroup = (page, sortType, column, size, search) => {
        getAllUnActiveQuestionGroupService(id, page, sortType, column, size, search).then((res) => {
            setlistQuestionGroup(res.data.content);
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
        }
        ).catch((error) => {
            removeCredential();
            navigate(Path.LOGIN);
            setIsLoading(false);
            toast.error(t('Get question group fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        );
    }

    const getAllQuestionGroup = (page, sortType, column, size, search) => {
        if (!id) {
            id = props.id;
            size = 6;
            setValueNumberOfQuestion(props.listQuestionGrChoose)
        }
        if (isModeActive)
            getAllActiveQuestionGroup(page, sortType, column, size, search);
        else
            getAllUnActiveQuestionGroup(page, sortType, column, size, search);
    }

    const isActive = (index) => {
        return index === activeIndex;
    };

    useEffect(() => {
        if (id === ':id')
            navigate(Path.AMCLASSMANAGER);
        else
            getAllQuestionGroup();
    }, [isModeActive]);


    return (
        <div>
            <div className=" pt-4 h-full w-full flex-row flex justify-center">
                <div className="pt-4 dark:border-gray-700">
                    {!id ? <></> : <>
                        <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
                            {t('Question group management')}
                        </div>
                    </>}

                    <div className="flex items-center justify-start h-auto mb-4 bg-gray-100">
                        <div className=" overflow-auto shadow-md sm:rounded-lg">
                            <div className='p-3 items-center flex gap-4 justify-between'>
                                <div onClick={() => navigate(-1)}
                                    className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                                    <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
                                </div>
                                <div className='w-[200px]'>
                                    <Toggle checked={isModeActive} handleToggle={setIsModeActivate} >{isModeActive ? t('Active') : t('Inactive')}</Toggle>

                                </div>
                                <div className="relative float-right">
                                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 ">
                                        <Button handleOnClick={() => { handleSearch(searchData) }} >
                                            <svg className="w-5 h-5 text-white " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </Button>
                                    </div>
                                    <input onChange={(e) => { setSearchData(e.target.value) }} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t("Search for items")} />

                                </div>
                                {
                                    !props.id && <div className='flex gap-4  items-center justify-between'>
                                        <Button className="bg-blue-800" handleOnClick={() => { handleClickAdd() }}>{t('Add question group')}</Button>
                                    </div>
                                }

                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>

                                        <th scope="col" className="px-6 py-3 w-[100px]">
                                            {t('ID question group')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[300px]">
                                            {t('Question group name')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[300px]">
                                            {t('Question group code')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[70px]">
                                            {t('Status')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('Total question')}
                                        </th>
                                        {
                                            !props.id && <th scope="col" className="px-6 py-3 w-[150px]">
                                               {t('Action')}
                                            </th>
                                        }
                                        {
                                            props.id && <th scope="col" className="px-6 py-3 w-[50px]">
                                                {t('Number question')}
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !isLoading &&
                                        (listQuestionGroup.length !== 0 && (
                                            listQuestionGroup.map(
                                                (item, index) => {

                                                    return (
                                                        <tr key={index} title={item.description} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                            <th
                                                                scope="row" className="flex justify-center w-[100px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                                                {item.id}
                                                            </th>
                                                            <th

                                                                className="px-6 py-4 w-[300px]">
                                                                <p
                                                                    onClick={() => { if (!props.id) handleShowQuestion(item); }}
                                                                    className="cursor-pointer font-medium dark:text-blue-500">{item.name}</p>
                                                            </th>
                                                            <th
                                                                className="px-6 py-4 w-[300px]">

                                                                <p
                                                                    onClick={() => { if (!props.id) handleShowQuestion(item); }}
                                                                    className="cursor-pointer font-medium dark:text-blue-500 " >{item.code}</p>
                                                            </th>
                                                            <th
                                                                className="px-6 py-4 w-[70px]">
                                                                <div className="flex items-center">
                                                                    {
                                                                        item.isEnable === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                                            {t('Active')}</>
                                                                        ) : (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>{t('Inactive')}</>)
                                                                    }
                                                                </div>
                                                            </th>
                                                            <th
                                                                onClick={() => { if (!props.id) handleShowQuestion(item); }}
                                                                className="px-6 py-4 w-[150px]">

                                                                <p className="cursor-pointer font-medium flex justify-center dark:text-blue-500 ">{item.totalQuestion}</p>
                                                            </th>

                                                            {
                                                                !props.id && <th className="px-6 py-4 flex w-[150px]">
                                                                    {
                                                                        isModeActive ? (<>
                                                                            <p onClick={() => { handleClickEdit(item) }} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('Edit')}</p> &nbsp;/&nbsp;
                                                                            <p onClick={() => { handleClickDelete(item) }} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">{t('Delete')}</p></>)
                                                                            : (<p onClick={() => { handleClickActive(item) }} className="cursor-pointer font-medium text-green-600 dark:text-green-500 hover:underline">{t('Active')}</p>)
                                                                    }


                                                                </th>
                                                            }
                                                            {
                                                                props.id && <th className="px-6 py-4 w-[50px]">
                                                                    <input
                                                                        className=' border-black border-[1px] rounded-md pl-5 w-[50px]'
                                                                        type="number"
                                                                        onChange={(event) => { handleEnterNumberQuestion(event, item) }}
                                                                        defaultValue={handleShowDefaultValue(item.id)}
                                                                    />
                                                                </th>
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
                        </>) : (listQuestionGroup.length === 0 && (<>
                            <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                <div className="text-center">
                                    <h1
                                        className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                    >
                                        Uh-oh!
                                    </h1>
                                    <p className="mt-4 text-gray-500">{t('We cannot find any question group.')}</p>
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
                                    <p className="text-center text-lg font-medium"> {t('Edit question group')} </p>
                                    <InputField name={ID_QUESTIONGROUP} disabled form={form} defaultValue={questionGroupSelect.id} />
                                    <InputField name={QUESTIONGROUP_NAME} label={t("Question group name")} form={form} defaultValue={questionGroupSelect.name} />
                                    <InputField name={QUESTIONGROUP_CODE} label={t("Question group code")} form={form} defaultValue={questionGroupSelect.code} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={questionGroupSelect.description || ""} />


                                    <div className='flex justify-around'>
                                        <Button className="bg-blue-800 w-[100px]" type='submit'>{t('Submit')}</Button>
                                    </div>
                                    <div className='flex justify-center'>
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
                                    className="relative mb-0 space-y-4 rounded-lg pt-4 px-4 "
                                >
                                    <p className="text-center text-lg font-medium">{t('Add question group')}</p>
                                    <InputField name={ID_CLASSROOM} disabled form={form} defaultValue={id} />
                                    <InputField name={QUESTIONGROUP_NAME} label={t("Question group name")} form={form} defaultValue={''} />
                                    <InputField name={QUESTIONGROUP_CODE} label={t("Question group code")} form={form} defaultValue={''} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={''} />
                                    <div className='flex justify-around'>
                                        <Button className="bg-blue-800 w-[100px]" type='submit'>{t('Submit')}</Button>
                                    </div>
                                    <div className='flex justify-center'>
                                        <Modal.Header />
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal></>)
                }
                {isDelete && (
                    <>
                        <Modal className="bg-opacity-60 z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
                            <Modal.Header />
                            <Modal.Body>
                                <div
                                    className="relative mb-0 space-y-4 rounded-lg p-4  sm:p-6 lg:p-8"
                                >
                                    <InputField name={ID_QUESTIONGROUP} disabled form={form} defaultValue={questionGroupSelect.id} />
                                    <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Warning')} </p>
                                    <h1 className='text-[16px] text-center'>{('Are you sure you want to delete ?')}</h1>
                                    <div className='flex gap-3'>
                                        <Button handleOnClick={() => handleDeleteQuestionGr(questionGroupSelect.id)} className="bg-red-500 w-[100px]" type='button'>{t('Delete')}</Button>
                                        <Button handleOnClick={() => handleClose()} className=" bg-blue-500">{t('Cancel')}</Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal></>)
                }
                {isChooseActionActive && (
                    <>
                        <Modal className="bg-opacity-60 z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
                            <Modal.Header />
                            <Modal.Body>
                                <div
                                    className="relative mb-0 space-y-4 rounded-lg p-4  sm:p-6 lg:p-8"
                                >
                                    <InputField name={ID_QUESTIONGROUP} disabled form={form} defaultValue={questionGroupSelect.id} />
                                    <p className="text-center text-[20px] font-medium text-green-400 uppercase"> {t('Confirm')} </p>
                                    <h1 className='text-[16px] text-center'>{t('Are you sure you want to active ?')}</h1>
                                    <div className='invisible py-3'></div>
                                    <div className='flex gap-3'>
                                        <Button handleOnClick={() => handleActiveQuestionGr(questionGroupSelect.id)} className="bg-blue-400" type='submit'>{t('Confirm')}</Button>
                                        <Button handleOnClick={() => handleClose()} className=" bg-red-500">{t('Cancel')}</Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal></>)
                }
                {
                    isShowQuestion && (
                        <>
                            <Modal className="fixed bg-opacity-60 z-[101]" show={true} theme={{ 'content': { 'base': 'w-full m-10' } }} popup onClose={() => handleClose()} >
                                <Modal.Header >
                                    <h1>{t('Question of question group')}</h1>
                                    <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />
                                </Modal.Header>
                                <Modal.Body className='flex justify-center '>
                                    <div className='!w-full'>
                                        <Questionmanager id={questionGroupSelect.id} />
                                    </div>
                                </Modal.Body>
                            </Modal></>)
                }
            </div >
        </div >

    )
}
