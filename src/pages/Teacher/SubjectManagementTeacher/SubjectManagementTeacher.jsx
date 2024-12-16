import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllSubjectManagementService, updateActiveClassService, addNewSubjectService, addActiveClassService, deleteActiveClassService, activeClassroomService } from '../../../services/ApiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Path from '../../../utils/Path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'flowbite-react';
import Button from '../../../components/form-controls/Button/Button';

export default function SubjectManagementTeacher() {
    const { t } = useTranslation();
    document.title = t('Subject management');
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortType, setSortType] = useState('asc');
    const [sortBy, setSortBy] = useState('subject_name');
    const [filterStatus, setFilterStatus] = useState(true);
    const [idDelete, setIdDelete] = useState(undefined);
    const [idActive, setIdActive] = useState(undefined);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    const [newSubject, setNewSubject] = useState({
        subjectName: '',
        subjectCode: '',
        description: '',
        isPrivate: false
    });

    const sortOptions = [
        { value: 'subject_name', label: t('Name') },
        { value: 'subject_code', label: t('Code') },

    ];

    const getAllSubjectManagement = (page, size = 10, search, sortBy, sortType, isPrivate) => {
        getAllSubjectManagementService(page, sortType, sortBy, size, search, isPrivate)
            .then(res => {
                setSubjects(res.data.content);
                setTotalPages(res.data.totalPages);
            })
            .catch(() => {
                toast.error(t("Failed to retrieve subjects!"), { position: toast.POSITION.TOP_RIGHT });
            });
    };

    const handleSearch = () => {
        setPage(0);
        getAllSubjectManagement(0, 10, searchText, sortBy, sortType, filterStatus);
    };

    const openEditModal = (subject) => {
        setSubjectToEdit(subject);
        setIsEditModalOpen(true);
    };

    const openAddModal = () => {
        setNewSubject({
            subjectName: '',
            subjectCode: '',
            description: '',
            isPrivate: false
        });
        setIsAddModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSubjectToEdit((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewSubject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveSubjectChanges = () => {
        const updatePayload = {
            id: subjectToEdit.id,
            subjectCode: subjectToEdit.subjectCode,
            subjectName: subjectToEdit.subjectName,
            description: subjectToEdit.description,
            isPrivate: subjectToEdit.isPrivate,
        };
        updateActiveClassService(updatePayload)
            .then(() => {
                toast.success(t("Subject updated successfully!"), { position: toast.POSITION.TOP_RIGHT });
                setIsEditModalOpen(false);
                getAllSubjectManagement(page, 10, searchText, sortBy, sortType, filterStatus); // Refresh subjects
            })
            .catch(() => {
                toast.error(t("Failed to update subject!"), { position: toast.POSITION.TOP_RIGHT });
            });
    };

    const saveNewSubject = () => {
        addActiveClassService(newSubject)
            .then(() => {
                toast.success(t("Subject added successfully!"), { position: toast.POSITION.TOP_RIGHT });
                setIsAddModalOpen(false);
                getAllSubjectManagement(page, 10, searchText, sortBy, sortType, filterStatus); // Refresh subjects
            })
            .catch(() => {
                toast.error(t("Failed to add subject!"), { position: toast.POSITION.TOP_RIGHT });
            });
    };

    const handleClickActive = (id) => {
        console.log("handleClickActive")
        activeClassroomService(id).then((res) => {
            getAllSubjectManagement(page, 10, searchText, sortBy, sortType, filterStatus);
            setIdActive(undefined)
        }).catch((error) => {
            toast.error(t('Active subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }
    const handleDelete = (subjectId) => {

        deleteActiveClassService(subjectId).then((res) => {
            getAllSubjectManagement(page, 10, searchText, sortBy, sortType, filterStatus);
            setIdDelete(undefined);
            toast.success(t('Delete subject successful !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch((error) => {
            toast.error(t('Delete subject fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    };
    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage((prevPage) => prevPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (page > 0) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    useEffect(() => {
        getAllSubjectManagement(page, 10, searchText, sortBy, sortType, filterStatus);
    }, [page, sortBy, sortType, filterStatus]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div>
                <div onClick={() => navigate(-1)}
                    className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                    <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
                </div>
                <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Subject management')}</h1>

           
                <div className="flex items-center mb-4 space-x-4">
                    <input
                        type="text"
                        placeholder={t('Search subjects')}
                        className="border p-2 rounded"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        {t('Search')}
                    </button>
                    <button onClick={openAddModal} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        {t('Add')}
                    </button>
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
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border p-2 rounded bg-white"
                    >
                        <option value="true">{t('Private')}</option>
                        <option value="false">{t('Public')}</option>
                    </select>
                </div>

            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('Managed subjects')}</h2>

                <ul className="space-y-3">
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <li key={subject.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium text-gray-700">{subject.subjectName}</p>
                                    <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                                    <p className="text-sm text-gray-500">{t('Privacy status')}: {subject.isPrivate ? t('Private') : t('Public')}</p>
                                    <p className="text-sm text-gray-500">{t('Total tests')}: {subject.numberOfExams}</p>
                                    <p className="text-sm text-gray-500">{t('Total students')}: {subject.numberOfStudents}</p>
                                    <p className="text-sm text-gray-500">{t('Enable status')}: {subject.isEnable ? t('Active') : t('Inactive')}</p>

                                </div>
                                <div>
                                    <button onClick={() => openEditModal(subject)} className="px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600">
                                        {t('Edit')}
                                    </button>
                                    <button onClick={() => setIdDelete(subject.id)} className="px-3 py-1 bg-red-500 text-white rounded mr-2 hover:bg-red-600">
                                        {t('Delete')}
                                    </button>
                                    <button onClick={() => navigate(Path.TEACHER_SUBJECT_DETAIL.replace(':subjectId', subject.id))} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                                        {t('View detail')}
                                    </button>
                                    <button
                                        onClick={() => setIdActive(subject.id)}
                                        className={`px-3 py-1 ${subject.isEnable ? 'bg-gray-300' : ' bg-yellow-500'} text-white rounded hover:bg-yellow-600`}
                                        disabled={subject.isEnable}
                                    >
                                        {t('Active')}
                                    </button>

                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">{t("No subjects available.")}</p>
                    )}
                </ul>

                <div className="flex justify-between mt-4">
                    <button onClick={handlePreviousPage} disabled={page === 0} className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg">
                        {t('Previous')}
                    </button>
                    <span>{t('Page')} {page + 1} {t('of')} {totalPages}</span>
                    <button onClick={handleNextPage} disabled={page >= totalPages - 1} className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg">
                        {t('Next')}
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">{t('Edit subject')}</h2>
                        {/* Edit Subject form fields */}
                        <label className="block text-gray-700">{t('Subject name')}</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={subjectToEdit.subjectName}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="block text-gray-700">{t('Subject code')}</label>
                        <input
                            type="text"
                            name="subjectCode"
                            value={subjectToEdit.subjectCode}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="block text-gray-700">{t('Description')}</label>
                        <textarea
                            name="description"
                            value={subjectToEdit.description}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="flex text-gray-700 items-center">
                            <span className="mr-2">{t('Status')}</span>
                            <button
                                onClick={() => setSubjectToEdit(prev => ({
                                    ...prev,
                                    isPrivate: !prev.isPrivate
                                }))}
                                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${subjectToEdit.isPrivate ? 'bg-blue-500' : 'bg-yellow-300'
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${subjectToEdit.isPrivate ? 'translate-x-6' : ''
                                        }`}
                                ></div>
                            </button>
                            <span className="ml-2">{subjectToEdit.isPrivate ? t('Private') : t('Public')}</span>
                        </label>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-600 rounded">
                                {t('Cancel')}
                            </button>
                            <button onClick={saveSubjectChanges} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {t('Save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">{t('Add New Subject')}</h2>
                        {/* Add Subject form fields */}
                        <label className="block text-gray-700">{t('Subject Name')}</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={newSubject.subjectName}
                            onChange={handleAddChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="block text-gray-700">{t('Subject Code')}</label>
                        <input
                            type="text"
                            name="subjectCode"
                            value={newSubject.subjectCode}
                            onChange={handleAddChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="block text-gray-700">{t('Description')}</label>
                        <textarea
                            name="description"
                            value={newSubject.description}
                            onChange={handleAddChange}
                            className="border p-2 w-full rounded mb-4"
                        />
                        <label className="flex text-gray-700 items-center">
                            <span className="mr-2">{t('Status')}</span>
                            <button
                                onClick={() => setNewSubject(prev => ({
                                    ...prev,
                                    isPrivate: !prev.isPrivate
                                }))}
                                className={`w-12 h-6 flex items-center  rounded-full p-1 duration-300 ease-in-out ${newSubject.isPrivate ? 'bg-blue-500' : 'bg-yellow-300'
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${newSubject.isPrivate ? 'translate-x-6' : ''
                                        }`}
                                ></div>
                            </button>
                            <span className="ml-2">{newSubject.isPrivate ? t('Private') : t('Public')}</span>
                        </label>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-600 rounded">
                                {t('Cancel')}
                            </button>
                            <button onClick={saveNewSubject} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {t('Add')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {idDelete && (
                <>
                    <Modal className="bg-opacity-60 z-[101]" show={true} size="md" popup onClose={() => setIdDelete(undefined)} >
                        <Modal.Header />
                        <Modal.Body>
                            <div
                                className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                            >

                                <p className="text-center text-[20px] font-medium text-yellow-300 uppercase"> {t('Warning')} </p>
                                <h1 className='text-[16px] text-center'>{('Are you sure you want to delete ?')}</h1>
                                <div className='flex gap-3'>
                                    <Button handleOnClick={() => handleDelete(idDelete)} className="bg-red-500 w-[100px]" type='button'>{t('Delete')}</Button>
                                    <Button handleOnClick={() => setIdDelete(undefined)} className=" bg-blue-500">{t('Cancel')}</Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal></>)
            }
            {idActive && (
                <Modal
                    className="bg-opacity-60 z-[101]"
                    show={true}
                    size="md"
                    popup
                    onClose={() => setIdActive(undefined)}
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
                                    handleOnClick={() => handleClickActive(idActive)}
                                    className="bg-yellow-500 w-[100px]"
                                >
                                    {t('Activate')}
                                </Button>
                                <Button
                                    handleOnClick={() => setIdActive(undefined)}
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
    );
}
