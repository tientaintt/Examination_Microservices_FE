import React, { useEffect, useState } from 'react'
import Button from '../../../components/form-controls/Button/Button';
import InputField from '../../../components/form-controls/InputField/InputField';
import { Modal } from 'flowbite-react';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import PaginationNav from '../../../components/pagination/PaginationNav';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { addTeacherManageSubjectService, deleteStudentOfClassroomService, exportListStudentOfClassService, getAllActiveStudentService, getAllActiveTeacherService, getAllTeacherOfClassService, getAllVerifiedTeacherService, removeCredential } from '../../../services/ApiService';
import Path from '../../../utils/Path';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ID_SUBJECT = 'subjectId';
const ID_TEACHER = 'teacherId';

const Teachermanager = ({ idSubject ,selectTeacher }) => {
  const { t } = useTranslation();
  document.title = t('Teacher management');
  
  const [isAddConfirm, setIsAddConfirm] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [listAllTeacher, setlistAllTeacher] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [offset, setOffset] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [teacherSelect, setTeacherSelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [checkselectTeacher, setCheckselectTeacher] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  const initialValue = {
    [ID_SUBJECT]: '',
    [ID_TEACHER]: ''
  };

  const handleClose = () => {
    setCheckselectTeacher(true);
   
    if (isAddConfirm)
      setIsAddConfirm(false);
    if (isDelete)
      setIsDelete(false);
  }



  const handleClickDelete = (item) => {
    setIsDelete(true);
    setTeacherSelect(item);
  }

  const handleClickAddConfirm = (item) => {
    console.log(item)
    setIsAddConfirm(true);
    setTeacherSelect(item);
  }

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: initialValue,
    criteriaMode: "firstError",
  })

  const submitForm = (body) => {
    handleClose();
    
    if (isAddConfirm)
      addTeacherManageSubject(body);
    else if (isDelete) {
      toast.success(t('Delete student of subject successfuly !'), {
        position: toast.POSITION.TOP_RIGHT
      })
     
    }
  }


  const addTeacherManageSubject = (body) => {
    addTeacherManageSubjectService(body).then((res) => {
      selectTeacher();
      toast.success(t('Add teacher manage for subject successfuly !'), {
        position: toast.POSITION.TOP_RIGHT
      })
    }).catch((error) => {
      toast.error(t('Add teacher manage for subject fail !'), {
        position: toast.POSITION.TOP_RIGHT
      })
      removeCredential();
      navigate(Path.LOGIN);
    })
  }

  const handleClickPage = (index) => {
    setActiveIndex(index);
    getAllTeacher(index);
  };

  const handlePrevious = (index) => {

    setActiveIndex(index - 1);
    getAllTeacher(index - 1);
  }

  const handleNext = (index) => {

    setActiveIndex(index + 1);
    getAllTeacher(index + 1);
  }
  const handleClickExport = () => {
    exportListStudentOfClassService(idSubject, "excel").then((res) => {
      console.log(res)
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Student.xlsx`); // Tên file
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Giải phóng URL để tránh rò rỉ bộ nhớ
      window.URL.revokeObjectURL(url);
      console.log("successeee")

    }).catch((e) => {
      console.log(e)
    })
  }
  const handleSearch = (data) => {
    console.log(data)
    if (selectTeacher && idSubject)
      getAllVerifiedTeacherService(undefined, undefined, undefined, undefined, data).then((res) => {
        setlistAllTeacher(res.data.content);
        setIsLast(res.data.last);
        setIsFirst(res.data.first);

        const pageNumbers2 = [];
        for (let i = 1; i <= res.data.totalPages; i++) {
          pageNumbers2.push(i);
        }
        setPageNumbers(pageNumbers2);
        setTotalElements(res.data.totalElements);
        setOffset(res.data.pageable?.offset);
        setNumberOfElements(res.data.numberOfElements);
        setIsLoading(false);
      }).catch((error) => {
        setIsLoading(false);
        toast.error(t('Search student fail !'), {
          position: toast.POSITION.TOP_RIGHT,
        });
        removeCredential();
        navigate(Path.LOGIN);
      });
    else {
      getAllActiveTeacherService(undefined, undefined, undefined, undefined, data).then((res) => {
        setlistAllTeacher(res.data.content);
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
        toast.error(t('Get teacher fail !'), {
          position: toast.POSITION.TOP_RIGHT,
        });
        removeCredential();
        navigate(Path.LOGIN);
      });
      
    }
  }

 

  const getAllVerifiedTeacher = (page, sortType, column, size, search) => {
    getAllVerifiedTeacherService(page, sortType, column, size, search).then((res) => {
      setlistAllTeacher(res.data.content);
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
      toast.error(t('Get a list of failed verified teachers!'), {
        position: toast.POSITION.TOP_RIGHT,
      });
      removeCredential();
      navigate(Path.LOGIN);
    });
  }

  const getAllTeacher = (page, sortType, column, size, search) => {
    if (selectTeacher&& idSubject)
      getAllVerifiedTeacher(page, sortType, column, size = 6, search);
    else if(!idSubject ){
      getAllActiveTeacher(page, sortType, column, size , search);
    }

  }
  const getAllActiveTeacher=(page, sortType, column, size, search)=>{
    getAllActiveTeacherService(page, sortType, column, size, search).then((res) => {
      setlistAllTeacher(res.data.content);
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
      toast.error(t('Get teacher fail !'), {
        position: toast.POSITION.TOP_RIGHT,
      });
      removeCredential();
      navigate(Path.LOGIN);
    });
  }
  const isActive = (index) => {
    return index === activeIndex;
  };

  useEffect(() => {

    getAllTeacher();
  }, [checkselectTeacher]);


  return (
    <>
      <div className=" p-4 h-full min-h-[550px] w-full flex-row flex justify-center">
        <div className="pb-4 dark:border-gray-700">
          {((idSubject && selectTeacher)) && <>
            <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
              {t('List teacher verified')}
            </div>
          </>}
          {((!idSubject && !selectTeacher) && <>
            <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
              {t('All teachers')}
            </div>
          </>)}

          <div className="flex items-center justify-start h-auto mb-4 bg-gray-100">
            <div className=" overflow-auto shadow-md sm:rounded-lg">
              <div className='p-3 items-center flex gap-4 justify-between mb-[14px]'>
                <div onClick={() => navigate(-1)}
                  className='top 0 flex justify-start items-center cursor-pointer w-fit rounded-lg p-5'>
                  <FontAwesomeIcon className='mr-3' icon={faLeftLong} /> {t('Back to previous page')}
                </div>
                {/* <Toggle checked={isModeActive} handleToggle={setIsModeActivate} >{isModeActive ? 'Active' : 'Inactive'}</Toggle> */}
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pl-3 ">
                    <Button handleOnClick={() => { handleSearch(searchData) }} >
                      <svg className="w-5 h-5 text-white dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </Button>
                  </div>
                  <input onChange={(e) => { setSearchData(e.target.value) }} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t("Search for items")} />
                </div>
                <div className='flex gap-4  items-center justify-between'>
                  {idSubject && selectTeacher && (
                    <div className='w-full flex flex-row'>
                      {/* <Button className="bg-blue-800 w-auto mr-1" handleOnClick={() => { handleClickAdd() }}>{t('Add teacher manager to subject')}</Button> */}
                      {/* <Button className="bg-green-500 w-auto " handleOnClick={() => { handleClickExport() }}>{t('Export list student of subject')}</Button> */}
                    </div>
                  )}

                </div>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>

                    <th scope="col" className="px-6 py-3 w-[150px]">
                      {t('ID teacher')}
                    </th>
                    <th scope="col" className={clsx("px-6 py-3 w-[300px]")} >
                      {t('Teacher name')}
                    </th>
                    <th scope="col" className="px-6 py-3 w-[400px]">
                      {t('Email')}
                    </th>
                    {!selectTeacher ?
                      (
                        <>

                          <th scope="col" className="px-6 py-3 w-[200px]">
                            {t('Email verified')}
                          </th>
                          <th scope="col" className="px-6 py-3 w-[70px]">
                            {t('Active')}
                          </th>
                        </>
                      )
                      :
                      (!idSubject && (<>
                        <th scope="col" className="px-6 py-3 w-[200px]">
                          {t('Email verified')}
                        </th>
                        <th scope="col" className="px-6 py-3 w-[70px]">
                          {t('Active')}
                        </th>
                      </>))
                    }
                    {idSubject && (<th scope="col" className="px-6 py-3 w-[150px]">
                      {t('Action')}
                    </th>)}
                  </tr>
                </thead>
                <tbody>
                  {
                    !isLoading &&
                    (listAllTeacher.length !== 0 && (
                      listAllTeacher.map(
                        (item, index) => {
                          console.log(item)
                          return (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                              <th scope="row" className="w-[150px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                {item.id}
                              </th>
                              <td className={clsx("px-6 py-3 w-[300px]")}>
                                <p className="cursor-pointer font-medium dark:text-blue-500 hover:underline max-w-[300px] line-clamp-1" title={item.displayName}>{item.displayName}</p>
                              </td>
                              <td className="px-6 py-4 w-[400px] " >
                                <p className=" truncate font-medium  w-full line-clamp-1" title={item.emailAddress}>{item.emailAddress}</p>
                              </td>
                              {!selectTeacher ? (<>

                                <td className="px-6 py-4 w-[200px]">
                                  <div className="flex items-center">
                                    {
                                      item.isEmailAddressVerified === true ? (<><div className="h-2.5 w-2.5 rounded-full  bg-green-500 mr-2"></div>
                                        {t('Verified')}</>
                                      ) : (<><div className="h-2.5 w-2.5 rounded-full  bg-red-500 mr-2"></div>{t('Unverified')}</>)
                                    }
                                  </div>
                                </td>
                                <td className="px-6 py-4 w-[70px]">
                                  <div className="flex items-center">
                                    {
                                      item.isEnable === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                        {t('Active')}</>
                                      ) : (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> {t('Inactive')}</>)
                                    }
                                  </div>
                                </td></>) : (!idSubject && (<>

                                  <td className="px-6 py-4 w-[200px]">
                                    <div className="flex items-center">
                                      {
                                        item.isEmailAddressVerified === true ? (<>
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500  mr-2">{t('Verified')}</div>
                                          </>
                                        ) : (<><div className="h-2.5 w-2.5 rounded-full bg-red-500  mr-2"></div>{t('Unverified')}</>)
                                      }
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 w-[70px]">
                                    <div className="flex items-center">
                                      {
                                        item.isEnable === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                          {t('Active')}</>
                                        ) : (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> {t('Inactive')}</>)
                                      }
                                    </div>
                                  </td></>))}
                              {selectTeacher  && idSubject && (
                                <td className="px-6 py-4 flex w-[150px]">
                                  <p onClick={() => { handleClickAddConfirm(item) }} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('Add teacher manager to subject')}</p>
                                </td>)

                              }
                              {/* {selectTeacher === true && idSubject && (
                                <td className="px-6 py-4 flex w-[150px]">

                                  <p onClick={() => { handleClickDelete(item) }} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('Delete')}</p>

                                </td>)

                              } */}
                            </tr>
                          )
                        }
                      )
                    )
                    )
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
            </>) : (listAllTeacher.length === 0 && (<>
              <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                <div className="text-center">
                  <h1
                    className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  >
                    Uh-oh!
                  </h1>
                  <p className="mt-4 text-gray-500">{t('We cannot find any teachers.')}</p>
                </div>
              </div>
            </>))
          }
        </div>
        
        {isAddConfirm && (
          <>
            <Modal className="bg-opacity-60  z-[101]" show={true} theme={{ 'content': { 'base': 'w-1/4 ' } }} popup onClose={() => handleClose()} >
              <Modal.Header />
              <Modal.Body>
                <form onSubmit={form.handleSubmit(submitForm)}
                  className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                >
                  <InputField name={ID_SUBJECT} disabled form={form} defaultValue={idSubject} />
                  <InputField name={ID_TEACHER} disabled form={form} defaultValue={teacherSelect.id} />
                  <p className="text-center text-[20px] font-medium text-lime-400 uppercase"> {t('Alert')} </p>
                  <h1 className='text-[16px] text-center'>{t('Are you sure you want to add this teacher as the manager of this subject?')}</h1>
                  <div className='invisible py-3'></div>
                  <div className='flex gap-3'>
                    <Button className="bg-blue-500" type='submit'>{t('Confirm')}</Button>
                    <Button handleOnClick={() => handleClose()} className="bg-yellow-300">{t('Cancel')}</Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal></>)
        }

        {isDelete && (
          <>
            <Modal className="bg-opacity-60  z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
              <Modal.Header />
              <Modal.Body>
                <form onSubmit={form.handleSubmit(submitForm)}
                  className="relative mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                >
                  <InputField name={ID_SUBJECT} disabled form={form} defaultValue={idSubject} />
                  <InputField name={ID_TEACHER} disabled form={form} defaultValue={teacherSelect.id} />
                  <p className="text-center text-[20px] font-medium text-yellow-400 uppercase"> {t('Alert')} </p>
                  <h1 className='text-[16px] text-center'>{t('Are you sure want to remove this student from current subject ?')}</h1>
                  <div className='invisible py-3'></div>
                  <div className='flex gap-3'>
                    <Button className="bg-red-500" type='submit'>{t('Confirm')}</Button>
                    <Button handleOnClick={() => handleClose()} className="bg-blue-400">{t('Cancel')}</Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal></>)
        }
      </div >
    </ >

  )
}
export default React.memo(Teachermanager)
