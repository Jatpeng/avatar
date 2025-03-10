import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AvatarRenderer from './components/avatar/AvatarRenderer';
import ParameterPanel from './components/editor/ParameterPanel';
import DataCollectionForm from './components/data-collection/DataCollectionForm';
import { ParameterCategory } from './types/avatar';
import './App.css';

const Home: React.FC = () => (
  <div className="home-container">
    <h2>欢迎使用3D虚拟AI形象系统</h2>
    <p>本系统可以帮助您创建和定制个性化的3D虚拟形象</p>
    <div className="feature-links">
      <Link to="/avatar" className="feature-link">查看3D形象</Link>
      <Link to="/editor" className="feature-link">编辑形象参数</Link>
      <Link to="/data-collection" className="feature-link">数据采集</Link>
    </div>
  </div>
);

const App: React.FC = () => {
  // 示例参数，实际应用中应从状态管理中获取
  const dummyParameters = [
    {
      id: 'height',
      name: '身高',
      category: ParameterCategory.BODY,
      min: 150,
      max: 200,
      default: 175,
      step: 1
    },
    {
      id: 'hairStyle',
      name: '发型',
      category: ParameterCategory.FACE,
      default: '短发',
      options: ['短发', '长发', '卷发', '秃顶']
    }
  ];

  const handleParameterChange = (parameterId: string, value: number | string) => {
    console.log('参数变更:', parameterId, value);
  };

  const handleDataSubmit = (data: any) => {
    console.log('提交数据:', data);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>3D虚拟AI形象系统</h1>
          <nav className="app-nav">
            <Link to="/">首页</Link>
            <Link to="/avatar">3D形象</Link>
            <Link to="/editor">参数编辑</Link>
            <Link to="/data-collection">数据采集</Link>
          </nav>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/avatar" element={<AvatarRenderer modelUrl="/models/default-avatar.glb" />} />
            <Route path="/editor" element={
              <ParameterPanel 
                category={ParameterCategory.BODY} 
                parameters={dummyParameters}
                onParameterChange={handleParameterChange}
                onReset={() => console.log('重置参数')}
                onRandomize={() => console.log('随机参数')}
              />
            } />
            <Route path="/data-collection" element={
              <DataCollectionForm 
                onSubmit={handleDataSubmit}
                onCancel={() => console.log('取消数据采集')}
              />
            } />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2023 3D虚拟AI形象系统</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;