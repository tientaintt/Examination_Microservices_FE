import { getAccessToken } from './ApiService';
import axios from './axios';
const getMy2WeeksAroundMCTest = 'exam/multiple-choice-test/me/two-weeks-around';
const getMySubjects = 'exam/subject/me';
const getSubjectById = 'exam/subject';
const getMCTestsOfSubject = 'exam/multiple-choice-test/subject';
const getMyMultipleChoiceTestInformation = 'exam/multiple-choice-test/my/info';
const getDoMultipleChoiceTest = 'exam/multiple-choice-test';
const createTestTracking = 'exam/test-tracking/my/create';
const trackMyTest = 'exam/test-tracking/my';
const submitMCTest = 'exam/score/submit-test';
const getMyScore = 'exam/score/my';
const sendEmailVerifyCode = 'notify/email/send-verification';
const verifyEmail = 'identity/user/email/verify';
const myInfomation = 'identity/user/my-info';
const updateUserProfile = 'identity/user/update';
const changePassword = 'identity/user/change-password';
const getAllMyScore = 'exam/score/my';
const getScoreOfStudent = 'exam/score/student';
const getAllMyTestSpecifyDay='exam/multiple-choice-test/me/specific-day';
const getMessages='chat/messages/{senderId}/{receiverId}';
const sendMessage='chat/send';
const getAllSenderOfReceiver='chat/senders/to/{receiverId}';
export const getAllSenderOfReceiverService = async (receiverId,page,size) => {
      let accessToken = getAccessToken();
      let paramUrl = getAllSenderOfReceiver.replace("{receiverId}",receiverId) ;
      let queryParams = [];
      console.log(page)
      if (page) {
            console.log(page)
            queryParams.push(`page=${page}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (queryParams.length > 0) {
            paramUrl += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: paramUrl,
            
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}
export const sendMessageService = async (data) => {
      let accessToken = getAccessToken();
      console.log(accessToken)
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: sendMessage,
            data: data,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}
export const getMessagesService = async (senderId, receiverId) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMessages.replace('{senderId}',senderId).replace('{receiverId}',receiverId),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}
export const getAllMyTestSpecifyDayService = async (dateFrom, dateTo, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllMyTestSpecifyDayParam = getAllMyTestSpecifyDay;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (search) {
            queryParams.push(`search=${search}`);
      }
      if (dateFrom) {
            queryParams.push(`startOfDate=${dateFrom}`);
      }
      if (dateTo) {
            queryParams.push(`endOfDate=${dateTo}`);
      }
      if (queryParams.length > 0) {
            getAllMyTestSpecifyDayParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getAllMyTestSpecifyDayParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getAllMyScoreService = async (dateFrom, dateTo, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllMyScoreParam = getAllMyScore;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (search) {
            queryParams.push(`search=${search}`);
      }
      if (dateFrom) {
            queryParams.push(`dateFrom=${dateFrom}`);
      }
      if (dateTo) {
            queryParams.push(`dateTo=${dateTo}`);
      }
      if (queryParams.length > 0) {
            getAllMyScoreParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getAllMyScoreParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const changePasswordService = async (oldPassword, newPassword) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            maxBodyLength: Infinity,
            url: changePassword,
            data: {
                  oldPassword,
                  newPassword
            },
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const updateUserProfileService = async (displayName, emailAddress) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            maxBodyLength: Infinity,
            url: updateUserProfile,
            data: {
                  emailAddress,
                  displayName
            },
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const myInfomationService = async () => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: myInfomation,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const verifyEmailService = async (code) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: verifyEmail,
            data: { "code": code },
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const sendEmailVerifyCodeService = async () => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: sendEmailVerifyCode,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getScoreOfStudentService = async (studentId, multipleChoiceTestId, page, sortType, column, size) => {
      let accessToken = getAccessToken();
      let getScoreOfStudentParam = getScoreOfStudent ;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (queryParams.length > 0) {
            getScoreOfStudentParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: getScoreOfStudentParam,

            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            },
            data: {
                  studentId,
                  multipleChoiceTestId
            }
      })
}

export const getMyScoreService = async (MCTestId, page, sortType, column, size) => {
      let accessToken = getAccessToken();
      let getMyScoreParam = getMyScore + `/${MCTestId}`;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (queryParams.length > 0) {
            getMyScoreParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMyScoreParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const submitMCTestService = async (value) => {
      let accessToken = getAccessToken();
      console.log(value)
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: submitMCTest,
            data: value,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const trackMyTestService = async (MCTestId) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: trackMyTest + `/${MCTestId}`,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const createTestTrackingService = async (MCTestId) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: createTestTracking + `/${MCTestId}`,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getDoMultipleChoiceTestService = async (MCTestId, page, sortType, column, size) => {
      let accessToken = getAccessToken();
      let getDoMultipleChoiceTestParam = getDoMultipleChoiceTest + `/${MCTestId}`;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (queryParams.length > 0) {
            getDoMultipleChoiceTestParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getDoMultipleChoiceTestParam ,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getMyMultipleChoiceTestInformationService = async (MCTestId) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMyMultipleChoiceTestInformation + `/${MCTestId}`,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getMCTestsOfSubjectService = async (subjectId, page, sortType, column, size, search, isEnded) => {
      let getMCTestsOfSubjectParam = getMCTestsOfSubject + `/${subjectId}`;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (search) {
            queryParams.push(`search=${search}`);
      }
      if (isEnded) {
            queryParams.push(`isEnded=${isEnded}`);
      }
      if (queryParams.length > 0) {
            getMCTestsOfSubjectParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMCTestsOfSubjectParam,
            headers: {
                  'Content-Type': "application/json"
            }
      })
}

export const getSubjectByIdService = async (subjectId) => {
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getSubjectById + `/${subjectId}`,
            headers: {
                  'Content-Type': "application/json"
            }
      })
}

export const getMy2WeeksAroundMCTestService = async (page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getMy2WeeksAroundMCTestParam = getMy2WeeksAroundMCTest ;
      let queryParams = [];
      if (page) {
            queryParams.push(`page=${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType=${sortType}`);
      }
      if (column) {
            queryParams.push(`column=${column}`);
      }
      if (size) {
            queryParams.push(`size=${size}`);
      }
      if (search) {
            queryParams.push(`search=${search}`);
      }
 
      if (queryParams.length > 0) {
            getMy2WeeksAroundMCTestParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMy2WeeksAroundMCTestParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}

export const getMySubjectsService = async (page, sortType, column, size, search) => {
      let getMySubjectsParam = getMySubjects;
      let queryParams = [];
      if (page) {
            queryParams.push(`page = ${page}`);
      }
      if (sortType) {
            queryParams.push(`sortType = ${sortType}`);
      }
      if (column) {
            queryParams.push(`column = ${column}`);
      }
      if (size) {
            queryParams.push(`size = ${size}`);
      }
      if (search) {
            queryParams.push(`search = ${search}`);
      }
      if (queryParams.length > 0) {
            getMySubjectsParam += '?' + queryParams.join('&');
      }
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getMySubjectsParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}