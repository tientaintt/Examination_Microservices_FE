import React, { useEffect, useState, useTransition } from 'react'
import { activeClassroomService, addActiveClassService, deleteActiveClassService, getAllActiveClassService, getAllUnActiveClassService, removeCredential, updateActiveClassService } from '../../../services/ApiService'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import InputField from '../../../components/form-controls/InputField/InputField';
import ButtonS from '../../../components/form-controls/Button/Button';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import * as yup from 'yup';
import PaginationNav from '../../../components/pagination/PaginationNav';
import { useNavigate } from 'react-router-dom';
import Path from '../../../utils/Path';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import Teachermanager from './Teachermanager';
const CLASS_CODE = 'subjectCode';
const CLASS_NAME = 'subjectName';
const DESCRIPTION = 'description';
const IS_PRIVATE = 'isPrivate';
const ID_CLASS = 'id';

export const Classmanager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [teacher,setTeacher]=useState({});
    const [isQuestionGroupOpen, setIsQuestionGroupOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [listAllClass, setlistAllClass] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFirst, setIsFirst] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [offset, setOffset] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [classSelect, setClassSelect] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);
    const [isToggle, setIsToggle] = useState(true);
    const [isModeActive, setIsModeActivate] = useState(true);
    const [isChooseActive, setIsChooseActive] = useState(false);
    const [isShowTeacher, setIsShowTeacher] = useState(false);
    const initialValue = {
        [CLASS_CODE]: '',
        [CLASS_NAME]: '',
        [DESCRIPTION]: '',
        [IS_PRIVATE]: '',
        [ID_CLASS]: ''
    };
    const yupObject = yup.object().shape({
        [CLASS_CODE]: yup
            .string()
            .required(t("The code of subject is required.")),
        [CLASS_NAME]: yup
            .string()
            .required(t("The name of subject is required.")),
        [DESCRIPTION]: yup
            .string()
            .required(t("The description of subject is required.")),
    });

    const handleShowStudent = (item) => {
        navigate(`/admin/student/${item.id}`)
    }
    const handleShowExamOfClass = (item) => {
        navigate(`/admin/examination/${item.id}`)
    }
    const handleClickOpenQuestionGroup = (item) => {
        navigate(`/admin/questiongr/${item.id}`)
    }

    const handleShowTeacher = (item) => {
        setIsShowTeacher(true);
        setClassSelect(item);
    }

    const handleClickDelete = (item) => {
        setIsDelete(true);
        setClassSelect(item);
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
        if(isShowTeacher)
            setIsShowTeacher(false)
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
        if (isEdit)
            updateActiveClassService({ ...body, isPrivate: isToggle }).then((res) => {
                getAllClass();
            }).catch((error) => {
                toast.error(t('Update subject fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        if (isAdd)
            addActiveClassService({ ...body, isPrivate: isToggle }).then((res) => {
                getAllClass();
            }).catch((error) => {
                toast.error(t('Add subject fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        setActiveIndex(0);

    }

    const handleClickPage = (index) => {
        setActiveIndex(index);
        getAllClass(index);
    };

    const handlePrevious = (index) => {

        setActiveIndex(index - 1);
        getAllClass(index - 1);
    }

    const handleNext = (index) => {

        setActiveIndex(index + 1);
        getAllClass(index + 1);
    }

    const handleSearch = (data) => {
        if (isModeActive)
            getAllActiveClassService(undefined, undefined, undefined, undefined, data).then((res) => {
                setActiveIndex(0);
                setlistAllClass(res.data.content);
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
            }).catch((error) => {

                toast.error(t('Search fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        else
            getAllUnActiveClassService(undefined, undefined, undefined, undefined, data).then((res) => {
                setActiveIndex(0);
                setlistAllClass(res.data.content);
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
            }).catch((error) => {
                removeCredential();
                navigate(Path.LOGIN);
                toast.error(t('Search fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const handleClickActiveClass = (id) => {
        activeClassroomService(id).then((res) => {
            getAllClass();
        }).catch((error) => {
            toast.error(t('Active subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
        handleClose();
    }

    const handleClickDeleteClass = (id) => {
        deleteActiveClassService(id).then((res) => {
            getAllClass();
        }).catch((error) => {
            toast.error(t('Delete subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
        handleClose();
    }

    const handleClickActive = (item) => {
        setIsChooseActive(true);
        setTimeout(() => {
            setClassSelect(item);
        });
    }

    const handleClickEdit = (item) => {
        form.clearErrors();
        setIsEdit(true);
        setTimeout(() => {
            setClassSelect(item);
        });
    }

    const getAllActiveClass = async (page, sortType, column, size, search) => {
        await getAllActiveClassService(page, sortType, column, size, search).then((res) => {
            setlistAllClass(res.data.content);
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
            toast.error(t('Get list subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    }

    const getAllUnActivateClass = async (page, sortType, column, size, search) => {
        getAllUnActiveClassService(page, sortType, column, size, search).then((res) => {
            setlistAllClass(res.data.content);
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
            toast.error(t('Get list subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            removeCredential();
            navigate(Path.LOGIN);
        });
    }

    const getAllClass = (page, sortType, column, size, search) => {
        if (isModeActive)
            getAllActiveClass(page, sortType, column, size, search);
        else
            getAllUnActivateClass(page, sortType, column, size, search);
    }

    const isActive = (index) => {
        return index === activeIndex;
    };

    useEffect(() => {
        document.title = t("Subject management");
        getAllClass();
    }, [isModeActive]);
    return (
        <>

            <div className=" p-4 h-full w-full flex-row flex justify-center ">
                <div className="p-4 dark:border-gray-700">
                    <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
                        {t('Subject management')}
                    </div>
                    <div className="flex items-center justify-start h-auto mb-4 bg-gray-100">

                        <div className=" overflow-auto shadow-md sm:rounded-lg">
                            <div className='p-3 items-center flex gap-4 justify-between mb-[14px]'>

                                <div className='w-[150px] z-0'>
                                    <Toggle checked={isModeActive} handleToggle={setIsModeActivate} >{isModeActive ? t('Active') : t('Inactive')}</Toggle>

                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 ">
                                        <ButtonS handleOnClick={() => { handleSearch(searchData) }} >
                                            <svg className="w-5 h-5 text-white dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </ButtonS>
                                    </div>
                                    <input onChange={(e) => { setSearchData(e.target.value) }} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t("Search for items")} />

                                </div>
                                <div className='flex gap-4  items-center justify-between'>
                                    <ButtonS className="bg-blue-800" handleOnClick={() => { handleClickAdd() }}>{t('Add')}</ButtonS>

                                </div>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 w-[150px]">
                                            {t('ID subject')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[300px]" >
                                            {t('Subject name')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[300px] ">
                                            {t('Subject code')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 w-[70px]">
                                            {t('Status')}
                                        </th>

                                        <th scope="col" className="px-6 py-3 w-[70px]">
                                            {t('Action')}
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !isLoading &&
                                        (listAllClass.length !== 0 && (
                                            listAllClass.map(
                                                (item, index) => {

                                                    return (
                                                        <>
                                                            <tr key={index} title={item.description} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                                <th
                                                                    scope="row" className="w-[150px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                                                    {item.id}
                                                                </th>
                                                                <td

                                                                    className="px-6 py-4 w-[300px] ">
                                                                    <p
                                                                        onClick={() => handleClickOpenQuestionGroup(item)}
                                                                        className="cursor-pointer font-medium dark:text-blue-500  w-[300px] line-clamp-1">{item.subjectName}</p>
                                                                </td>
                                                                <td
                                                                    className="px-6 py-4 w-[300px] " >
                                                                    <p
                                                                        onClick={() => handleClickOpenQuestionGroup(item)}
                                                                        className="cursor-pointer truncate font-medium w-[300px] line-clamp-1">{item.subjectCode}</p>
                                                                </td>
                                                                <td

                                                                    className="px-6 py-4 w-[70px]">
                                                                    <div className="flex items-center">
                                                                        {
                                                                            item.isEnable === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                                                {t('Active')}</>
                                                                            ) : (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>{t('Inactive')}</>)
                                                                        }
                                                                    </div>
                                                                </td>

                                                                <td className="px-6 py-4 w-[70px]">
                                                                    <Menu >
                                                                        <MenuHandler>
                                                                            <Button className='bg-slate-400'>
                                                                                <FontAwesomeIcon icon={faBars} />
                                                                            </Button>
                                                                        </MenuHandler>

                                                                        {
                                                                            isModeActive ? (<MenuList className='rounded-md'><MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickEdit(item) }}>{t('Edit')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickDelete(item) }} >{t('Delete')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleShowStudent(item) }} >{t('Show student of subject')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleShowTeacher(item) }} >{t('Add management teacher for subject')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickOpenQuestionGroup(item) }}>{t('Show question group of subject')}</MenuItem>
                                                                                <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleShowExamOfClass(item) }}>{t('Show examination of subject')}</MenuItem>
                                                                            </MenuList>)
                                                                                : (<MenuList className='rounded-md'><MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start p-2' onClick={() => { handleClickActive(item) }}>{t('Active subject')}</MenuItem></MenuList>)
                                                                        }



                                                                    </Menu>

                                                                </td>
                                                            </tr>
                                                        </>
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
                        </>) : (listAllClass.length === 0 && (<>
                            <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                <div className="text-center">
                                    <h1
                                        className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                    >
                                        Uh-oh!
                                    </h1>
                                    <p className="mt-4 text-gray-500">{t('We cannot find any subject.')}</p>
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
                                    <p className="text-center text-lg font-medium">{t('Edit subject')}</p>
                                    <InputField name={ID_CLASS} disabled form={form} defaultValue={classSelect.id} />
                                    <InputField name={CLASS_NAME} label={t("Subject name")} form={form} defaultValue={classSelect.subjectName} />
                                    <InputField name={CLASS_CODE} label={t("Subject code")} form={form} defaultValue={classSelect.subjectCode} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={classSelect.description || ""} />
                                    {/* <Toggle checked={classSelect.isPrivate} handleToggle={setIsToggle} >Is Private</Toggle> */}
                                    <div className='flex justify-around'>
                                        <ButtonS className="bg-blue-800 w-[100px]" type='submit'>{t('Submit')}</ButtonS>
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
                        <Modal className="bg-opacity-60 z-[101]" theme={{ 'content': { 'base': 'w-1/2 m-10' } }} show={true} popup onClose={() => handleClose()} >
                            <Modal.Body>
                                <form onSubmit={form.handleSubmit(submitForm)}
                                    className="relative mb-0 space-y-4 rounded-lg pt-4 px-4  "
                                >
                                    <p className="text-center text-lg font-medium">{t('Add subject')}</p>
                                    <InputField name={ID_CLASS} disabled form={form} defaultValue={''} />
                                    <InputField name={CLASS_NAME} label={t("Subject name")} form={form} defaultValue={''} />
                                    <InputField name={CLASS_CODE} label={t("Subject code")} form={form} defaultValue={''} />
                                    <InputField name={DESCRIPTION} label={t("Description")} form={form} defaultValue={''} />
                                    {/* <Toggle checked={isToggle} handleToggle={setIsToggle} >Is Private</Toggle> */}
                                    <div className='flex justify-around'>
                                        <ButtonS className="bg-blue-800 w-[100px]" type='submit'>{t('Submit')}</ButtonS>
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
                                <form
                                    className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                                >
                                    <InputField name={ID_CLASS} disabled form={form} defaultValue={classSelect.id} />
                                    <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {('Warning')} </p>
                                    <h1 className='text-[16px] text-center'>{t('Are you sure you want to delete ????')}</h1>
                                    <div className='invisible py-3'></div>
                                    <div className='flex gap-3'>
                                        <ButtonS handleOnClick={() => handleClickDeleteClass(classSelect.id)} className="bg-red-500" type='button'>{t('Delete')}</ButtonS>
                                        <ButtonS handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</ButtonS>
                                    </div>

                                </form>
                            </Modal.Body>
                        </Modal></>)
                }

                {isShowTeacher && (
                    <>
                        <Modal className="bg-opacity-60 z-[101] " show={true} theme={{ 'content': { 'base': 'w-3/4 ' } }} popup onClose={() => handleClose()} >
                            <Modal.Header />
                            <Modal.Body className='flex justify-center w-full'>
                                    <div className='flex justify-center '>
                                        <Teachermanager idSubject={classSelect.id}  selectTeacher={handleClose}/>
                                    </div>
                        
                        
                        </Modal.Body>
                    </Modal></>)
                }
            {isChooseActive && (
                <>
                    <Modal className="bg-opacity-60 z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
                        <Modal.Header />
                        <Modal.Body>
                            <form
                                className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                            >
                                <InputField name={ID_CLASS} disabled form={form} defaultValue={classSelect.id} />
                                <p className="text-center text-[20px] font-medium text-green-300 uppercase"> {t('Confirm')} </p>
                                <h1 className='text-[16px] text-center'>{t('Are you sure you want to active ?')}</h1>
                                <div className='invisible py-3'></div>
                                <div className='flex gap-3'>
                                    <ButtonS handleOnClick={() => handleClickActiveClass(classSelect.id)} className="bg-red-500" type='submit'>{t('Submit')}</ButtonS>
                                    <ButtonS handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</ButtonS>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal></>)
            }

        </div >
        </ >

    )
}
