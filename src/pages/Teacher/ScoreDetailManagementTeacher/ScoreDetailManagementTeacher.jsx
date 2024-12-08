import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getScoreOfStudentService } from '../../../services/UserService';
import { Pagination } from '@mui/material';
import QuizQuestion from '../../../components/exam/QuizQuesiton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { exportScorePDFService } from '../../../services/ApiService';

export default function ScoreDetailManagementTeacher() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [testId] = useState(location?.state?.testId);
    const [studentId] = useState(location?.state?.studentId);
    const [scoreDetail, setScoreDetail] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size] = useState(10); 
    const handleClickExport = () => {
        exportScorePDFService(scoreDetail.id).then((res) => {
          console.log(res)
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `ScoreDetail.pdf`); // Tên file
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          console.log("successeee")
    
        }).catch((e) => {
          console.log(e)
        })
      }
    useEffect(() => {
        fetchScoreDetail();
    }, [page]);

    const fetchScoreDetail = () => {
        getScoreOfStudentService(studentId, testId, page, undefined, undefined, size)
            .then((res) => {
                setScoreDetail(res.data);
                setTotalPages(res.data.submittedQuestions.totalPages);
            })
            .catch(() => {
                toast.error(t('Failed to fetch score details!'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div onClick={() => navigate(-1)} className="flex items-center cursor-pointer mb-4">
                <FontAwesomeIcon className="mr-2" icon={faLeftLong} />
                {t('Back to previous page')}
            </div>
            <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Score detail')}</h1>

            {scoreDetail ? (
                <>
                    {/* Score Overview */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">{scoreDetail?.multipleChoiceTest?.testName}</h2>
                        <p className="text-gray-500">{t('Submitted on')}: {format(new Date(scoreDetail?.submittedDate), 'MMM dd, yyyy HH:mm')}</p>
                        <p className="text-gray-500">{t('Target Score')}: {scoreDetail?.targetScore} / 10</p>
                        <p className="text-gray-500">{t('Total Score')}: {scoreDetail?.totalScore} / 10</p>
                        <p className={`font-semibold ${scoreDetail.totalScore >= scoreDetail.targetScore ? 'text-green-600' : 'text-red-600'}`}>
                            {scoreDetail.totalScore >= scoreDetail.targetScore ? t('Passed') : t('Failed')}
                        </p>
                        <div className='flex items-center justify-end'>
                            <button
                                onClick={() => { handleClickExport() }}
                                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                            >
                                {t('Export pdf score')}
                            </button>
                        </div>
                    </div>

                    {/* Submitted Questions */}
                    {scoreDetail.submittedQuestions?.content?.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('Submitted questions')}</h2>

                            {scoreDetail.submittedQuestions.content.map((question, index) => (
                                <div key={index} className="mb-4 ">
                                    <QuizQuestion indexQuestion={index} question={question} showScore={true} />
                                </div>
                            ))}

                            {/* Pagination */}
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={(e, value) => setPage(value - 1)}
                                className="mt-4 flex items-center justify-center"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('No questions available')}</p>
                    )}
                </>
            ) : (
                <p className="text-gray-500">{t('Loading score details...')}</p>
            )}
        </div>
    );
}
