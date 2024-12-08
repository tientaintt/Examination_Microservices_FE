import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../components/form-controls/InputField/InputField';
import { displayNameInvalid, emailInvalid, emailRegex, passwordInvalid, passwordRegex, userNameInvalid, usernameRegex } from '../../utils/Constant';
import Button from '../../components/form-controls/Button/Button';
import 'react-toastify/dist/ReactToastify.css';
import Toggle from '../../components/form-controls/Toggle/Toggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkStudent, saveCredential, signUpService } from '../../services/ApiService';
import Path from '../../utils/Path';

const DISPLAY_NAME = 'displayName';
const USERNAME = 'loginName';
const PASSWORD = 'password';
const EMAIL = 'emailAddress';
const CONFIRMPASSWORD = 'confirmPassword';

const Register = () => {
      const navigate = useNavigate();
      document.title = 'Register';
      // Link tham khao userForm
      // https://viblo.asia/p/react-hook-form-xu-ly-form-de-dang-hon-bao-gio-het-RnB5pAdDKPG
      const initialValue = {
            [DISPLAY_NAME]: '',
            [USERNAME]: '',
            [PASSWORD]: '',
            [EMAIL]: ''
      };
      const yupObject = yup.object().shape({
            [DISPLAY_NAME]: yup
                  .string()
                  .required(displayNameInvalid),
            [USERNAME]: yup
                  .string()
                  .matches(usernameRegex, userNameInvalid),
            [PASSWORD]: yup
                  .string()
                  .matches(passwordRegex, passwordInvalid),
            [CONFIRMPASSWORD]: yup
                  .string()
                  .matches(passwordRegex, passwordInvalid),
            [EMAIL]: yup
                  .string()
                  .matches(emailRegex, emailInvalid),
      });
      const form = useForm({
            mode: 'onSubmit',
            defaultValues: initialValue,
            criteriaMode: "firstError",
            // resolver dùng để validate với yup
            // Link tham khảo Yep:
            // https://github.com/jquense/yup
            // https://viblo.asia/p/react-hook-form-with-yup-resolver-RQqKLqG6Z7z
            // https://viblo.asia/p/validation-voi-yup-trong-react-XL6lAVbJ5ek
            // https://www.techzaion.com/validation-with-yup
            resolver: yupResolver(yupObject)
      })

      const [isTeacher, setIsTeacher] = useState(false)
      const [errorMessage, setErrorMessage] = useState();
      
      const getToggle = (isToggle) => {
            setIsTeacher(isToggle)
      }
      const submitForm = (body) => {
            // Tạo service để chứa response từ API riêng
            if (body.password === body.confirmPassword)
                  signUpService(body, isTeacher)
                        .then((response) => {
                              // Link tham khảo Toast: https://blog.logrocket.com/using-react-toastify-style-toast-messages/
                              toast.success(`Sign up successfully!`, {
                                    position: toast.POSITION.TOP_RIGHT,
                              });
                              console.log(response.data)
                              saveCredential(response.data) 
                              navigate(Path.VERIFY_EMAIL);
                        })
                        .catch((error) => {
                              toast.error(`Sign up fail!`, {
                                    position: toast.POSITION.TOP_RIGHT,
                              });
                              // console.log(error.response.data.message)
                              setErrorMessage(error.response.data?.message)
                        });
            else {
                  setErrorMessage("Password and confirm password do not match");
            }
      };
      return (
            <div>
                  <div className="mx-auto max-w-screen-xl px-4 py-2 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-lg">
                              <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                                    Welcome to  <br /> our examination platform
                              </h1>
                              {/*  form.handleSubmit => validate trước khi gọi submitForm*/}
                              <form onSubmit={form.handleSubmit(submitForm)}
                                    className="mb-0 space-y-2 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                              >
                                    <p className="text-center text-lg font-medium">Sign up</p>

                                    <InputField name={DISPLAY_NAME} label="Display name" form={form} />
                                    <InputField name={USERNAME} label="Username" form={form} />
                                    <InputField type='password' name={PASSWORD} label="Password" form={form} />
                                    <InputField type='password' name={CONFIRMPASSWORD} label="Confirm password" form={form} />
                                    <InputField name={EMAIL} label="Email address" form={form} />
                                    <Toggle handleToggle={getToggle} >I am a teacher.</Toggle>
                                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                                    <Button className={isTeacher ? "bg-blue-800" : "bg-indigo-500"} isSubmiting={form.formState.isSubmitting} type='submit' >Sign up as {isTeacher ? 'an teacher' : 'an student'}</Button>
                                    <p className="text-center text-sm text-gray-500">
                                          {/* NavLink dùng để redirect đến link được define trong router (App.js) */}
                                          <NavLink className='underline text-sm' to="/login" >Back to login page</NavLink>
                                    </p>
                                    <p className="text-center text-sm text-gray-500">
                                          {/* NavLink dùng để redirect đến link được define trong router (App.js) */}
                                          <NavLink className='underline text-sm font-bold' to="/home" >Home page</NavLink>
                                    </p>
                              </form>
                        </div>
                  </div>
            </div>
      )
}

export default Register
