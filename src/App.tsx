import { useEffect } from "react"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import './app.css'
import logo from './assets/logo.png'
import SideNav from "./SideNav"
import TopBar from "./TopBar"

function App() {
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

  return (
    <div className="app-stage">
      <Layout className="app-container">
        <Sider width="300px" style={{ background: 'rgba(238, 242, 249, 0.60)', borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <div className="logo">
            <img src={logo} />
          </div>
          <SideNav />
        </Sider>
        <Layout>
          <Header style={{ height: 80, background: 'white' }}>
            <TopBar />
          </Header>
          <Content></Content>
        </Layout>
      </Layout>
    </div>

  )
}

export default App
