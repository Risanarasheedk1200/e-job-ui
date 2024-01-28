import React from 'react'
import { Route, Routes } from 'react-router-dom'
import JobList from './components/JobList'
import Login from './components/Login'
import Signup from './components/SignUp'
import JobPosting from './components/JobPosting'
import AllJobs from './components/AllJobs'
import NotificationsPage from './components/NotificationsPage'


function AppRoutes() {
  return (
    <Routes>
        <Route path={"/"} element={<Signup/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/dashboard"} element={<JobList/>}/>
        <Route path={"/post-job"} element={<JobPosting/>}/>
        <Route path={"/all-jobs"} element={<AllJobs/>}/>
        <Route path={"/notifications"} element={<NotificationsPage/>}/>
    </Routes>
  )
}

export default AppRoutes