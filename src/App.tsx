import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import CausesPage from './pages/CausesPage'
import CauseDetailPage from './pages/CauseDetailPage'
import CharitiesPage from './pages/CharitiesPage'
import CharityDetailPage from './pages/CharityDetailPage'
import DonatePage from './pages/DonatePage'
import ImpactPage from './pages/ImpactPage'
import GetInvolvedPage from './pages/GetInvolvedPage'
import NewsPage from './pages/NewsPage'
import BlogListingPage from './pages/BlogListingPage'
import BlogCategoryPage from './pages/BlogCategoryPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DonorPortalPage from './pages/DonorPortalPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import DonationSuccessPage from './pages/DonationSuccessPage'
import CookieConsent from './components/CookieConsent'

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="causes" element={<CausesPage />} />
          <Route path="causes/:slug" element={<CauseDetailPage />} />
          <Route path="charities" element={<CharitiesPage />} />
          <Route path="charities/:slug" element={<CharityDetailPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="donate/success" element={<DonationSuccessPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="get-involved" element={<GetInvolvedPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="blog" element={<BlogListingPage />} />
          <Route path="blog/category/:slug" element={<BlogCategoryPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="donor-portal" element={<DonorPortalPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
      <CookieConsent />
    </>
  )
}
