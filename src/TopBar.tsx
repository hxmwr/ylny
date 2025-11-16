import { Input, Space } from "antd";

export default function TopBar() {
    return <div className="topbar">
        <div></div>
        <div className="right">
            <Space style={{alignItems: 'center'}}>
                <Input.Search />
            </Space>
        </div>
    </div>
}