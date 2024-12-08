
import React, { useEffect, useState } from 'react'
import { Pagination } from '@mui/material';
import { DESCREASE, INSCREASE } from '../../../utils/Constant';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getAllMyTestSpecifyDayService } from '../../../services/UserService';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Path from '../../../utils/Path';
import { useTranslation } from 'react-i18next';
const START_DATE='startDate';
const END_DATE='endDate';

export default function MyAllTest() {
      const {t}=useTranslation();
    document.title = t('My all tests');
    const navigate = useNavigate();
    // Default value to get request
    var dateOffset = (24 * 60 * 60 * 1000) * 15; //15 days
    const [dateFrom, setDateFrom] = useState((new Date()).getTime() - dateOffset);
    const [dateTo, setDateTo] = useState((new Date()).getTime());
    const [page, setPage] = useState(0);
    const [sortType, setSortType] = useState(INSCREASE);
    const [column, setColumn] = useState(START_DATE);
    const [size, setSize] = useState(12);
    const [search, setSearch] = useState('');
    ///////////////////
    const [myTests, setmyTests] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [startDate, setStartDate] = useState(new Date());
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
    useEffect(() => {
        getAllMyTestSpecifyDay(dateFrom, dateTo, page, sortType, column, size, search);
    }, [dateFrom, dateTo, page, sortType, column])

    const handleSearch = () => {
        getAllMyTestSpecifyDay(dateFrom, dateTo, 0, sortType, column, size, search);
    }
    const getAllMyTestSpecifyDay = (dateFrom, dateTo, page, sortType, column, size, search) => {
        getAllMyTestSpecifyDayService(dateFrom, dateTo, page, sortType, column, size, search)
                .then(res => {
                      console.log(res.data)
                      setmyTests(res.data.content)
                      setTotalElements(res.data.totalElements)
                      setTotalPages(res.data.totalPages)
                })
                .catch(err => {

                })
    }

    return (
          <>
                <div className='flex justify-center'>

                      <div className='w-[95%]  bg-gray-200 p-5 rounded-lg'>

                            <div className=" flex justify-end">

                                  <div className='flex items-center px-5'>
                                        <DatePicker
                                              className='rounded-md p-2 w-28'
                                              selected={dateFrom}
                                              onChange={(date) => setDateFrom(date.getTime())}
                                        />
                                        <FontAwesomeIcon className='p-2' icon={faCalendar} />
                                        <p className='px-3'>To</p>
                                        <DatePicker
                                              className='rounded-md p-2 w-28'
                                              selected={dateTo}
                                              onChange={(date) => setDateTo(date.getTime())}
                                        />
                                        <FontAwesomeIcon className='p-2' icon={faCalendar} />
                                  </div>
                                  <p className='flex items-center pr-5 '>{t('Sort by')}:</p>
                                  <div className="flex items-center pr-5 w-48">

                                        <select onChange={(e) => handleSortBy(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                              <option value={START_DATE}>{t('Start date')}</option>
                                              <option value={END_DATE}>{t('End date')}</option>
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
                                        <input placeholder="Test name" onChange={(e) => onSearchChange(e.target.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        <button onClick={() => handleSearch()} className="text-white absolute end-2.5 bottom-2.5 bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                              {t('Search')}</button>
                                  </div>
                            </div>
                            <div className=" flex justify-start pl-20">
                                  <p className='flex items-center pr-5 '>{t('Found total')} {totalElements} {t('results')}</p>
                            </div>
                            <div className='flex justify-start pt-5 flex-wrap gap-7  px-20 md:px-10 sm:px-32'>
                                  <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                        {myTests.length > 0 ? <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('Exam name')}
                                                          </th>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('Subject name')}
                                                          </th>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('Subject code')}
                                                          </th>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('Start date')}
                                                          </th>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('End date')}
                                                          </th>
                                                          <th scope="col" className="px-6 py-3">
                                                                {t('Exam time')}
                                                          </th>
                                                    </tr>
                                              </thead>
                                              <tbody>
                                                    {myTests.map((test, index) => {
                                                          return <tr key={index} onClick={() => navigate(Path.PREPARE_TEST.replace(':testId', test.id))} className="hover:bg-gray-200 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                      {test.testName}
                                                                </th>
                                                                <td className="px-6 py-4">
                                                                      {test.subjectName}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                      {test.subjectCode}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                      {format(test.startDate, 'MMM dd, yyy h:mm a')}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                {format(test.endDate, 'MMM dd, yyy h:mm a')}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                      {test.testingTime}
                                                                </td>
                                                          </tr>
                                                    })}
                                              </tbody>
                                        </table>
                                              :
                                              <>
                                                    <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                                                          <div className="text-center">
                                                                <h1
                                                                      className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                                                >
                                                                      Uh-oh!
                                                                </h1>
                                                                <p className="mt-4 text-gray-500">{t('We cannot find any test of yours.')}</p>
                                                          </div>
                                                    </div>
                                              </>
                                        }
                                  </div>
                            </div>
                      </div>

                </div>
                <div className='flex justify-center p-5 pb-20'>
                      <Pagination count={totalPages} defaultPage={1} onChange={handlePage} boundaryCount={2} />
                </div>
          </>
    )
}
