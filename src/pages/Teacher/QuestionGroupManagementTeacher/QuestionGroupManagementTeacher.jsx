import React, { useEffect, useState } from 'react';
import { useParams, Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    activeQuestionGroupService,
    addQuestionGroupService,
    deleteQuestionGroupService,
    getAllActivateQuestionGroupService,
    getAllUnActiveQuestionGroupService,
    updateQuestionGroupService,

} from '../../../services/ApiService';
import { toast } from 'react-toastify';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import { Modal } from 'flowbite-react';
import Path from '../../../utils/Path';
import Button from '../../../components/form-controls/Button/Button';
import ModalCustom from '../../../components/modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';


export default function QuestionGroupManagementTeacher() {
    const { t } = useTranslation();
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [questionSets, setQuestionSets] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortType, setSortType] = useState('asc');
    const [sortBy, setSortBy] = useState('id');
    const [searchText, setSearchText] = useState('');
    const [isModeActive, setModeActive] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editQuestionSet, setEditQuestionSet] = useState(null);
    const [idDelete, setIdDelete] = useState(undefined);
    const [size,setSize]=useState(7);
    const [newQuestionSet, setNewQuestionSet] = useState({
        code: '',
        name: '',
        subjectId: subjectId,
        description: ''
    });

    const sortOptions = [
        { value: 'name', label: t('Question group name') },
        { value: 'code', label: t('Question group code') }
    ];

    const getAllActiveQuestionGroupBySubjectId = (page, sortType, column, size, search) => {
        getAllActivateQuestionGroupService(subjectId, page, sortType, column, size, search).then((res) => {
            setQuestionSets(res.data.content);
            setTotalPages(res.data.totalPages)

        }
        ).catch((error) => {

            toast.error(t('Get question group fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });

        }
        );
    }

    const getAllUnActiveQuestionGroupBySubjectId = (page, sortType, column, size, search) => {
        getAllUnActiveQuestionGroupService(subjectId, page, sortType, column, size, search).then((res) => {
            setQuestionSets(res.data.content);
            setTotalPages(res.data.totalPages)
        }
        ).catch((error) => {

            toast.error(t('Get question group fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        );
    }

    const getAllQuestionGroup = (page, sortType, column, size, search) => {
        // if (!id) {
        //     id = props.id;
        //     size = 6;
        //     setValueNumberOfQuestion(props.listQuestionGrChoose)
        // }
        if (isModeActive)
            getAllActiveQuestionGroupBySubjectId(page, sortType, column, size, search);
        else
            getAllUnActiveQuestionGroupBySubjectId(page, sortType, column, size, search);
    }
    useEffect(() => {
        getAllQuestionGroup(page, sortType, sortBy,size, searchText);
    }, [subjectId, page, sortBy, sortType, searchText, isModeActive]);
    const handleClose = () => {
        setShowModal(false);
        setIdDelete(undefined);
    }
    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setPage(0);
    };
    const handleActiveQuestionGr = (questionGrId) => {

        handleClose();
        activeQuestionGroupService(questionGrId).then((res) => {
            toast.success('Active question group successfuly !', { position: toast.POSITION.TOP_RIGHT });
            getAllQuestionGroup(page, sortType, sortBy,size, searchText);
        }).catch((error) => {
            toast.error(t('Active question group fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }
    const handleCreateOrUpdate = () => {
        if (editQuestionSet) {
            // Update existing question set
            updateQuestionGroupService(newQuestionSet).then((res) => {
                handleClose()
                getAllQuestionGroup(page, sortType, sortBy,size, searchText);
            }).catch((error) => {
                toast.error(t('Update question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        } else {

            addQuestionGroupService(newQuestionSet).then((res) => {
                console.log(res)
                handleClose();
                getAllQuestionGroup(page, sortType, sortBy,size, searchText);
            }
            ).catch((error) => {
                toast.error(t('Add question group fail !'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
        }
    };

    const handleDelete = (questionGrId) => {

        deleteQuestionGroupService(questionGrId).then((res) => {
            handleClose();
            getAllQuestionGroup(page, sortType, sortBy,size, searchText);
            toast.success(t('Delete question group successfuly !'), { position: toast.POSITION.TOP_RIGHT });
        }).catch((error) => {
            toast.error(t('Delete question group fail !'), {
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
            <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Question group management')}</h1>


            {/* Search and Sort */}
            <div className="flex items-center mb-4 space-x-4">
                <input
                    type="text"
                    placeholder={t('Search question sets')}
                    value={searchText}
                    onChange={handleSearch}
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
                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                    onClick={() => {
                        setNewQuestionSet({ code: '', name: '', subjectId: subjectId, description: '' });
                        setEditQuestionSet(null);
                        setShowModal(true);
                    }}
                >
                    {t('Add')}
                </button>


            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-3">
                    {questionSets.length > 0 ? (
                        questionSets.map(set => (
                            <li key={set.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <NavLink to={Path.TEACHER_MANAGER_QUESTION.replace(":questionGroupId", set.id)} className="text-lg font-medium text-blue-500 hover:underline">
                                        {set.name}
                                    </NavLink>
                                    <p className="text-sm text-gray-500">{t('Description')}: {set.description || t('No description provided')}</p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setEditQuestionSet(set);
                                            setNewQuestionSet(set);
                                            setShowModal(true);
                                        }}
                                        className="px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                                    >
                                        {t('Edit')}
                                    </button>
                                    <button onClick={() => setIdDelete(set.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2">
                                        {t('Delete')}
                                    </button>
                                    <button
                                        onClick={() => handleActiveQuestionGr(set.id)}
                                        className={`px-3 py-1 ${set.isEnable ? 'bg-gray-300' : ' bg-yellow-500'} text-white rounded hover:bg-yellow-600`}
                                        disabled={set.isEnable}
                                    >
                                        {t('Active')}
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">{t("No question sets available")}</p>
                    )}
                </ul>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400"
                    >
                        {t('Previous')}
                    </button>
                    <span>{t('Page')} {page + 1} {t('of')} {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400"
                    >
                        {t('Next')}
                    </button>
                </div>

            </div>

            {showModal && (
                <ModalCustom title={editQuestionSet ? t('Edit question group') : t('Add question group')} onClose={() => setShowModal(false)}>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder={t('Question group code')}
                            value={newQuestionSet.code}
                            onChange={(e) => setNewQuestionSet({ ...newQuestionSet, code: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder={t('Question group name')}
                            value={newQuestionSet.name}
                            onChange={(e) => setNewQuestionSet({ ...newQuestionSet, name: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <textarea
                            placeholder={t('Description')}
                            value={newQuestionSet.description}
                            onChange={(e) => setNewQuestionSet({ ...newQuestionSet, description: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <button
                            onClick={handleCreateOrUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            {editQuestionSet ? t('Update') : t('Add')}
                        </button>
                    </div>
                </ModalCustom>
            )}
            {idDelete && (
                <>
                    <Modal className="bg-opacity-60 z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
                        <Modal.Header />
                        <Modal.Body>
                            <div
                                className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                            >

                                <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Warning')} </p>
                                <h1 className='text-[16px] text-center'>{('Are you sure you want to delete ?')}</h1>
                                <div className='flex gap-3'>
                                    <Button handleOnClick={() => handleDelete(idDelete)} className="bg-red-500 w-[100px]" type='button'>{t('Delete')}</Button>
                                    <Button handleOnClick={() => handleClose()} className=" bg-blue-500">{t('Cancel')}</Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal></>)
            }
        </div>
    );
}
