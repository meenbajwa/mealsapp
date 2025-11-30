import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import SitesPage from './pages/SitesPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CrawlerPage from './pages/CrawlerPage.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="content-area container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crawler" element={<CrawlerPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
