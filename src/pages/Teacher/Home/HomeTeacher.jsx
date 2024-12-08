import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { add, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, parse, startOfToday } from 'date-fns';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAllSubjectManagementService, getMCTestOfSubjectManagerAroundTwoWeekService, getReportTeacherTotalService } from '../../../services/ApiService';
import { toast } from 'react-toastify';
import Path from '../../../utils/Path';

export default function HomeTeacher() {
    const { t } = useTranslation();
    const navigate=useNavigate();
    document.title = t('Teacher home');
    const [reportTotal,setReport]=useState({
         totalTests:0,
         totalSubjects:0,
         totalStudents:0,
         totalQuestions:0,
    })
    const [subjects, setSubjects] = useState(['Math', 'Physics', 'Chemistry', 'Biology']); 
    const [upcomingTests, setUpcomingTests] = useState([
        { subject: 'Math Test - Class 10A', date: new Date(2023, 9, 12, 10, 0) },
        { subject: 'Physics Test - Class 12B', date: new Date(2023, 9, 15, 13, 0) },
        { subject: 'Chemistry Test - Class 11C', date: new Date(2023, 9, 18, 9, 0) },
    ]);
    const [tests, setTests] = useState([
        { id: 1, subject: 'Math', startDate: new Date(2024, 11, 3, 10, 0), endDate: new Date(2024, 11, 4, 10, 0) },
        { id: 2, subject: 'Physics', startDate: new Date(2024, 11, 3, 10, 0), endDate: new Date(2024, 11, 7, 10, 0) },
        { id: 3, subject: 'Chemistry', startDate: new Date(2024, 11, 3, 10, 0), endDate: new Date(2024, 11, 3, 10, 0) },
    ]);
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    console.log(format(today, 'dd-MMM-yyyy'));
    const daysInMonth = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const handlePreviousMonth = () => {
        const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayPreviousMonth, 'MMM-yyyy'));
    };

    const handleNextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };


    const selectedDayTests = tests.filter(test => isSameDay(test.startDate, selectedDay));
    const selectedDayEndedTests = tests.filter(test => isSameDay(test.endDate, selectedDay));

    const getReportTeacherTotal=()=>{
        getReportTeacherTotalService().then(res=>{
            setReport(res.data)
        }).catch(e=>{
            console.log(e);
        })
    }

    const getAllSubjectManagement=(page, sortType, column, size, search ,isPrivate)=>{
        getAllSubjectManagementService(page, sortType, column, size, search ,isPrivate).then(res =>
            {
            setSubjects(res.data.content)
        }).catch(e =>{
            toast.error(t("Get list management subject fail !"), { position: toast.POSITION.TOP_RIGHT })
        })
    }

    const getMCTestOfSubjectManagerAroundTwoWeek=()=>{
        getMCTestOfSubjectManagerAroundTwoWeekService(0, undefined, undefined, 100, undefined)
        .then(res => {
            setTests(res.data)
        }).catch(e=>{
            console.log(e);
            toast.error(t("Get list test around two week fail !"), { position: toast.POSITION.TOP_RIGHT })
        })
    }

    useEffect(() => {
        getReportTeacherTotal();
        getAllSubjectManagement(undefined,undefined,undefined,6,undefined,false);
        getMCTestOfSubjectManagerAroundTwoWeek();
    }, []);

    return (
        <div className='h-full w-full grid gap-8 p-6 bg-gray-100'>
            {/* Section: Overview */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <DashboardCard color='bg-blue-500' title={t('Number of subjects being management')} count={reportTotal.totalSubjects} />
                <DashboardCard color='bg-green-500' title={t('Number of questions created')} count={reportTotal.totalQuestions} />
                <DashboardCard color='bg-purple-500' title={t('Number of tests created')} count={reportTotal.totalTests} />
                <DashboardCard color='bg-yellow-500' title={t('Number of students being taught')} count={reportTotal.totalStudents} />
            </div>

            {/* Section: Notifications */}
            {/* <div className='bg-white p-6 rounded-lg shadow-md'>
                <SectionTitle title={t('Recent Notifications')} />
                {notifications.length > 0 ? (
                    <ul className='space-y-3'>
                        {notifications.map((notification, index) => (
                            <NotificationCard key={index} message={notification.message} date={notification.date} />
                        ))}
                    </ul>
                ) : (
                    <p className='text-gray-500'>{t('No new notifications')}</p>
                )}
            </div> */}
            {/* Section: Subject List */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <SectionTitle title={t('Subject management')} />
                <ul className='space-y-3'>
                    
                    {subjects.length>0 && subjects.map((subject, index) => (
                        <li key={index} onClick={()=>navigate(Path.TEACHER_SUBJECT_DETAIL.replace(':subjectId', subject.id))}className='p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200'>
                            {subject.subjectName}
                        </li>
                    ))}
                    {
                        subjects.length <=0 && (
                            <p className='text-gray-500'>{t("You don't currently manage any subjects.")}</p>
                        )
                    }
                </ul>
               
                {subjects.length >= 4 && (
                    <div className="mt-4 text-center">
                        <NavLink
                            to={Path.TEACHER_SUBJECTS_MANAGE}
                            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            {t('View all subject')}
                        </NavLink>
                    </div>
                )}
            </div>
            {/* Calendar */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold text-gray-700 mb-4'>{t('Calendar')}</h2>
                <div className='flex items-center justify-between mb-4'>
                    <button onClick={handlePreviousMonth} className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {t('Previous month')}
                    </button>
                    <h2 className='text-lg font-semibold'>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
                    <button onClick={handleNextMonth} className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {t('Next month')}
                    </button>
                </div>
                <div className='grid grid-cols-7 text-center text-gray-500 mb-2'>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className='grid grid-cols-7 gap-2'>
                    {daysInMonth.map((day, index) => (
                        <div key={index} className="relative">
                            <button
                                onClick={() => setSelectedDay(day)}
                                className={`py-2 w-full rounded-full ${isSameDay(day, selectedDay) ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${!isSameMonth(day, firstDayCurrentMonth) ? 'text-gray-400' : 'text-gray-700'
                                    } hover:bg-blue-300`}
                            >
                                {format(day, 'd')}
                            </button>
                            {/* Dot indicators */}
                            <div className="absolute top-0 right-0 mt-1 mr-1 flex space-x-1">
                                {tests.some(test => isSameDay(test.startDate, day)) && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                )}
                                {tests.some(test => isSameDay(test.endDate, day)) && (
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Selected Day Tests */}
            <section className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='font-semibold text-black mb-4'>{t('Schedule start exams for')} {format(selectedDay, 'MMM dd, yyyy')}</h2>
                <ul className='space-y-2'>
                    {
                        selectedDayTests.length > 0 ? (<>
                            {
                            selectedDayTests.slice(0, 3).map(test => (
                                <TestDetail key={test.id} test={test} />
                            ))
                            }
                        </>) : (
                            <p className='text-gray-500'>{t('There are no exams for this date.')}</p>
                        )
                    }

                </ul>
                {selectedDayTests.length >= 2 && (
                    <div className="mt-4 text-center">
                        <NavLink
                            to={`/all-tests?date=${selectedDay}`}
                            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            {t('View all tests')}
                        </NavLink>
                    </div>
                )}
            </section>

            {/* Selected Day Ended Tests */}
            <section className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='font-semibold text-red-600 mb-4'>{t('Schedule due date exams for')} {format(selectedDay, 'MMM dd, yyyy')}</h2>
                <ul className='space-y-2'>
                {
                        selectedDayEndedTests.length > 0 ? (<>
                            {
                            selectedDayEndedTests.slice(0, 3).map(test => (
                                <TestDetail key={test.id} test={test} />
                            ))
                            }
                        </>) : (
                            <p className='text-gray-500'>{t('There are no exam deadlines for this date.')}</p>
                        )
                    }
                </ul>
                {selectedDayEndedTests.length > 3 && (
                    <div className="mt-4 text-center">
                        <NavLink
                            to={`/all-tests?date=${selectedDay}&ended=true`}
                            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            {t('View all due tests')}
                        </NavLink>
                    </div>
                )}
            </section>

            {/* Section: Calendar */}
            {/* <div className='bg-white p-6 rounded-lg shadow-md'>
                <SectionTitle title={t('Select Date')} />
                <div className='flex items-center justify-between mb-4'>
                    <button onClick={handlePreviousMonth} className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {t('Previous Month')}
                    </button>
                    <h2 className='text-lg font-semibold'>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
                    <button onClick={handleNextMonth} className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {t('Next Month')}
                    </button>
                </div>
                <div className='grid grid-cols-7 text-center text-gray-500 mb-2'>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className='grid grid-cols-7 gap-2'>
                    {daysInMonth.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(day)}
                            className={`py-2 rounded-full ${isSameDay(day, selectedDay) ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${!isSameMonth(day, firstDayCurrentMonth) ? 'text-gray-400' : 'text-gray-700'
                                } hover:bg-blue-300`}
                        >
                            {format(day, 'd')}
                        </button>
                    ))}
                </div>
            </div>
            {/* Section: Upcoming Tests */}
            {/* <div className='bg-white p-6 rounded-lg shadow-md'>
                <SectionTitle title={t('Upcoming Test Schedule')} />
                <ul className='space-y-3'>
                    {upcomingTests.map((test, index) => (
                        <TestScheduleCard key={index} subject={test.subject} date={test.date} />
                    ))}
                </ul>
            </div>  */}
        </div>
    );
}

// Component hiển thị từng thẻ dữ liệu tổng quan
function DashboardCard({ color, title, count }) {
    return (
        <div className={`${color} flex flex-col items-center justify-center h-28 p-4 rounded-lg text-white shadow-lg transform hover:scale-105 transition-transform duration-200`}>
            <h2 className='text-lg font-semibold text-center'>{title}</h2>
            <p className='text-3xl font-bold'>{count}</p>
        </div>
    );
}

// Component hiển thị tiêu đề từng phần
function SectionTitle({ title }) {
    return (
        <h2 className='text-xl font-semibold text-gray-700 border-b pb-2 mb-4'>{title}</h2>
    );
}
function TestDetail({ test }) {
    const { t } = useTranslation();
    return (
        <li className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200">
            <p className="font-medium text-gray-700">{test.testName}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{t('Start')}: {format(test.startDate, 'h:mm a')}</span>
                <span>{t('End')}: {format(test.endDate, 'h:mm a')}</span>
            </div>
            <p>{t('Subject')}: {test.subjectName}</p>
        </li>
    );
}
// Component hiển thị từng thông báo
function NotificationCard({ message, date }) {
    return (
        <li className='p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200'>
            <p className='text-gray-700'>{message}</p>
            <span className='text-xs text-gray-400'>{format(new Date(date), 'dd MMM yyyy, HH:mm')}</span>
        </li>
    );
}

// Component hiển thị lịch bài kiểm tra sắp tới
function TestScheduleCard({ subject, date }) {
    return (
        <li className='p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200'>
            <div className='flex justify-between'>
                <p className='text-blue-700 font-medium'>{subject}</p>
                <span className='text-sm text-blue-500'>{format(new Date(date), 'dd MMM yyyy, HH:mm')}</span>
            </div>
        </li>
    );
}
