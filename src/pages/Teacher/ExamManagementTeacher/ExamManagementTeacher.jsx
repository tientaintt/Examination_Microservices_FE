import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addExamByIdClassroomService, convertMillisecondsToTime, deleteExamService, getAllExamManageService, getAllSubjectManagementService, getFormattedDateTimeByMilisecond, updateExamService } from '../../../services/ApiService';
import ModalCustom from '../../../components/modal/Modal';
import { Datepicker } from 'flowbite-react';
import TestForm from '../../../components/exam/TestForm';
import RandomQuestionForm from '../../../components/exam/RandomQuestionForm';
import ManualQuestionForm from '../../../components/exam/ManualQuestionForm';
import { Autocomplete, TextField } from '@mui/material';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Path from '../../../utils/Path';
import { isAfter } from 'date-fns';

export default function ExamManagementTeacher() {
    const { t } = useTranslation();
    document.title = t("Exam management");
    const [exams, setExams] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortType, setSortType] = useState('asc');
    const [sortBy, setSortBy] = useState('testName');
    const [searchText, setSearchText] = useState('');
    const [startOfDate, setStartOfDate] = useState(new Date().getTime());
    const [endOfDate, setEndOfDate] = useState('');
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newTest, setNewTest] = useState({
        subjectId: '',
        testName: '', startDate: (new Date()).getTime(), endDate: (new Date()).getTime(), testingTime: '',
        description: '', targetScore: ''
    });

    const [addQuestionModal, setAddQuestionModal] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const getAllSubjectManagement = () => {
        getAllSubjectManagementService(0, undefined, undefined, 1000, undefined, false)
            .then(res => {
                setSubjects(res.data.content);

            })
            .catch(() => {


                toast.error(t("Failed to retrieve subjects!"), { position: toast.POSITION.TOP_RIGHT });
            });
    };
    const handleClickAdd = () => {
        setShowAddModal(true);
        setNewTest({
            subjectId: '',
            testName: '', startDate: (new Date()).getTime(), endDate: (new Date()).getTime(), testingTime: '',
            description: '', targetScore: ''
        })
        getAllSubjectManagement();
    }
    const fetchTests = () => {
        getAllExamManageService(page, sortType, sortBy, undefined, searchText, startOfDate, endOfDate).then(res => {
            setExams(res.data.content)
            setTotalPages(res.data.totalPages)
        }).catch(e => {
            console.log(e)
            toast.error(t('Get exam fail !', { position: toast.POSITION.TOP_RIGHT }))
        })
    };

    useEffect(() => {
        fetchTests();
    }, [page, sortType, sortBy, searchText, startOfDate, endOfDate]);

    const handleAddTest = () => {
        console.log(newTest)
        addExamByIdSubject(newTest);
    };
    const addExamByIdSubject = (body) => {
        addExamByIdClassroomService(body).then((res) => {
            console.log(res)
            fetchTests();
            toast.success(t('Add exam successful !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
            handleClose();
        }).catch((error) => {
            toast.error(t('Add exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
    }

    const handleEditTest = () => {
        updateExamService(selectedTest).then((res) => {
            fetchTests();
            handleClose();
        }).catch((error) => {
            toast.error(t('Update exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    };
    const handleDeleteTest = () => {
        deleteExamService(selectedTest.id).then((res) => {
            fetchTests();
            handleClose();
        }).catch((error) => {
            toast.error(t('Delete exam fail !'), {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    };
    const handleClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setNewTest({
            subjectId: '',
            testName: '', startDate: (new Date()).getTime(), endDate: (new Date()).getTime(), testingTime: '',
            description: '', targetScore: ''
        })
        setSelectedTest(null);

    }
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div onClick={() => navigate(-1)}
                className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
            </div>
            <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Exam management')}</h1>

            {/* Search and Sort Controls */}
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder={t('Search exams')}
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
                    className="border p-2 rounded bg-white mr-4"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded bg-white mr-4"
                >
                    <option value="testName">{t('Exam name')}</option>
                    <option value="startDate">{t('Start date')}</option>

                </select>
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border p-2 rounded bg-white mr-4"
                >
                    <option value="asc">{t('Ascending')}</option>
                    <option value="desc">{t('Descending')}</option>
                </select>
                <Datepicker
                    selected={startOfDate ? new Date(startOfDate) : null}
                    onSelectedDateChanged={(date) => setStartOfDate(date ? date.getTime() : '')}
                    dateformat="yyyy-MM-dd"
                    placeholder={t('Start of date')}
                    className="border rounded bg-white mr-4"
                />

                <Datepicker
                    selected={endOfDate ? new Date(endOfDate) : null}
                    onSelectedDateChanged={(date) => setEndOfDate(date ? date.getTime() : '')}
                    dateformat="yyyy-MM-dd"
                    placeholder={t('End of date')}
                    className="border rounded bg-white mr-4"
                />
                <button
                    onClick={() => { handleClickAdd() }}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
                >
                    {t('Add exam')}
                </button>
            </div>

            {/* Exam List */}
            <ul className="space-y-3">
                {exams.length > 0 && exams.map((exam) => (
                    <li key={exam.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-lg font-medium text-gray-700">{exam.testName}</p>
                            <p className="text-gray-500">{t('Start date')}: {getFormattedDateTimeByMilisecond(exam.startDate) }</p>
                            <p className="text-gray-500">{t('End date')}: {getFormattedDateTimeByMilisecond(exam.endDate)}</p>
                            <p className="text-gray-500">{t('Duration')}: {exam.testingTime} {t('minutes')}</p>
                            <p>{t('Target score')}: {exam.targetScore}/10</p>
                        </div>
                        <div>
                            {
                                
                                !isAfter(new Date(),new Date(exam.startDate)) && (<>
                                    <button
                                        onClick={() => { setSelectedTest(exam); setShowEditModal(true); }}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        {t('Edit')}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedTest(exam); setShowDeleteModal(true); }}
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        {t('Delete')}
                                    </button>
                                </>)
                            }

                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { navigate(Path.TEACHER_MANAGER_SCORE.replace(':idExam?', exam.id)) }} >
                                {t('Show student score has joined exam')}
                            </button>
                        </div>
                    </li>
                ))}
                {exams.length <= 0 && <p className="mt-4 text-gray-500">{t('We cannot find any exam.')}</p>}
            </ul>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg"
                >
                    {t('Previous')}
                </button>
                <span>{t('Page')} {page + 1} {t('of')} {totalPages}</span>
                <button
                    onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg"
                >
                    {t('Next')}
                </button>
            </div>

            {showAddModal && (
                <ModalCustom title={t('Add exam')} onClose={() => setShowAddModal(false)}>
                    <Autocomplete
                        options={subjects}
                        getOptionLabel={(option) => `${option.subjectName} (${option.subjectCode})`}
                        onChange={(event, value) => {
                            console.log(value);
                            if (value) {
                                setNewTest({ ...newTest, subjectId: value.id });
                            } else {
                                setNewTest({ ...newTest, subjectId: null });
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Select subject" variant="outlined" />}
                        renderOption={(props, option) => (
                            <li {...props}>
                                {option.subjectName} ({option.subjectCode})
                            </li>
                        )}
                        style={{ marginTop: '16px' }} // Optional: Add spacing
                    />
                    <TestForm
                        test={newTest}
                        onChange={setNewTest}
                        onSave={handleAddTest}
                        openAddQuestionModal={() => setAddQuestionModal(true)}
                    />
                </ModalCustom>
            )}

            {addQuestionModal && (
                <ModalCustom title={t('Add question')} onClose={() => setAddQuestionModal(null)}>
                    <div>
                        <button
                            className="bg-purple-500 text-white px-4 py-2 rounded w-full mb-4"
                            onClick={() => setAddQuestionModal('random')}>
                            {t('Add random by question group')}
                        </button>
                        <button
                            className="bg-teal-500 text-white px-4 py-2 rounded w-full"
                            onClick={() => setAddQuestionModal('manual')}>
                            {t('Add manual ')}
                        </button>
                    </div>
                </ModalCustom>
            )}

            {addQuestionModal === 'random' && (
                <ModalCustom title={t('Add random questions')} onClose={() => setAddQuestionModal(null)}>
                    <RandomQuestionForm
                        onSave={(questions) => {
                            const updatedTest = { ...newTest, randomQuestions: questions };
                            delete updatedTest.questionIds;
                            setNewTest(updatedTest);
                            setAddQuestionModal(null);
                        }}
                        subjectId={newTest.subjectId}

                        initialSelectedQuestions={newTest?.randomQuestions}
                    />
                </ModalCustom>
            )}

            {addQuestionModal === 'manual' && (
                <ModalCustom title={t('Add manual questions')} onClose={() => setAddQuestionModal(null)}>
                    <ManualQuestionForm
                        onSave={(questionIds) => {
                            const updatedTest = { ...newTest, questionIds: questionIds };
                            delete updatedTest.randomQuestions;
                            setNewTest(updatedTest);
                            setAddQuestionModal(null);
                        }}
                        subjectId={newTest.subjectId}
                        initialSelectedQuestions={newTest?.questionIds}
                    />
                </ModalCustom>
            )}

            {showEditModal && (
                <ModalCustom title={t('Edit Test')} onClose={() => handleClose()}>
                    <TestForm test={selectedTest} onChange={setSelectedTest} onSave={handleEditTest} />
                </ModalCustom>
            )}


            {showDeleteModal && (
                <ModalCustom title={t('Confirm Delete')} onClose={() => handleClose()}>
                    <p>{t('Are you sure you want to delete this test?')}</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => handleClose()} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            {t('Cancel')}
                        </button>
                        <button onClick={handleDeleteTest} className="bg-red-500 text-white px-4 py-2 rounded">
                            {t('Delete')}
                        </button>
                    </div>
                </ModalCustom>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ModalCustom title={t('Confirm Delete')} onClose={() => setShowDeleteModal(false)}>
                    <p>{t('Are you sure you want to delete this exam?')}</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            {t('Cancel')}
                        </button>
                        <button onClick={handleDeleteTest} className="bg-red-500 text-white px-4 py-2 rounded">
                            {t('Delete')}
                        </button>
                    </div>
                </ModalCustom>
            )}
        </div>
    );
}

