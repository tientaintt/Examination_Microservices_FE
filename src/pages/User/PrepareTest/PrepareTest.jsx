import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import classroomPNG from '../../../assets/classroomPNG.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-tailwind/react';
import { getMyScoreService, getMyMultipleChoiceTestInformationService } from '../../../services/UserService';
import { format } from 'date-fns';
import { getRoles, getAccessToken, removeCredential } from '../../../services/ApiService';
import Path from '../../../utils/Path';
import { ROLE_STUDENT } from '../../../utils/Constant';
import { useTranslation } from 'react-i18next';
function PrepareTest() {
      const {t}=useTranslation();
      document.title = t('Exam detail');
      const { testId } = useParams();
      const navigate = useNavigate();
      const [MCTest, setMCTest] = useState();
      const [score, setScore] = useState();

      if (!getAccessToken || !getRoles()?.includes(ROLE_STUDENT)) {
            removeCredential()
            navigate(Path.LOGIN)
      }

      useEffect(() => {
            getMyMultipleChoiceTestInformationService(testId)
                  .then((res) => {
                        setMCTest(res.data);
                  })
                  .catch((err) => {
                        navigate(Path.HOME)
                  })
            getMyScoreService(testId)
                  .then((res) => {
                        setScore(res.data);
                  })
                  .catch((err) => {
                  })
      }, [])

      return (
            <div className='h-screen bg-repeat p-5 flex justify-center ' style={{ backgroundImage: "url(" + classroomPNG + ")" }}>
                  <div className='bg-white opacity-95 h-full w-[80%] pt-6 rounded-lg' >
                        <div onClick={() => navigate(-1)}
                              className='flex justify-start items-center ml-10 cursor-pointer w-fit rounded-lg p-1 select-none'>
                              <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to the previous page')}
                        </div>
                        {MCTest ?
                              <>
                                    <div className='bg-slate-200 mt-5 select-none pl-16'>
                                          <h2 className='text-[40px] pt-5 flex justify-start items-center'>{MCTest.subjectName}

                                          </h2>
                                          <h4 className='text-[20px] pb-5 flex justify-start items-center'>({MCTest.subjectCode})</h4>
                                          <h4 className='text-[18px] pb-5 flex justify-start items-center'>{MCTest.subjectDescription}</h4>
                                    </div>
                                    <div className='bg-white opacity-100 flex justify-center pt-16 pb-10 '>
                                          <div className=" w-1/2 flex flex-col items-center bg-slate-100 border border-gray-200 rounded-lg shadow md:flex-row md:max-w-[80%] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                                <div className="flex flex-col w-full justify-between p-4 leading-normal">
                                                      <h5 className="flex mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                            {MCTest.testName}
                                                            {
                                                                  (MCTest?.endDate < new Date()) || score !== undefined ?
                                                                        <p className=' select-none pl-5 bg-slate-100 text-red-600 border-red-600' variant="outlined">{t('Finished')}</p>
                                                                        :
                                                                        <></>
                                                            }

                                                      </h5>
                                                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 select-none">
                                                            <strong>{t('Description')}:</strong> {MCTest.testDescription}</p>
                                                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 select-none">
                                                            <strong>{t('Opened')}:</strong> {format(MCTest.startDate, 'MMM dd, yyy  h:mm a')}</p>
                                                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 select-none">
                                                            <strong>{t('Closed')}:</strong> {format(MCTest.endDate, 'MMM dd, yyy h:mm a')}</p>
                                                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 select-none">
                                                            <strong>{t('Time to do')}:</strong> {MCTest.testingTime} minutes </p>
                                                      {MCTest?.startDate < new Date() ?
                                                            MCTest?.endDate < new Date() ?
                                                                  <NavLink to={Path.SCORE_DETAIL.replace(':testId', MCTest.id)}
                                                                        className='flex select-none cursor-pointer justify-center items-center rounded-lg border-[2px] py-1 bg-white text-red-600 border-red-600' variant="outlined">{t('Result')}</NavLink>
                                                                  :
                                                                  score !== undefined ? <>
                                                                        <NavLink to={Path.SCORE_DETAIL.replace(':testId', score.multipleChoiceTest.id)}
                                                                              className='flex select-none cursor-pointer justify-center items-center rounded-lg border-[2px] py-1 bg-white text-red-600 border-red-600' variant="outlined">{t('Result')}</NavLink>
                                                                  </> : <>
                                                                        <NavLink
                                                                              to={Path.DO_MC_TEST}
                                                                              state={{ mctestid: MCTest.id }}
                                                                              className='flex select-none cursor-pointer justify-center items-center rounded-lg border-[2px] py-1 bg-white border-black ' variant="outlined">{t('Start')}</NavLink>
                                                                  </>

                                                            :
                                                            <>
                                                            </>

                                                      }

                                                </div>
                                          </div>

                                    </div>

                              </> :
                              <>
                                    <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                          <div className="text-center">
                                                <h1
                                                      className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                                >
                                                      Uh-oh!
                                                </h1>
                                                <p className="mt-4 text-gray-500">{t('We cannot find test.')}</p>
                                          </div>
                                    </div>
                              </>}
                  </div>
            </div >
      )
}

export default PrepareTest