import { useCallback, useEffect, useRef, useState } from "react"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import './app.css'
import logo from './assets/logo.png'
import SideNav from "./SideNav"
import TopBar from "./TopBar"
import MainContent from "./MainContent"

const SECTION_IDS = ['home', 'energy', 'carbon', 'optimize']
const SCROLL_OFFSET = 24

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const contentRef = useRef<HTMLElement | null>(null)
  const isProgrammaticScrollRef = useRef(false)

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)

    // Mark as programmatic scroll
    isProgrammaticScrollRef.current = true

    // Scroll to section
    const container = contentRef.current
    const section = document.getElementById(sectionId)
    if (container && section) {
      const containerRect = container.getBoundingClientRect()
      const sectionRect = section.getBoundingClientRect()
      const offsetTop = sectionRect.top - containerRect.top + container.scrollTop
      const targetTop = Math.max(offsetTop - SCROLL_OFFSET, 0)
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      })
    }
  }

  // Detect active section based on scroll position
  const updateActiveSectionFromScroll = useCallback(() => {
    const container = contentRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const threshold = containerRect.top + 100 // Check which section is near the top

    for (const sectionId of SECTION_IDS) {
      const section = document.getElementById(sectionId)
      if (section) {
        const rect = section.getBoundingClientRect()
        // If section top is above threshold and bottom is below it, it's the active section
        if (rect.top <= threshold && rect.bottom > threshold) {
          if (activeSection !== sectionId) {
            setActiveSection(sectionId)
          }
          break
        }
      }
    }
  }, [activeSection])

  // Listen to user scroll (wheel event only)
  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const handleWheel = () => {
      // Reset programmatic scroll flag on user wheel
      isProgrammaticScrollRef.current = false
    }

    const handleScroll = () => {
      // Only update if not programmatic scroll
      if (!isProgrammaticScrollRef.current) {
        updateActiveSectionFromScroll()
      }
    }

    const handleScrollEnd = () => {
      // Reset flag after scroll animation ends
      isProgrammaticScrollRef.current = false
    }

    container.addEventListener('wheel', handleWheel)
    container.addEventListener('scroll', handleScroll)
    container.addEventListener('scrollend', handleScrollEnd)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('scrollend', handleScrollEnd)
    }
  }, [updateActiveSectionFromScroll])

  return (
    <Layout className="app-container">
      <Sider
        width={200}
        style={{
          background: 'rgba(238, 242, 249, 0.60)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <div className="logo">
          <img src={logo} />
        </div>
        <SideNav activeKey={activeSection} onSectionChange={handleSectionChange} />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            background: 'white',
            borderBottom: '1px solid #f0f0f0',
            position: 'fixed',
            top: 0,
            width: 'calc(1440px - 200px)',
            zIndex: 10
          }}
        >
          <TopBar />
        </Header>
        <Content
          ref={contentRef}
          style={{ overflowY: 'auto', background: '#f3f5f7', padding: 0, marginTop: 60 }}
        >
          <MainContent activeSection={activeSection} />
        </Content>
      </Layout>
    </Layout>

  )
}

export default App
