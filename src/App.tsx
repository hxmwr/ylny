import { useRef, useState } from "react"
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

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)

    // Scroll to section
    const section = document.getElementById(sectionId)
    if (section) {
      const offsetTop = section.offsetTop - 54 - 24 // Account for header height and padding
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

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
        <Content style={{ background: '#f3f5f7', padding: 0, marginTop: 54 }}>
          <MainContent ref={contentRef} activeSection={activeSection} />
        </Content>
      </Layout>
    </Layout>

  )
}

export default App
