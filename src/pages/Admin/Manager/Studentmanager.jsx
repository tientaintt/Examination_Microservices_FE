import React, { useEffect, useState } from 'react'
import Button from '../../../components/form-controls/Button/Button';
import InputField from '../../../components/form-controls/InputField/InputField';
import { Modal } from 'flowbite-react';
import Toggle from '../../../components/form-controls/Toggle/Toggle';
import PaginationNav from '../../../components/pagination/PaginationNav';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { addStudentToClassService, deleteStudentOfClassroomService, exportListStudentOfClassService, getAllActiveStudentService, getAllStudentOfClassService, getAllVerifiedStudentService, importListStudentIntoSubjectService, removeCredential } from '../../../services/ApiService';
import Path from '../../../utils/Path';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ID_CLASSROOM = 'subjectId';
const ID_STUDENT = 'studentId';

const Studentmanager = ({ showByIdClassRoom = true }) => {
  const { t } = useTranslation();
  document.title = t('Student management');
  const { idClassRoom } = useParams();
  const [file, setFile] = useState();

  const [isAddConfirm, setIsAddConfirm] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [listAllStudent, setlistAllStudent] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [offset, setOffset] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [studentSelect, setStudentSelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [checkShowByIdClassroom, setCheckShowByIdClassroom] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isClickImport, setIsImport] = useState(false);
  const navigate = useNavigate();
  const initialValue = {
    [ID_CLASSROOM]: '',
    [ID_STUDENT]: ''
  };
  const handleClickImport = () => {
    setIsImport(true);
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleClose = () => {
    setCheckShowByIdClassroom(true);
    if (isAdd)
      setIsAdd(false);
    if (isAddConfirm)
      setIsAddConfirm(false);
    if (isDelete)
      setIsDelete(false);
    if (isClickImport)
      setIsImport(false);
    setFile(undefined);
  }

  const handleClickAdd = () => {
    setIsAdd(true);
  }

  const handleClickDelete = (item) => {
    setIsDelete(true);
    setStudentSelect(item);
  }

  const handleClickAddConfirm = (item) => {
    console.log(item)
    setIsAddConfirm(true);
    setStudentSelect(item);
  }

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: initialValue,
    criteriaMode: "firstError",
  })

  const submitForm = (body) => {
    handleClose();
    showByIdClassRoom = true;
    if (isAddConfirm)
      addStudentToClass(body);
    else if (isDelete) {
      toast.success(t('Delete student of subject successfuly !'), {
        position: toast.POSITION.TOP_RIGHT
      })
      deleteStudentOfClassroom(body);
    }
  }

  const deleteStudentOfClassroom = (body) => {
    deleteStudentOfClassroomService(body).then((res) => {
      getAllStudentOfClass();
    }).catch((error) => {
      toast.error(t('Delete student of subject fail !'), {
        position: toast.POSITION.TOP_RIGHT
      })
      removeCredential();
      navigate(Path.LOGIN);
    })
  }

  const addStudentToClass = (body) => {
    addStudentToClassService(body).then((res) => {
      //getAllStudentOfClass();
      toast.success(t('Add student to subject successfuly !'), {
        position: toast.POSITION.TOP_RIGHT
      })
    }).catch((error) => {
      toast.error(t('Add student to subject fail !'), {
        position: toast.POSITION.TOP_RIGHT
      })
      removeCredential();
      navigate(Path.LOGIN);
    })
  }

  const handleClickPage = (index) => {
    setActiveIndex(index);
    getAllStudent(index);
  };

  const handlePrevious = (index) => {

    setActiveIndex(index - 1);
    getAllStudent(index - 1);
  }

  const handleNext = (index) => {

    setActiveIndex(index + 1);
    getAllStudent(index + 1);
  }
  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    importListStudentIntoSubjectService(formData, idClassRoom).then((res) => {
      getAllStudentOfClassService(idClassRoom, undefined, undefined, undefined, undefined, undefined).then((res) => {
        setlistAllStudent(res.data.content);
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
        handleClose();
      }).catch((error) => {
        setIsLoading(false);
        toast.error(t('Search student fail !'), {
          position: toast.POSITION.TOP_RIGHT,
        });
        removeCredential();
        navigate(Path.LOGIN);
      });
      toast.success(t('Import successfuly !'), { position: toast.POSITION.TOP_RIGHT });
    }).catch(e => {
      console.log(e)
      toast.error(t("Cannot import file !"), { position: toast.POSITION.TOP_RIGHT })
    })

  };
  const handleClickExport = () => {
    exportListStudentOfClassService(idClassRoom, "excel").then((res) => {
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
    if (showByIdClassRoom && idClassRoom)
      getAllStudentOfClassService(idClassRoom, undefined, undefined, undefined, undefined, data).then((res) => {
        setlistAllStudent(res.data.content);
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
    else if (!showByIdClassRoom && idClassRoom) {
      getAllVerifiedStudentService(undefined, undefined, undefined, undefined, data).then((res) => {
        setlistAllStudent(res.data.content);
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
        toast.error(t('Search verified student fail !'), {
          position: toast.POSITION.TOP_RIGHT,
        });
        removeCredential();
        navigate(Path.LOGIN);
      });
    }
    else {
      getAllActiveStudentService(undefined, undefined, undefined, undefined, data).then((res) => {
        setlistAllStudent(res.data.content);
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
    }
  }

  const getAllActiveStudent = async (page, sortType, column, size, search) => {
    getAllActiveStudentService(page, sortType, column, size, search).then((res) => {
      setlistAllStudent(res.data.content);
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
      toast.error(t('Get student fail !'), {
        position: toast.POSITION.TOP_RIGHT,
      });
      removeCredential();
      navigate(Path.LOGIN);
    });

  }

  const getAllStudentOfClass = async (page, sortType, column, size, search) => {
    getAllStudentOfClassService(idClassRoom, page, sortType, column, size, search).then((res) => {
      setlistAllStudent(res.data.content);
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
      console.log(error)
      setIsLoading(false);
      toast.error('Get student fail !', {
        position: toast.POSITION.TOP_RIGHT,
      });
      removeCredential();
      navigate(Path.LOGIN);
    });
  }

  const getAllVerifiedStudent = (page, sortType, column, size, search) => {
    getAllVerifiedStudentService(page, sortType, column, size, search).then((res) => {
      setlistAllStudent(res.data.content);
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
      toast.error(t('Get verified student fail !'), {
        position: toast.POSITION.TOP_RIGHT,
      });
      removeCredential();
      navigate(Path.LOGIN);
    });
  }

  const getAllStudent = (page, sortType, column, size, search) => {
    if (showByIdClassRoom && idClassRoom)
      getAllStudentOfClass(page, sortType, column, size, search);
    else if (!showByIdClassRoom && idClassRoom)
      getAllVerifiedStudent(page, sortType, column, size = 6, search);
    else
      getAllActiveStudent(page, sortType, column, size, search);

  }

  const isActive = (index) => {
    return index === activeIndex;
  };

  useEffect(() => {

    getAllStudent();
  }, [checkShowByIdClassroom]);


  return (
    <>
      <div className=" p-4 h-full min-h-[550px] w-full flex-row flex justify-center">
        <div className="pb-4 dark:border-gray-700">
          {((idClassRoom && showByIdClassRoom)) && <>
            <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
              {t('List students in subject')}
            </div>
          </>}
          {((!idClassRoom && !showByIdClassRoom) && <>
            <div className='flex font-bold items-center justify-center pb-3 text-[40px]'>
              {t('All students')}
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
                  {idClassRoom && showByIdClassRoom && (
                    <div className='w-full flex flex-row'>
                      <Button className="bg-blue-800 w-auto mr-1" handleOnClick={() => { handleClickAdd() }}>{t('Add student to subject')}</Button>
                      <Button className="bg-green-500 w-auto mr-1 " handleOnClick={() => { handleClickExport() }}>{t('Export list student of subject')}</Button>
                      {!isClickImport &&
                        <>
                          <Button className="bg-yellow-500 w-auto " handleOnClick={() => { handleClickImport() }}>{t('Import list student into subject')}</Button>

                        </>}
                      {
                        isClickImport && <>
                          <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
                          <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white h-10 w-full inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset cursor-pointer rounded-lg mr-1">
                            {t('Select file')}
                          </label>
                          {
                            file && <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white h-10 inline-flex items-center justify-center py-2 px-4 text-sm font-semibold shadow-sm ring-1 ring-inset rounded-lg">
                              {t('Upload')}
                            </button>
                          }
                        </>
                      }

                    </div>
                  )}

                </div>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>

                    <th scope="col" className="px-6 py-3 w-[150px]">
                      {t('ID student')}
                    </th>
                    <th scope="col" className={clsx("px-6 py-3 w-[300px]")} >
                      {t('Student name')}
                    </th>
                    <th scope="col" className="px-6 py-3 w-[400px]">
                      {t('Email')}
                    </th>
                    {!showByIdClassRoom ?
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
                      (!idClassRoom && (<>
                        <th scope="col" className="px-6 py-3 w-[200px]">
                          {t('Email verified')}
                        </th>
                        <th scope="col" className="px-6 py-3 w-[70px]">
                          {t('Active')}
                        </th>
                      </>))
                    }
                    {idClassRoom && (<th scope="col" className="px-6 py-3 w-[150px]">
                      {t('Action')}
                    </th>)}
                  </tr>
                </thead>
                <tbody>
                  {
                    !isLoading &&
                    (listAllStudent.length !== 0 && (
                      listAllStudent.map(
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
                              {!showByIdClassRoom ? (<>

                                <td className="px-6 py-4 w-[200px]">
                                  <div className="flex items-center">
                                    {
                                      item.isEmailAddressVerified === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                                        {t('Verified')}</>
                                      ) : (<><div className="h-2.5 w-2.5 rounded-full  bg-green-500 mr-2"></div>{t('Unverified')}</>)
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
                                </td></>) : (!idClassRoom && (<>

                                  <td className="px-6 py-4 w-[200px]">
                                    <div className="flex items-center">
                                      {
                                        item.isEmailAddressVerified === true ? (<><div className="h-2.5 w-2.5 rounded-full bg-green-500  mr-2"></div>
                                          {t('Verified')}</>
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
                              {showByIdClassRoom === false && idClassRoom && (
                                <td className="px-6 py-4 flex w-[150px]">
                                  <p onClick={() => { handleClickAddConfirm(item) }} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('Add')}</p>


                                </td>)

                              }
                              {showByIdClassRoom === true && idClassRoom && (
                                <td className="px-6 py-4 flex w-[150px]">

                                  <p onClick={() => { handleClickDelete(item) }} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('Delete')}</p>

                                </td>)

                              }
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
            </>) : (listAllStudent.length === 0 && (<>
              <div className="grid w-full h-32 mt-5 px-4 bg-white place-content-center">
                <div className="text-center">
                  <h1
                    className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  >
                    Uh-oh!
                  </h1>
                  <p className="mt-4 text-gray-500">We cannot find any students.</p>
                </div>
              </div>
            </>))
          }
        </div>
        {isAdd && (
          <>
            <Modal className="bg-opacity-60 z-[101]" show={true} theme={{ 'content': { 'base': 'w-3/4 ' } }} popup onClose={() => { handleClose() }} >
              <Modal.Header >
                <div className='flex justify-center mr-[3px]'>
                  <div className='flex uppercase !text-center text-[23px] font-black'>{t('Add student to subject')}</div>
                </div>
                <hr className=" border mx-3 border-gray-300 !outline-none " />
              </Modal.Header>
              <Modal.Body className='flex justify-center w-full'>
                <div className='flex justify-center '>
                  <Studentmanager showByIdClassRoom={false} />
                </div>
              </Modal.Body>
            </Modal></>)
        }
        {isAddConfirm && (
          <>
            <Modal className="bg-opacity-60  z-[101]" show={true} size="md" popup onClose={() => handleClose()} >
              <Modal.Header />
              <Modal.Body>
                <form onSubmit={form.handleSubmit(submitForm)}
                  className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                >
                  <InputField name={ID_CLASSROOM} disabled form={form} defaultValue={idClassRoom} />
                  <InputField name={ID_STUDENT} disabled form={form} defaultValue={studentSelect.id} />
                  <p className="text-center text-[20px] font-medium text-lime-400 uppercase"> {t('Alert')} </p>
                  <h1 className='text-[16px] text-center'>{t('Are you sure you want to add this student to this subject?')}</h1>
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
                  className="relative mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                >
                  <InputField name={ID_CLASSROOM} disabled form={form} defaultValue={idClassRoom} />
                  <InputField name={ID_STUDENT} disabled form={form} defaultValue={studentSelect.id} />
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
export default React.memo(Studentmanager)
