import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import subjectPNG from '../../../assets/classroomPNG.png';
import subjectAVT from '../../../assets/classroom_avatar.png';
import { getSubjectByIdService, getMCTestsOfSubjectService } from '../../../services/UserService';
import { DESCREASE, INSCREASE } from '../../../utils/Constant';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import { Pagination } from '@mui/material';
import { Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import { format, isSameDay, startOfToday, startOfTomorrow } from 'date-fns';
import Path from '../../../utils/Path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const TEST_NAME = 'test_name';
const START_DATE = 'start_date';
const END_DATE = 'end_date';

function SubjectDetail() {
      const {t}=useTranslation();
      const navigate = useNavigate();
      document.title = t('Subject detail');
      const { subjectId } = useParams();
      const [subject, setSubject] = useState({});
      const [MCTests, setMCTests] = useState([]);

      let today = startOfToday();
      let tomorrow = startOfTomorrow();
      // Default value to get request
      const [page, setPage] = useState(0);
      const [sortType, setSortType] = useState(INSCREASE);
      const [size, setSize] = useState(4);
      const [column, setColumn] = useState(END_DATE);
      const [search, setSearch] = useState('');
      const [isEnded, setIsEnded] = useState(false);
      //////////////////////////////
      const [totalPages, setTotalPages] = useState(0)
      const [totalElements, setTotalElements] = useState(0)
      /////////////////////////////

      const handleSortType = (asc) => {
            setSortType(asc)
      }
      const handleSortBy = (column) => {
            setColumn(column)
      }
      const handlePage = (event, value) => {
            setPage(value - 1)
      }
      const onSearchChange = (searchText) => {
            setSearch(searchText)
      }
      // True if sreach non-started tests
      const getToggle = (isToggle) => {
            setIsEnded(isToggle)
      }
      useEffect(() => {
            getMCTestsOfSubjectService(subjectId, page, sortType, column, size, search, isEnded)
                  .then((res) => {
                        setMCTests(res.data.content)
                        setPage(res.data.number)
                        setTotalPages(res.data.totalPages)
                        setTotalElements(res.data.totalElements)
                  })
                  .catch(err => {
                        setMCTests([])
                  })
      }, [page, sortType, column, isEnded])
      useEffect(() => {
            console.log("subjectId ", subjectId);
            getSubjectByIdService(subjectId)
                  .then((res) => {
                        console.log(res.data)
                        setSubject(res.data)
                  })
                  .catch(err => {
                        setSubject(null)
                  })
            getMCTestsOfSubjectService(subjectId, page, sortType, column, size, search, isEnded)
                  .then((res) => {
                        setMCTests(res.data.content)
                        setPage(res.data.number)
                        setTotalPages(res.data.totalPages)
                        setTotalElements(res.data.totalElements)
                  })
                  .catch(err => {
                        setMCTests([])
                  })

      }, [subjectId])
      const handleSearch = () => {
            getMCTestsOfSubjectService(subjectId, 0, sortType, column, size, search, isEnded)
                  .then((res) => {
                        setMCTests(res.data.content)
                        setPage(res.data.number)
                        setTotalPages(res.data.totalPages)
                        setTotalElements(res.data.totalElements)
                  })
                  .catch(err => {
                        setMCTests([])
                  })
      }
      return (
            <>
                  <div className={clsx(MCTests?.length > 2 ? 'h-full' : 'h-screen', "bg-repeat p-5 flex justify-center ")} style={{ backgroundImage: "url(" + subjectPNG + ")" }}>
                        <div className='bg-white opacity-95 h-full w-[80%] pt-6 rounded-lg ' >
                              <div onClick={() => navigate(-1)}
                                    className='flex justify-start items-center ml-10 cursor-pointer select-none w-fit rounded-lg p-1'>
                                    <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to the previous page')}
                              </div>
                              {subject ?
                                    <>
                                          <div className='bg-white opacity-100 flex justify-center pb-10'>

                                                <div className=" flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row w-[80%] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                                      <img className="px-2 object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={subjectAVT} alt="" />
                                                      <div className="flex flex-col justify-between p-4 leading-normal">
                                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{subject.subjectName}</h5>
                                                            <p className="mb-3 font-bold text-gray-700 dark:text-gray-400">{subject.subjectCode}</p>
                                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{subject.description}</p>
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
                                                      <p className="mt-4 text-gray-500">{t('We cannot find any test.')}</p>
                                                </div>
                                          </div>
                                    </>}
                              <div className=" flex justify-end pr-5">
                                    <div className='flex items-center pr-5 '>
                                          <Toggle handleToggle={getToggle} >{t('Get ended tests.')}</Toggle>
                                    </div>
                                    <p className='flex items-center pr-5 '>{t('Sort by')}:</p>
                                    <div className="flex items-center pr-5 w-48">

                                          <select onChange={(e) => handleSortBy(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value={END_DATE}>{t('End date')}</option>
                                                <option value={START_DATE}>{t('Start date')}</option>
                                                <option value={TEST_NAME}>{t('Exam name')}</option>
                                          </select>

                                    </div>
                                    <p className='flex items-center pr-5 '>{t('Sort type')}:</p>
                                    <div className="flex items-center pr-5 w-48">

                                          <select onChange={(e) => handleSortType(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value={INSCREASE}>{t('Increase')}</option>
                                                <option value={DESCREASE}>{t('Decrease')}</option>
                                          </select>

                                    </div>
                                    <label htmlFor="default-search" className="w-auto mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                    <div className="relative w-80">
                                          <input onChange={(e) => onSearchChange(e.target.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Test name" required />
                                          <button onClick={() => handleSearch()} className="text-white absolute end-2.5 bottom-2.5 bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                {t('Search')}</button>
                                    </div>
                              </div>
                              <div className=" flex justify-start pl-20">
                                    <p className='flex items-center pr-5 '>{t('Found total')} {totalElements} {t('results')}</p>
                              </div>
                              {MCTests?.length > 0 ?
                                    <>

                                          <div className='pt-3 flex justify-start flex-wrap gap-2  px-20 md:px-10 sm:px-32'>
                                                {MCTests?.map((MCTest, key) => {
                                                      return <Card onClick={() => navigate(Path.PREPARE_TEST.replace(':testId', MCTest.id))}
                                                            key={key} className={` hover:bg-slate-300 w-full px-5 py-2 bg-slate-100 rounded-md border-l-[10px] border-gray-300
            ${isSameDay(MCTest.endDate, today) ? ' text-black border-red-500' : ''}
            ${isSameDay(MCTest.endDate, tomorrow) ? ' text-black border-yellow-100 ' : ''}`}>
                                                            <CardBody className=''>

                                                                  <Typography variant="h5" color="blue-gray" className="flex items-center">
                                                                        {MCTest.testName}
                                                                  </Typography>
                                                                  <div className='flex justify-end items-center pt-2 '>
                                                                        <Typography className="flex items-center px-10 ">
                                                                              <strong className='pr-3'>{t('Time to start')}: </strong> {format(MCTest.startDate, `h:mm a (dd/MM) `)}
                                                                        </Typography>
                                                                        <Typography className={`flex items-center px-10 `}>
                                                                              <strong className='pr-3'>{t('Time to end')}: </strong>{format(MCTest.endDate, `h:mm a (dd/MM) `)}
                                                                        </Typography>
                                                                        <Typography className="flex items-center px-1" >
                                                                              <strong className='pr-3'>{t('Test duration')}:</strong> {MCTest.testingTime} minutes
                                                                        </Typography>
                                                                  </div>

                                                            </CardBody>
                                                      </Card>
                                                })}

                                          </div>
                                          <div className='flex justify-center p-5 pb-10 '>
                                                <Pagination count={totalPages} defaultPage={1} onChange={handlePage} boundaryCount={2} />
                                          </div>
                                    </>
                                    :
                                    <>
                                          {subject ? <>
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
                                          </> : <></>}

                                    </>}

                        </div>
                  </div>
            </>
      )
}

export default SubjectDetail