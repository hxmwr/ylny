import { useEffect, useRef, useState } from "react"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import './app.css'
import logo from './assets/logo.png'
import SideNav from "./SideNav"
import TopBar from "./TopBar"
import MainContent from "./MainContent"

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScale = () => {
      const scale = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080,
      )

      document.documentElement.style.setProperty('--scale', scale.toString())
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)

    // Scroll to section
    const section = document.getElementById(sectionId)
    if (section && contentRef.current) {
      const container = contentRef.current
      const offsetTop = section.offsetTop - 24 // Account for padding
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="app-stage">
      <Layout className="app-container">
        <Sider width="300px" style={{ background: 'rgba(238, 242, 249, 0.60)', borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <div className="logo">
            <img src={logo} />
          </div>
          <SideNav activeKey={activeSection} onSectionChange={handleSectionChange} />
        </Sider>
        <Layout>
          <Header style={{ height: 80, background: 'white', borderBottom: '1px solid #f0f0f0' }}>
            <TopBar />
          </Header>
          <Content style={{ background: '#f3f5f7', padding: 0 }}>
            <MainContent ref={contentRef} activeSection={activeSection} />
          </Content>
        </Layout>
      </Layout>
    </div>

  )
}

export default App
