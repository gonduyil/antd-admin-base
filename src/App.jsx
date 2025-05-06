import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import { DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Role from './pages/Role';
import Permission from './pages/Permission';
import './App.css';
import { useEffect, useState } from 'react';

const { Header, Content, Sider } = Layout;

const routeConfig = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: <DashboardOutlined />,
    element: <Dashboard />,
  },
  {
    path: '/users',
    name: '用户管理',
    icon: <UserOutlined />,
    element: <Users />,
    children: [
      {
        path: '/users/role',
        name: '角色管理',
        element: <Role />,
      },
      {
        path: '/users/permission',
        name: '权限管理',
        element: <Permission />,
      },
    ],
  },
];

const flattenRoutes = (routes) => {
  const result = [];
  routes.forEach((r) => {
    result.push({ path: r.path, element: r.element });
    if (r.children) {
      r.children.forEach((child) => result.push({ path: child.path, element: child.element }));
    }
  });
  return result;
};

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);


  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    // 解析路径，例如 '/users/role' => ['/users']
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length > 1) {
      setOpenKeys(['/' + segments[0]]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const buildMenuItems = (routes) =>
    routes.map((route) => ({
      key: route.path,
      icon: route.icon,
      label: route.name,
      children: route.children?.map((child) => ({
        key: child.path,
        label: child.name,
      })),
    }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 外部按钮控制 Sider 的折叠和展开 */}
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          position: 'fixed',
          top: 20,
          left: collapsed ? 80 : 200, // 随着侧边栏变化而变化
          zIndex: 2
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Sider

        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          position: 'fixed',
          top: 5,
          left: 16,
          bottom: 16,  // 留出16px底部空间
          height: 'calc(100vh - 16px)',  // 保证Sider高度，留出16px底部空间
          width: 200,
          borderRadius: 8,
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="logo" style={{ color: 'white', padding: '16px' }}>管理后台</div>
        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onClick={({ key }) => navigate(key)}
          items={buildMenuItems(routeConfig)}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 232 }}
      >
        <Header
          style={{
            position: 'fixed',
            top: 16,
            left: collapsed? 120:238,
            right: 16,
            zIndex: 1,
            background: '#fff',
            padding: '0 16px',
            height: 64,
            lineHeight: '64px',
            borderBottom: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >

        </Header>
        <Content style={{ margin: '16px', padding: '16px' }}>
          <div
            style={{
              position: 'fixed',
              top: 16,
              left: collapsed? 120:238,
              right: 16,
              zIndex: 1,
              marginTop: 80, // 保证Content不被Header遮挡
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              minHeight: 'calc(100vh - 64px - 48px)', // 64 header + 2x margin
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              overflow: 'auto', // 保证内容区滚动
            }}
          >
            <Routes>
              {flattenRoutes(routeConfig).map((r) => (
                <Route path={r.path} element={r.element} key={r.path} />
              ))}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
