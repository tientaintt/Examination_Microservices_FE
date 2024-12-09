import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Path from '../../../utils/Path';
import classroomPNG from '../../../assets/classroomPNG.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { createTestTrackingService, getDoMultipleChoiceTestService, getMyScoreService, submitMCTestService, trackMyTestService } from '../../../services/UserService';
import { secondsDiff, secondsToTime } from '../../../utils/WebUtils';
import QuizQuestion from '../../../components/exam/QuizQuesiton';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';

function DoMCTest() {
      const { t } = useTranslation();
      const navigate = useNavigate();
      let location = useLocation();
      const [MCTestId] = useState(location?.state?.mctestid);
      const [MCTest, setMCTest] = useState();
      const [testingTime, setTestingTime] = useState();
      const [listSubmitAnswer, setListSubmitAnswer] = useState([]);
      const [submitValue, setSubmitValue] = useState({});
      const [totalPages, setTotalPages] = useState(0);
      const [page, setPage] = useState(0);
      const [size] = useState(12);
      const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

      const handleOpenConfirmDialog = () => {
            setOpenConfirmDialog(true);
      };

      const handleCloseConfirmDialog = () => {
            setOpenConfirmDialog(false);
      };

      const handleConfirmSubmit = () => {
            handleSubmit();
            setOpenConfirmDialog(false);
      };
      useEffect(() => {
            document.title = t('Testing');
      }, []);

      useEffect(() => {
            if (!MCTestId) {
                  navigate(Path.HOME);
                  return;
            }
            getMyScoreService(MCTestId)
                  .then(() => navigate(Path.SCORE_DETAIL.replace(':testId', MCTestId)))
                  .catch(() => {
                        getDoMultipleChoiceTestService(MCTestId, page, undefined, undefined, size)
                              .then((res) => {
                                    setMCTest(res.data);
                                    setTotalPages(res.data.questions.totalPages);
                                    const initialSubmitAnswers = res.data.questions.content.map((question) => ({
                                          questionId: question.id,
                                          answer: "",
                                    }));

                                    setListSubmitAnswer((prevList) => {
                                          const newAnswers = initialSubmitAnswers.filter(
                                                (newAnswer) => !prevList.some((answer) => answer.questionId === newAnswer.questionId)
                                          );
                                          return [...prevList, ...newAnswers];
                                    });
                              })
                              .catch(console.error);
                  });
      }, [page, MCTestId, navigate, size]);

      useEffect(() => {
            if (!MCTestId) return;
            trackMyTestService(MCTestId)
                  .then((res) => {
                        if (!res.hasOwnProperty('data')) return createTestTrackingService(MCTestId);
                        return res;
                  })
                  .then((res) => {
                        setTestingTime(secondsDiff(new Date(res.data.dueTime), new Date()));
                  })
                  .catch(console.error);
      }, [MCTestId]);

      useEffect(() => {
            if (testingTime <= 0) {
                  handleSubmit();
                  return;
            }
            const intervalId = setInterval(() => setTestingTime((prev) => prev - 1), 1000);
            return () => clearInterval(intervalId);
      }, [testingTime]);

      const handleChooseAnswer = useCallback((questionId, value) => {
            setListSubmitAnswer((prevAnswers) => {
                  const updatedAnswers = prevAnswers.map((item) =>
                        item.questionId === questionId ? { ...item, answer: value } : item
                  );
                  if (!updatedAnswers.some((item) => item.questionId === questionId)) {
                        updatedAnswers.push({ questionId, answer: value });
                  }
                  console.log(updatedAnswers);
                  return updatedAnswers;
            });
            
          
      }, []);
      useEffect(() => {
            console.log(listSubmitAnswer)
            setSubmitValue({
                multipleChoiceTestId: MCTestId,
                submittedAnswers: listSubmitAnswer,
            });
        }, [listSubmitAnswer, MCTestId]); 
      const handleSubmit = () => {
            submitMCTestService(submitValue)
                  .then(() => navigate(Path.SCORE_DETAIL.replace(':testId', MCTestId)))
                  .catch(console.log)
                  .finally(() => navigate(Path.SCORE_DETAIL.replace(':testId', MCTestId)));
      };

      return (
            <>
                  <div className='fixed z-50 ml-5 bg-white mt-5 py-1 px-5 flex justify-start items-center opacity-95 rounded-lg select-none'>
                        <h3 className='text-[35px] font-bold'>{secondsToTime(testingTime).m} : {secondsToTime(testingTime).s}</h3>
                  </div>
                  <div className='min-h-screen h-full bg-repeat p-5 flex justify-center' style={{ backgroundImage: `url(${classroomPNG})` }}>
                        <div className='bg-white opacity-95 min-h-screen h-full w-[80%] pt-6 rounded-lg select-none'>
                              <div onClick={() => navigate(-1)} className='flex justify-start items-center ml-10 cursor-pointer w-fit rounded-lg p-1'>
                                    <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to the previous page')}
                              </div>
                              <div className='flex justify-center items-center opacity-95 rounded-lg select-none'>
                                    <div className='w-[80%] min-h-screen h-full opacity-95 rounded-lg select-none'>
                                          <div className='pl-10 rounded-lg select-none bg-slate-200'>
                                                {MCTest?.questions?.content?.map((ques, index) => (
                                                      
                                                      <div key={index} className='pt-10'>
                                                            <QuizQuestion indexQuestion={index + page * size} question={ques} handleChooseAnswer={handleChooseAnswer} showScore={false} listSubmitAnswer={listSubmitAnswer} />
                                                      </div>
                                                ))}
                                                <div className='flex justify-end items-center opacity-95 px-10 py-5 rounded-lg select-none mr-10 mt-1'>
                                                      <div className='flex justify-center p-5 pb-20'>
                                                            <Pagination count={totalPages} defaultPage={1} onChange={(e, value) => setPage(value - 1)} boundaryCount={2} />
                                                      </div>
                                                      <div onClick={handleOpenConfirmDialog} className='hover:bg-black hover:text-white flex select-none cursor-pointer justify-center items-center rounded-lg border-[3px] py-2 px-5 bg-white border-black'>
                                                            {t('Submit')}
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}
                        fullWidth
                        maxWidth={false}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto ">
                              <DialogTitle className="text-2xl font-semibold text-center text-gray-800 py-4 border-b border-gray-200">{t('Confirm submit test')}</DialogTitle>
                              <DialogContent className="px-6 py-4">
                                    {listSubmitAnswer.map((answer, index) => (
                                          <div key={index} className="py-2 border-b border-gray-200">
                                                <p className="text-lg text-gray-700">{index + 1}. {t('Saved')}</p>
                                          </div>
                                    ))}
                              </DialogContent>
                              <DialogActions className="px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                                    <Button onClick={handleCloseConfirmDialog} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                          {t('Cancel')}
                                    </Button>
                                    <Button onClick={handleConfirmSubmit} color="primary" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                          {t('Submit')}
                                    </Button>
                              </DialogActions>
                        </div>
                  </Dialog>


            </>
      );
}

export default DoMCTest;
