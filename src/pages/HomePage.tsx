import Navigation from '../components/Navigation'
import CustomCursor from '../components/CustomCursor'
import LoadingScreen from '../components/LoadingScreen'
import ScrollProgress from '../components/ScrollProgress'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import WorkSection from '../components/WorkSection'
import ContactSection from '../components/ContactSection'

export default function HomePage() {
  return (
    <div className="grain" style={{ background: '#080808' }}>
      {/* System UI */}
      <LoadingScreen />
      <CustomCursor />
      <Navigation />
      <ScrollProgress />

      {/* Page sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ContactSection />
      </main>
    </div>
  )
}
