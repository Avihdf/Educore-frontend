import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import axios from 'axios';

axios.defaults.withCredentials = true;

//Students Routes Import
import Navbar from './components/Students/Navbar'
import Home from './pages/Student/Home'
import Login from './pages/Student/Login'
import ForgetPassword from './pages/Student/ForgetPassword';
import Register from './pages/Student/Register'
import CourseList from './pages/Student/CourseList'
import CourseDetails from './pages/Student/CourseDetails'
import MyEnrollment from './pages/Student/MyEnrollment'
import Player from './pages/Student/Player'
import Profile from './pages/Student/Profile'
import NewFooter from './components/Students/NewFooter';
import Protected from './components/Students/Protected';


//Educator Routes Import

import Educator from './pages/Educator/Educator'
import Dashboard from './pages/Educator/Dashboard'
import Addcourse from './pages/Educator/Addcourse'
import MyCourses from './pages/Educator/MyCourses'
import StudentEnrollment from './pages/Educator/StudentEnrollment'
import EnrollStudent from './pages/Educator/EnrollStudent';
import EducatorProfile from './pages/Educator/EducatorProfile';

import EducatorProtected from './components/Educator/EducatorProtected';
import CoursesEdit from './pages/Educator/CoursesEdit';
import CourseWiseEnroll from './pages/Educator/CourseWiseEnroll';
import Coursewisestudents from './components/Educator/Coursewisestudents';
import Verifyotp from './pages/Student/Verifyotp';
import ChangePassword from './pages/Student/ChangePassword';
import Pagenotfound from './components/Students/Pagenotfound';







// axios.defaults.withCredentials = true;



function App() {

  const isEducatorPage = useMatch('/educator/*');
  const isloginpage=useMatch('/login')
  const isforgetpage=useMatch('/forget-password')
  const isregisterpage=useMatch('/register')
  const isverifypage=useMatch('/verification')
  const ischangepassword=useMatch('/change-password')

  return (
    <>

      <div className='bg-black pt-[65px] min-h-screen text-white '>
        {/* Render Navbar only if not on Educator page */}
        {!isEducatorPage && <Navbar />}
        


        <Routes>
          {/* Define routes for student pages */}

          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forget-password' element={<ForgetPassword/>} />
          <Route path='/verification/:email' element={<Verifyotp/>} />
          <Route path='/change-password/:email' element={<ChangePassword />} />
          <Route path='/register' element={<Register />} />
          <Route path='/courses' element={<CourseList />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/my-enrollments' element={<Protected><MyEnrollment /></Protected>} />
          <Route path='/player/:id' element={<Protected><Player /></Protected>} />
          <Route path='/profile/:id' element={<Protected><Profile /></Protected>} />
          <Route path='/page-not-found' element={<Pagenotfound />} />
          


          {/* Define routes for educator pages */}
          {/* The educator routes are nested under the /educator path */}
          <Route path='/educator' element={<EducatorProtected><Educator /></EducatorProtected>}>
            <Route path='dashboard' element={<EducatorProtected><Dashboard /></EducatorProtected>} />
            <Route path='add-course' element={<EducatorProtected><Addcourse /></EducatorProtected>} />
            <Route path='courses-list' element={<EducatorProtected><MyCourses /></EducatorProtected>} />
            <Route path='courseedit/:id' element={<EducatorProtected><CoursesEdit /></EducatorProtected>} />
            <Route path='register-student' element={<EducatorProtected><StudentEnrollment /></EducatorProtected>} />
            <Route path='student-enrollments' element={<EducatorProtected><EnrollStudent /></EducatorProtected>} />
            <Route path='coursewise-student-enrollments' element={<EducatorProtected><CourseWiseEnroll /></EducatorProtected>} />
            <Route path='coursewise-enroll/:id' element={<EducatorProtected><Coursewisestudents/></EducatorProtected>} />
            <Route path='educator-profile/:id' element={<EducatorProtected><EducatorProfile /></EducatorProtected>} />


          </Route>


        </Routes>

{!isloginpage && !isregisterpage && !isforgetpage && !isverifypage && !ischangepassword && !isEducatorPage && <NewFooter/>}


      </div>
    </>
  )
}

export default App
