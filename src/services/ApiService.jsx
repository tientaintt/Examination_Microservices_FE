
import axios from './axios';
const signUpStudentUrl = `/identity/signup/student`;
const signUpTeacherUrl = `/identity/signup/teacher`;
const loginInUrl = '/identity/login';
const resetPasswordUrl = '/identity/password/reset/EMAIL:{email}';
const codeResetPassUrl = 'notify/password/request-reset/EMAIL:{email}';
const getAllActiveClassUrl = 'exam/subject';
const updateActiveClassUrl = "exam/subject/update/{id}";
const addActiveClassUrl = "exam/subject/create";
const deleteActiveClassUrl = "exam/subject/delete/{id}";
const getAllActiveQuestionGroupUrl = 'exam/question-group/subject/';
const addQuestionGroupUrl = 'exam/question-group/create';
const updateQuestionGroupUrl = 'exam/question-group/update/{id}';
const deleteQuestionGroupUrl = 'exam/question-group/delete/{id}'
const getAllUnActiveClassUrl = 'exam/subject/inactive';
const getAllUnActiveQuestionGroupUrl = 'exam/question-group/inactive/subject/{id}';
const getAllStudentOfClassUrl = 'exam/student/subject';
const getAllActiveStudentUrl = 'identity/student';
const addStudentToClassUrl = 'exam/student/add-to-class';
const addTeacherManageSubjectUrl = 'exam/teacher/add-manage-subject';
const readNotification='notify/read/{notification_id}'
const getAllExamOfClassUrl = 'exam/multiple-choice-test/subject';
const addExamByIdClassroomUrl = 'exam/multiple-choice-test/create'
const getAllActiveQuestionUrl = 'exam/question/question-group'
const getAllInActiveQuestionUrl = 'exam/question/inactive/question-group'
const addQuestionByQuestionGroupUrl = 'exam/question/create';
const updateQuestionUrl = 'exam/question/update/{id}';
const deleteQuestionUrl = 'exam/question/delete/{id}';
const deleteExamUrl = 'exam/multiple-choice-test/delete/{idExam}';
const updateExamUrl = 'exam/multiple-choice-test/update/info/{idExam}';
const getAllStudentScoreByIDExamUrl = 'exam/score/multiple-choice-test'
const getAllVerifiedStudentUrl = 'identity/student/verified';
const getAllActiveQuestionByIdClassroomUrl = 'exam/question/subject';
const getAllInActiveQuestionByIdClassroomUrl = 'exam/question/inactive/subject';
const activeClassroomUrl = 'exam/subject/active/{idClassroom}';
const activeQuestionGroupUrl = 'exam/question-group/active/{idQuestionGr}';
const activeQuestionUrl = 'exam/question/active/{idQuestion}';
const deleteStudentOfClassroomUrl = 'exam/student/remove-from-class'
const exportListStudentOfClassUrl = 'exam/student/export/subject';
const getQuestionByIdUrl = 'exam/question/{idQuestion}'
const exportListQuestionOfQuestionGroupUrl = 'exam/question-group/export/questions'
const exportScorePDFUrl= 'exam/score/export/pdf'
const exportScoreExcelUrl= 'exam/score/export/excel'
// const importListQuestionIntoQuestionGroupUrl = 'exam/question-group/import/questions'
const importListQuestionIntoQuestionGroupUrl = 'file/question-group/import/questions'
const importListStudentIntoSubjectUrl = 'exam/subject/import/students'

const getReportTotalUrl='exam/report/total';
const getReportTeacherTotalUrl='exam/report/teacher/total';
const getReportTestsByMonthUrl='exam/report/testByMonth';
const getAllVerifiedTeacherUrl = 'identity/teacher/verified';
const getAllActiveTeacherUrl = 'identity/teacher';
const getAllSubjectManagementUrl='exam/subject/manager'
const getMCTestOfSubjectManagerAroundTwoWeekUrl='exam/multiple-choice-test/two-weeks-around'
const getAllExamManageUrl = 'exam/multiple-choice-test/manage';
const getAllMyNotificationUrl='notify/my'
const exportListStudentVerifiedUrl='identity/student/export/verified'
export const readNotificationService = async (id) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            url: readNotification.replace("{notification_id}",id),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}
export const getAllMyNotificationService = async ( page, sortType, column, size) => {
      let accessToken = getAccessToken();
      let urlParam = getAllMyNotificationUrl;
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
           urlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: urlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getAllExamManageService = async (page, sortType, column, size, search, startOfDate, endOfDate) => {
      let accessToken = getAccessToken();
      let paramUrl = getAllExamManageUrl ;
      let queryParams = [];
      if (startOfDate) {
            queryParams.push(`startOfDate=${startOfDate}`);
      }
      if (endOfDate) {
            queryParams.push(`endOfDate=${endOfDate}`);
      }
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

export const getMCTestOfSubjectManagerAroundTwoWeekService = async (page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getMy2WeeksAroundMCTestParam = getMCTestOfSubjectManagerAroundTwoWeekUrl ;
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

export const getAllSubjectManagementService = async (page, sortType, column, size, search ,isPrivate) => {
      let accessToken = getAccessToken();
      let getAllSubjectManagementUrlParam = getAllSubjectManagementUrl;
      let queryParams = [];
      if (isPrivate)
            queryParams.push(`isPrivate=${isPrivate}`);

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
            getAllSubjectManagementUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllSubjectManagementUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getReportTestsByMonthService = async () => {
      let accessToken = getAccessToken();

      return await axios.request({
            method: 'get',
            url: getReportTestsByMonthUrl,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}

export const getReportTotalService = async () => {
      let accessToken = getAccessToken();

      return await axios.request({
            method: 'get',
            url: getReportTotalUrl,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}
export const getReportTeacherTotalService = async () => {
      let accessToken = getAccessToken();

      return await axios.request({
            method: 'get',
            url: getReportTeacherTotalUrl,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}
export const importListQuestionIntoQuestionGroupService = async (formData, idQuestionGroup) => {
      let accessToken = getAccessToken();

      return await axios.request({
            method: 'post',
            url: importListQuestionIntoQuestionGroupUrl + '/' + idQuestionGroup,
            data: formData,
            headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}
export const importListStudentIntoSubjectService = async (formData, idSubject) => {
      let accessToken = getAccessToken();

      return await axios.request({
            method: 'post',
            url: importListStudentIntoSubjectUrl + '/' + idSubject,
            data: formData,
            headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}
export const getQuestionByIdService = async (idQuestion) => {
      let accessToken = getAccessToken();
      console.log(idQuestion)
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getQuestionByIdUrl.replace('{idQuestion}', idQuestion),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },

      })
}
export const exportListQuestionOfQuestionGroupService = async (idQuestionGroup) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: exportListQuestionOfQuestionGroupUrl + '/' + idQuestionGroup,
            headers: {

                  'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob',
      })
}
export const exportScoreExcelService = async (idScore) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: exportScoreExcelUrl + '/' + idScore ,
            headers: {

                  'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob',
      })
}

export const exportScorePDFService = async (idScore) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: exportScorePDFUrl + '/' + idScore ,
            headers: {

                  'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob',
      })
}

export const exportListStudentVerifiedService = async (typeExport) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: exportListStudentVerifiedUrl + '?typeExport=' + typeExport,
            headers: {

                  'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob',
      })
}
export const exportListStudentOfClassService = async (idClass, typeExport) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: exportListStudentOfClassUrl + '/' + idClass + '?typeExport=' + typeExport,
            headers: {

                  'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob',
      })
}

export const deleteStudentOfClassroomService = async (body) => {

      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: deleteStudentOfClassroomUrl,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
            data: body
      })
}

export const activeQuestionService = async (id) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            url: activeQuestionUrl.replace('{idQuestion}', id),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const activeQuestionGroupService = async (id) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            url: activeQuestionGroupUrl.replace('{idQuestionGr}', id),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const activeClassroomService = async (id) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            url: activeClassroomUrl.replace('{idClassroom}', id),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const getAllInActiveQuestionByIdClassroomService = async (id, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllInActiveQuestionByIdClassroomUrlParam = getAllInActiveQuestionByIdClassroomUrl;
      let queryParams = [];
      if (id)
            getAllInActiveQuestionByIdClassroomUrlParam += `/${id}`;

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
            getAllInActiveQuestionByIdClassroomUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllInActiveQuestionByIdClassroomUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getAllActiveQuestionByIdClassroomService = async (id, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllActiveQuestionByIdClassroomUrlParam = getAllActiveQuestionByIdClassroomUrl;
      let queryParams = [];
      if (id)
            getAllActiveQuestionByIdClassroomUrlParam += `/${id}`;

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
            getAllActiveQuestionByIdClassroomUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllActiveQuestionByIdClassroomUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}
export const getAllVerifiedTeacherService = async (page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllVerifiedTeacherUrlParam = getAllVerifiedTeacherUrl;
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
            getAllVerifiedTeacherUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllVerifiedTeacherUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getAllVerifiedStudentService = async (page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllVerifiedStudentUrlParam = getAllVerifiedStudentUrl;
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
            getAllVerifiedStudentUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllVerifiedStudentUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getAllStudentScoreByIDExamService = async (id, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllStudentScoreByIDExamUrlParam = getAllStudentScoreByIDExamUrl;
      let queryParams = [];
      if (id)
            getAllStudentScoreByIDExamUrlParam += `/${id}`;

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
            getAllStudentScoreByIDExamUrlParam += '?' + queryParams.join('&');
      }
      console.log(getAllStudentScoreByIDExamUrlParam)
      return await axios.request({
            method: 'get',
            url: getAllStudentScoreByIDExamUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}
export const updateExamService = async (body) => {
      let { id, ...params } = body;

      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            url: updateExamUrl.replace('{idExam}', id),
            data: params,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const deleteExamService = async (idExam) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'delete',
            url: deleteExamUrl.replace('{idExam}', idExam),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const deleteQuestionService = async (id) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'delete',
            url: deleteQuestionUrl.replace('{id}', id),
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const updateQuestionService = async (body) => {
      let { id, ...params } = body;

      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            url: updateQuestionUrl.replace('{id}', id),
            data: params,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const addQuestionByQuestionGroupService = async (body) => {
      let accessToken = getAccessToken();
      console.log(body);
      return await axios.request({
            method: 'post',
            url: addQuestionByQuestionGroupUrl,
            data: body,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
            }
      })
}

export const getAllInActiveQuestionByQuestionGrIDService = async (id, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllInActiveQuestionUrlParam = getAllInActiveQuestionUrl;
      if (id)
            getAllInActiveQuestionUrlParam += `/${id}`;
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
            getAllInActiveQuestionUrlParam += '?' + queryParams.join('&');
      }

      return await axios.request({
            method: 'get',
            url: getAllInActiveQuestionUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const getAllActiveQuestionByQuestionGrIDService = async (id, page, sortType, column, size, search) => {
      let accessToken = getAccessToken();
      let getAllActiveQuestionUrlParam = getAllActiveQuestionUrl;
      if (id)
            getAllActiveQuestionUrlParam += `/${id}`;
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
            getAllActiveQuestionUrlParam += '?' + queryParams.join('&');
      }
      console.log(search);
      console.log(getAllActiveQuestionUrlParam);
      return await axios.request({
            method: 'get',
            url: getAllActiveQuestionUrlParam,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      })
}

export const addExamByIdClassroomService = async (body) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: addExamByIdClassroomUrl,
            data: body,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  "Content-Type": 'application/json'
            }
      });
}

export const convertDateToMiliseconds = (date) => {
      var dateChange = new Date(date);
      return dateChange.getTime();
}

export const setFormatDateYYYYMMDD = (milliseconds) => {
      var date = new Date(milliseconds);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      var formattedDay = day.toString().padStart(2, '0');
      var formattedMonth = month.toString().padStart(2, '0');
      var formattedHours = hours.toString().padStart(2, '0');
      var formattedMinutes = minutes.toString().padStart(2, '0');
      return year + '-' + formattedMonth + '-' + formattedDay + 'T' + formattedHours + ':' + formattedMinutes;
}

export const getFormattedDateTimeByMilisecond = (milliseconds) => {
      return convertMillisecondsToTime(milliseconds) + ' ' + getFormattedDate(milliseconds)
}

export function getFormattedDate(milliseconds) {
      var date = new Date(milliseconds);

      var day = date.getDate();
      var month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0, nên cần cộng 1
      var year = date.getFullYear();

      // Định dạng ngày, tháng, năm thành chuỗi có 2 chữ số
      var formattedDay = day.toString().padStart(2, '0');
      var formattedMonth = month.toString().padStart(2, '0');

      // Trả về chuỗi ngày tháng năm trong định dạng DD/MM/YYYY
      return formattedDay + '/' + formattedMonth + '/' + year;
}

export function convertMillisecondsToTime(milliseconds) {
      var date = new Date(milliseconds);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      // var seconds = date.getSeconds();

      // Định dạng giờ, phút, giây thành chuỗi có 2 chữ số
      var formattedHours = hours.toString().padStart(2, '0');
      var formattedMinutes = minutes.toString().padStart(2, '0');
      //var formattedSeconds = seconds.toString().padStart(2, '0');

      // Trả về chuỗi thời gian trong định dạng HH:MM:SS
      return formattedHours + ':' + formattedMinutes;
}

export const getAllExamOfClassService = async (id, isEnded, page, sortType, column, size, search) => {
      let getAllExamOfClassUrlParam = getAllExamOfClassUrl + `/${id}`;
      let queryParams = [];
      if (isEnded) {
            queryParams.push(`isEnded=${isEnded}`);
      }
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
            getAllExamOfClassUrlParam += '?' + queryParams.join('&');
      }

      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllExamOfClassUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      });
}
export const addTeacherManageSubjectService = async (body) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: addTeacherManageSubjectUrl,
            data: body,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}
export const addStudentToClassService = async (body) => {
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: addStudentToClassUrl,
            data: body,
            headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': "application/json"
            }
      })
}
export const getAllActiveTeacherService = async (page, sortType, column, size, search) => {
      let getAllActiveStudentOUrlParam = getAllActiveTeacherUrl;
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
            getAllActiveStudentOUrlParam += '?' + queryParams.join('&');
      }
      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllActiveStudentOUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const getAllActiveStudentService = async (page, sortType, column, size, search) => {
      let getAllActiveStudentOUrlParam = getAllActiveStudentUrl;
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
            getAllActiveStudentOUrlParam += '?' + queryParams.join('&');
      }
      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllActiveStudentOUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const getAllStudentOfClassService = async (id, page, sortType, column, size, search) => {

      let getAllStudentOfClassUrlParam = getAllStudentOfClassUrl + `/${id}`;
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
            getAllStudentOfClassUrlParam += '?' + queryParams.join('&');
      }

      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllStudentOfClassUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const getAllUnActiveQuestionGroupService = async (id, page, sortType, column, size, search) => {
      let getAllUnActiveQuestionGroupUrlParam = getAllUnActiveQuestionGroupUrl.replace("{id}", id);
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
            getAllUnActiveQuestionGroupUrlParam += '?' + queryParams.join('&');

      }

      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllUnActiveQuestionGroupUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const getAllUnActiveClassService = async (page, sortType, column, size, search) => {
      let getAllUnActiveClassUrlParam = getAllUnActiveClassUrl;
      let queryParams = [];
      let accessToken = getAccessToken();
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
            getAllUnActiveClassUrlParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getAllUnActiveClassUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const deleteQuestionGroupService = async (questionGrId) => {

      let accessToken = getAccessToken();
      return await axios.request({
            method: 'delete',
            maxBodyLength: Infinity,
            url: deleteQuestionGroupUrl.replace('{id}', questionGrId),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            }
      })
}

export const updateQuestionGroupService = async (body) => {
      const { isEnable, id, classroomId, ...params } = body;
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            maxBodyLength: Infinity,
            url: updateQuestionGroupUrl.replace('{id}', id),
            data: params,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            }
      })
}

export const addQuestionGroupService = async (body) => {
      const { isEnable, id, ...params } = body;
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: addQuestionGroupUrl,
            data: params,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            }
      })
}

export const getAllActivateQuestionGroupService = async (id, page, sortType, column, size, search) => {
      let getAllQuestionGroupUrlParam = getAllActiveQuestionGroupUrl + id;
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
            getAllQuestionGroupUrlParam += '?' + queryParams.join('&');

      }

      let accessToken = getAccessToken();
      return await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url: getAllQuestionGroupUrlParam,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
      })
}

export const deleteActiveClassService = async (id) => {

      let accessToken = getAccessToken();
      return await axios.request({
            method: 'delete',
            maxBodyLength: Infinity,
            url: deleteActiveClassUrl.replace('{id}', id),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
            data: id
      })
}

export const addActiveClassService = async (body) => {
      const { id, ...params } = body;
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: addActiveClassUrl,
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
            data: params
      })
}

export const updateActiveClassService = async (body) => {
      const { id, ...params } = body;
      let accessToken = getAccessToken();
      return await axios.request({
            method: 'put',
            maxBodyLength: Infinity,
            url: updateActiveClassUrl.replace('{id}', id),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
            },
            data: params
      })
}

export const getAllActiveClassService = async (page, sortType, column, size, search) => {
      let getAllActiveClassUrlParam = getAllActiveClassUrl;
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
            getAllActiveClassUrlParam += '?' + queryParams.join('&');
      }
      return await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: getAllActiveClassUrlParam,
            headers: {
                  'Content-Type': 'application/json'
            },
      })
}

export const codeResetService = async (emailAddress) => {
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: codeResetPassUrl.replace('{email}', emailAddress),
            headers: {
                  'Content-Type': 'application/json'
            },

      })
}

export const resetPasswordService = async (body, emailAddress) => {
      const { confirmPassword, ...rest } = body;
      const data = rest;
      return await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: resetPasswordUrl.replace('{email}', emailAddress),
            headers: {
                  'Content-Type': 'application/json'
            },
            data: data
      })
}

/**
 * Gọi API Log in
 * 
 * @param {*} body : request body (từ form)
 * @returns : Trả về 1 promise
 */
export const loginInService = async (body) => {
      let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: loginInUrl,
            headers: {
                  'Content-Type': 'application/json'
            },
            data: body
      };
      return await axios.request(config);
}

/**
 * Gọi API đăng ký user
 * 
 * @param {*} body : request body (từ form)
 * @param {*} teacher : check xem có phải là teacher ha không
 * @returns : Trả về 1 promise
 */
export const signUpService = async (body, isTeacher) => {
      let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${isTeacher ? signUpTeacherUrl : signUpStudentUrl}`,
            headers: {
                  'Content-Type': 'application/json'
            },
            data: body
      };
      return await axios.request(config);
}

export const removeCredential = () => {
      localStorage.removeItem('userInfor');
      destroyToken();
}

/**
 * Lưu thông tin của user vào Local Storage || Session Storage
 * 
 * @param {*} userInfor : Thoong tin user (từ response body)
 * @param {*} rememberMe : True nếu user check vào "Remember Me"
 */
export const saveCredential = (userInfor) => {

      localStorage.setItem('userInfor', JSON.stringify(userInfor));
      // console.log(userInfor)
      // Lưu token riêng vào local storage
      saveToken(userInfor.accessToken, userInfor.refreshToken, JSON.stringify(userInfor.roles));
}

export const saveToken = (accessToken, refreshToken, roles) => {
      // console.log(roles);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (roles != null)
            localStorage.setItem('roles', roles);
}
export const destroyToken = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('roles');
}

export const getRoles = () => {
      return localStorage.getItem('roles');
}

export const getAccessToken = () => {
      return localStorage.getItem('accessToken');

}
export const getUserInfo = () => {
      return localStorage.getItem('userInfor');
}

export const getRefreshToken = () => {
      return localStorage.getItem('refreshToken');
}

