import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import ManageBlogs from './pages/ManageBlogs'
import ManageVolunteers from './pages/ManageVolunteers'
import ManagePartners from './pages/ManagePartners'
import Settings from './pages/Settings'
import AddBlogPost from './pages/AddBlogPost'
import AddPartner from './pages/AddPartner'
import VolunteerReview from './pages/VolunteerReview'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="blogs/new" element={<AddBlogPost />} />
        <Route path="volunteers" element={<ManageVolunteers />} />
        <Route path="volunteers/review" element={<VolunteerReview />} />
        <Route path="partners" element={<ManagePartners />} />
        <Route path="partners/new" element={<AddPartner />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
