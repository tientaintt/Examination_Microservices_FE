import React, { useEffect, useState } from 'react'
import { changePasswordService, myInfomationService, updateUserImageService, updateUserProfileService } from '../../../services/UserService';
import { useNavigate } from 'react-router-dom';
import Path from '../../../utils/Path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { displayNameInvalid, emailInvalid, emailRegex, passwordInvalid, passwordRegex } from '../../../utils/Constant';
import { deleteFileByPathService, getUserInfo, saveCredential } from '../../../services/ApiService';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/form-controls/Button/Button';
import { Spinner } from 'flowbite-react';
import { Typography } from '@material-tailwind/react';
function MyInfo() {
      const { t } = useTranslation();
      const navigate = useNavigate()
      document.title = t('My information');
      // State for updating user profile
      const [toggleUpdateEmail, setToggleUpdateEmail] = React.useState(false);
      const [loginName, setLoginName] = React.useState("");
      const [displayName, setDisplayName] = React.useState("");
      const [emailAddress, setEmailAddress] = React.useState("");
      const [newEmailAddress, setNewEmailAddress] = React.useState("");
      const [isEmailAddressVerified, setIsEmailAddressVerified] = React.useState(false);
      const [userId, setUserId] = useState(null);
      const [avatarURL, setAvatarUrl] = useState(null);
      // State for update new password
      const [oldPassword, setOldPassword] = React.useState("");
      const [newPassword, setNewPassword] = React.useState("");
      const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
      const [Error, setError] = React.useState();
      const [fileInputRef, setFileInputRef] = useState(null);
      const [img, setImg] = useState(null);
      const [imgLoading, setImgLoading] = useState(false);

      const handleRemoveImg = () => {
            setImg(null);
            if (fileInputRef && fileInputRef.value) {
                  fileInputRef.value = '';
            }
      };
      const handleImgChange = (e) => {
            setImgLoading(true);
            const file = e.target.files[0];
            if (file) {
                  if (file.type.includes("image")) {
                        setImg(file);
                  } else {
                        toast.error("Ảnh không hợp lệ!", {
                              position: toast.POSITION.TOP_RIGHT,
                        });
                        handleRemoveImg();
                  }
            }
            setImgLoading(false);
      };
      const deleteAvatar = async () => {
            if (avatarURL) {
                  try {
                        setImgLoading(true);
                        await deleteFileByPathService(avatarURL);

                        setImgLoading(false);
                  } catch (e) {
                        console.error('Upload failed:', e);
                        setImgLoading(false);
                  }
            }


      };
      const uploadAvatar = async () => {

            try {
                  setImgLoading(true);
                  const formData = new FormData();
                  formData.append('file', img);
                  const newAvatarUrl = await updateUserImageService(formData);
                  console.log(newAvatarUrl)
                  if (newAvatarUrl && newAvatarUrl.data?.imageUrl) {
                        var userInfo = JSON.parse(getUserInfo());
                        console.log(userInfo);
                        userInfo.imageUrl=newAvatarUrl.data.imageUrl;
                        saveCredential(userInfo);
                        console.log(userInfo)
                        toast.success("Update successfully !", {
                              position: toast.POSITION.TOP_RIGHT,
                        });
                        handleRemoveImg();
                  }
                  getMyInfo()
                  setImgLoading(false);
            } catch (e) {
                  console.error('Upload failed:', e);
                  setImgLoading(false);
                  toast.error(`Update fail !`, {
                        position: toast.POSITION.TOP_RIGHT,
                  });
            }
      };
      const handleUploadImg = async () => {

            if (img) {
                  setImgLoading(true);

                  await deleteAvatar();
                  await uploadAvatar();

                  setImgLoading(false);

            } else {
                  console.warn('No image selected for upload.');
            }

      };
      useEffect(() => {
            getMyInfo()
      }, [])
      const getMyInfo = () => {
            myInfomationService()
                  .then(res => {
                        res = res.data
                        setLoginName(res.loginName)
                        setDisplayName(res.displayName)
                        setEmailAddress(res.emailAddress)
                        setNewEmailAddress(res.newEmailAddress === null ? "" : res.newEmailAddress)
                        setIsEmailAddressVerified(res.isEmailAddressVerified);
                        setUserId(res.id)
                        setAvatarUrl(res.imageUrl);
                  })
                  .catch(err => {
                        navigate(Path.LOGIN)
                  })
      }

      const handleToggleUpdateEmail = () => {
            setToggleUpdateEmail(pre => !pre)
      }

      const handleChangeDisplayName = (value) => {
            setDisplayName(value)
      }
      const handleChangeEmailAddress = (value) => {
            setNewEmailAddress(value)
      }
      const handleChangeOldPassword = (value) => {
            setOldPassword(value)
      }
      const handleChangeNewPassword = (value) => {
            setNewPassword(value)
      }
      const handleChangeConfirmNewPassword = (value) => {
            setConfirmNewPassword(value)
      }
      const handleSubmitUpdateMyInfo = () => {
            updateUserProfileService(displayName, newEmailAddress)
                  .then(res => {

                        var userInfo = JSON.parse(getUserInfo());
                        console.log(userInfo)
                        userInfo.emailAddress = res.data.emailAddress;
                        userInfo.displayName = res.data.displayName;
                        userInfo.imageUrl=res.data.imageUrl;
                        saveCredential(userInfo);


                        toast.success(t('Update successfully!'), {
                              position: toast.POSITION.TOP_RIGHT,
                        });
                        getMyInfo()
                  })
                  .catch(err => {
                        getMyInfo()
                        toast.error(t('Update fail!'), {
                              position: toast.POSITION.TOP_RIGHT,
                        });
                  })
      }
      const handleChangePassword = () => {
            setError()
            if (newPassword !== confirmNewPassword) {
                  setError(t("Passwords does not match"))
            } else if (!newPassword.match(passwordRegex)) {
                  setError(passwordInvalid)
            } else {
                  changePasswordService(oldPassword, newPassword)
                        .then(res => {
                              toast.success(t('Update successfully!'), {
                                    position: toast.POSITION.TOP_RIGHT,
                              });
                              setOldPassword('');
                              setConfirmNewPassword('');
                              setNewPassword('');
                        })
                        .catch(err => {
                              setError(err?.message)
                        })
            }
      }
      return (
            <>
                  <div className='grid pt-5 grid-cols-7 gap-10 w-[80%] mx-auto'>
                        <div className=' col-span-4 select-none'>
                              <h1 className='text-[30px] font-bold pl-5 pt-3' >{t('My information')}</h1>
                              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                              <div className='flex flex-col'>
                                   
                                    <div className='my-6 max-w-[40rem]'>
                                          <div className='w-full min-h-[230px] h-[230px] relative flex border rounded-sm border-[#003a47]'>
                                                <div className='h-full flex justify-center items-center px-8  m-auto w-[240px] max-w-[240px]  bg-[#f0f2f4]'>
                                                      {imgLoading ? (
                                                            <Spinner className='w-[60px] object-cover object-center h-auto' color="teal" />
                                                      ) : (
                                                            <img
                                                                  src={img ? URL.createObjectURL(img) : "avatarURL"}
                                                                  className='p-2 h-full object-scale-down object-center'
                                                                  alt=""
                                                            />
                                                      )}
                                                </div>
                                          </div>
                                          <div className='w-full flex justify-between items-center mt-6 relative h-[40px] border rounded-sm border-[#003a47]'>
                                                <div className='mx-3 w-full h-full flex items-center '>
                                                      <Typography className='cursor-default'>
                                                            {img?.name || "Chưa có file được chọn"}
                                                      </Typography>
                                                      {img && (
                                                            <span onClick={handleRemoveImg} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                                                  <FontAwesomeIcon className='' icon={faXmark} />
                                                            </span>
                                                      )}
                                                </div>
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      style={{ display: 'none' }}
                                                      onChange={handleImgChange}
                                                      ref={(fileInput) => (setFileInputRef(fileInput))}
                                                />
                                                <Button handleOnClick={() => fileInputRef && fileInputRef.click()} style="bg-[#003a47] !rounded-none w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" > {t("Select")}</Button>
                                          </div>
                                    </div>

                                    <Button disable={!img} handleOnClick={() => handleUploadImg()} className="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white max-w-[40rem]" rounded >{t('Save')}</Button>
                              </div>
                              <div className='grid grid-cols-2 gap-5'>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('Login name')}</h3>
                                          <input disabled={true} value={loginName}
                                                type="text" id="loginName"
                                                className="opacity-90 pointer-events-none cursor-default block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " required />
                                    </div>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('Email address')}<FontAwesomeIcon onClick={() => handleToggleUpdateEmail()} className='pl-5 cursor-pointer' icon={faPenToSquare} /></h3>
                                          <input disabled={true} value={emailAddress}
                                                type="text" id="emailAddress"
                                                className="opacity-90 pointer-events-none cursor-default block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " required />

                                    </div>
                              </div>
                              <div className='grid grid-cols-2 gap-5'>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('Display name')}</h3>
                                          <input value={displayName}
                                                onChange={(e) => handleChangeDisplayName(e.target.value)}
                                                type="text" id="displayName"
                                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-black rounded-lg bg-gray-50 " required />
                                    </div>
                                    {(toggleUpdateEmail || newEmailAddress !== "") &&
                                          <div className=''>
                                                <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('New email address')}</h3>
                                                <input value={newEmailAddress}
                                                      onChange={(e => handleChangeEmailAddress(e.target.value))}
                                                      type="text" id="displayName"
                                                      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-black rounded-lg bg-gray-50 " required />
                                          </div>
                                    }
                              </div>
                              <div className='flex justify-end items-center opacity-95 px-10 py-5    rounded-lg select-none mr-10 mt-1' >
                                    <div onClick={() => handleSubmitUpdateMyInfo()}
                                          className='hover:bg-black hover:text-white flex select-none cursor-pointer justify-center items-center rounded-lg border-[3px] py-2 px-5 bg-white border-black' variant="outlined">{t('Update')}</div>
                              </div>
                        </div>
                        <div className=' col-span-3 pl-10'>
                              <h1 className='text-[30px] font-bold pl-5 pt-3' >{t('Change password')}</h1>
                              <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                              <div className=''>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('Old password')}</h3>
                                          <input onChange={(e) => handleChangeOldPassword(e.target.value)}
                                                value={oldPassword}
                                                type="password" id="oldPassword"
                                                className=" block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " required />
                                    </div>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('New password')}</h3>
                                          <input onChange={(e) => handleChangeNewPassword(e.target.value)}
                                                value={newPassword}
                                                type="password" id="newPassword"
                                                className=" block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " required />
                                    </div>
                                    <div className=''>
                                          <h3 className='text-[15px] font-bold pl-5 pt-3' >{t('Confirm your new password')}</h3>
                                          <input onChange={(e) => handleChangeConfirmNewPassword(e.target.value)}
                                                value={confirmNewPassword}
                                                type="password" id="confirmNewPassword"
                                                className=" block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " required />
                                    </div>
                                    {Error &&
                                          <div className='pt-1 pl-3 text-red-500' >
                                                {Error}
                                          </div>
                                    }
                              </div>
                              {(oldPassword && newPassword && confirmNewPassword) &&
                                    < div className='flex justify-end items-center opacity-95 px-10 py-5    rounded-lg select-none mr-10 mt-1' >
                                          <button onClick={() => handleChangePassword()}
                                                className=' hover:bg-black hover:text-white flex select-none cursor-pointer justify-center items-center rounded-lg border-[3px] py-2 px-5 bg-white border-black' variant="outlined">{t('Change')}</button>
                                    </div >
                              }
                        </div>

                  </div >

            </>
      )
}

export default MyInfo