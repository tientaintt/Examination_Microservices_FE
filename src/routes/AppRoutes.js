import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Path from '../utils/Path'
import Home from '../pages/User/Home/Home'
import Register from '../pages/Register/Register'
import Login from '../pages/Login/Login'
import ForgotPassword from '../pages/Forgot/ForgotPassword'
import ScoreDetail from '../pages/User/ScoreDetail/ScoreDetail'
import PageNotFound from '../pages/PageNotFound'

import { Admin } from '../pages/Admin/Admin'
import { Classmanager } from '../pages/Admin/Manager/Classmanager'
import Studentmanager from '../pages/Admin/Manager/Studentmanager'
import { QuestionGroup } from '../pages/Admin/Manager/Questiongroupmanager'
import { Examinationmanager } from '../pages/Admin/Manager/Examinationmanager'
import { Scoremanager } from '../pages/Admin/Manager/Scoremanager'


import PrepareTest from '../pages/User/PrepareTest/PrepareTest';
import Student from '../pages/User/Student';
import DoMCTest from '../pages/User/DoMCTest/DoMCTest';
import VerifyEmail from '../pages/User/VerifyEmail/VerifyEmail';
import MyInfo from '../pages/User/MyInfo/MyInfo'
import MyAllScores from '../pages/User/MyAllScores/MyAllScores'
import ScoreDetailManager from '../pages/Admin/Manager/ScoreDetailManager'
import Teacher from '../pages/Teacher/Teacher'
import HomeTeacher from '../pages/Teacher/Home/HomeTeacher'
import SubjectDetail from '../pages/User/SubjectDetail/SubjectDetail'
import MySubjects from '../pages/User/MySubjects/MySubjects'
import MyAllTest from '../pages/User/MyAllTest/MyAllTest'
import Dashboard from '../pages/Admin/Manager/Dashboard'
import Teachermanager from '../pages/Admin/Manager/Teachermanager'
import SubjectManagementTeacher from '../pages/Teacher/SubjectManagementTeacher/SubjectManagementTeacher'
import SubjectDetailTeacher from '../pages/Teacher/SubjectDetailTeacher/SubjectDetailTeacher'
import QuestionGroupManagementTeacher from '../pages/Teacher/QuestionGroupManagementTeacher/QuestionGroupManagementTeacher'
import QuestionManagementTeacher from '../pages/Teacher/QuestionManagementTeacher/QuestionManagementTeacher'
import ExamManagementTeacher from '../pages/Teacher/ExamManagementTeacher/ExamManagementTeacher'
import ScoreManagementTeacher from '../pages/Teacher/ScoreManagementTeacher/ScoreManagementTeacher'
import ScoreDetailManagementTeacher from '../pages/Teacher/ScoreDetailManagementTeacher/ScoreDetailManagementTeacher'
export const AppRoutes = () => {

  return (
    <div className='h-full '>

      <Routes>

        <Route path={'/'} element={<Home />} exact />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.FORGOT} element={<ForgotPassword />} />
        <Route path={Path.VERIFY_EMAIL} element={<VerifyEmail />} />

        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.HOME} element={<Home />} />
        <Route path='/my' element={<Student />} >
          <Route path={Path.MY_SUBJECTS} element={<MySubjects />} />
          <Route path={Path.SUBJECT_DETAIL} element={<SubjectDetail />} />
          <Route path={Path.PREPARE_TEST} element={<PrepareTest />} />
          <Route path={Path.DO_MC_TEST} element={<DoMCTest />} />
          <Route path={Path.SCORE_DETAIL} element={<ScoreDetail />} />
          <Route path={Path.MY_INFO} element={<MyInfo />} />
          <Route path={Path.MY_ALL_SCORES} element={<MyAllScores />} />
          <Route path={Path.MY_ALL_TEST} element={<MyAllTest />} />
        </Route>
        <Route path='/admin' element={<Admin />}>
          <Route path={Path.AMTEACHERMANAGER} element={<Teachermanager />} />
          <Route path={''} element={<Dashboard />} />
          <Route path={Path.AMCLASSMANAGER} element={<Classmanager />} />
          <Route path={Path.AMQUESTIONGROUPMANAGER} element={<QuestionGroup />} />
          <Route path={Path.AMEXAMINATIONMANAGER} element={<Examinationmanager />} />
          <Route path={'/admin/student/:idClassRoom'} element={<Studentmanager />} />
          <Route path={Path.AMSCOREMANAGER} element={<Scoremanager />} />
          <Route path={Path.AMSCOREDETAILMANAGER} element={<ScoreDetailManager />} />
          <Route path={'/admin/student'} element={<Studentmanager showByIdClassRoom={false} />} />
        </Route>
        <Route path='/teacher' element={<Teacher />}>
          <Route path={Path.TEACHERHOME} element={<HomeTeacher />}></Route>
          <Route path={Path.TEACHER_SUBJECTS_MANAGE} element={<SubjectManagementTeacher/>}/>
          <Route path={Path.TEACHER_SUBJECT_DETAIL} element={<SubjectDetailTeacher/>}/>
          <Route path={Path.TEACHER_MANAGER_QUESGR} element={<QuestionGroupManagementTeacher />}/>
          <Route path={Path.TEACHER_MANAGER_QUESTION} element={<QuestionManagementTeacher />}/>
          <Route path={Path.TEACHER_MANAGE_TESTS} element={<ExamManagementTeacher/>}/>
          <Route path={Path.TEACHER_MANAGER_SCORE} element={<ScoreManagementTeacher/>}/>
          <Route path={Path.TEACHER_SCORE_DETAIL} element={<ScoreDetailManagementTeacher/>}/>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div >
  )
}
