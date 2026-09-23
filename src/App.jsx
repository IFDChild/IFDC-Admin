import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import ManageBlogs from './pages/ManageBlogs'
import ManageVolunteers from './pages/ManageVolunteers'
import Settings from './pages/Settings'
import AddBlogPost from './pages/AddBlogPost'
import VolunteerReview from './pages/VolunteerReview'
import ManageNews from './pages/ManageNews'
import AddNews from './pages/AddNews'
import DonationRequests from './pages/DonationRequests'
import ResourceManagement from './pages/ResourceManagement'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="blogs/new" element={<AddBlogPost />} />
        <Route path="blogs/edit/:id" element={<AddBlogPost />} />
        <Route path="volunteers" element={<ManageVolunteers />} />
        <Route path="volunteers/review/:id" element={<VolunteerReview />} />
        <Route path="news" element={<ManageNews />} />
        <Route path="news/new" element={<AddNews />} />
        <Route path="donations" element={<DonationRequests />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
