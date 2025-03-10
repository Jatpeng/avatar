# 3D虚拟AI形象系统代码实现细节

本文档将项目需求拆分为具体的代码实现细节，包括前端组件结构、后端API设计、数据模型定义以及关键算法实现。

## 1. 项目结构设计

### 1.1 前端项目结构

```
avatar-frontend/
├── public/
│   ├── assets/
│   │   ├── models/         # 3D模型资源
│   │   ├── textures/       # 纹理资源
│   │   └── animations/     # 动画资源
│   └── index.html
├── src/
│   ├── components/         # React组件
│   │   ├── common/         # 通用UI组件
│   │   ├── layout/         # 布局组件
│   │   ├── avatar/         # 形象相关组件
│   │   ├── editor/         # 编辑器组件
│   │   └── data-collection/ # 数据采集组件
│   ├── hooks/              # 自定义React Hooks
│   ├── services/           # API服务
│   ├── store/              # Redux状态管理
│   ├── utils/              # 工具函数
│   ├── three/              # Three.js相关代码
│   │   ├── core/           # 核心渲染逻辑
│   │   ├── loaders/        # 模型加载器
│   │   ├── controls/       # 控制器
│   │   └── effects/        # 特效
│   ├── ai/                 # AI相关代码
│   │   ├── feature-extraction/ # 特征提取
│   │   └── mapping/        # 参数映射
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

### 1.2 后端项目结构

```
avatar-backend/
├── src/
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   ├── services/           # 业务逻辑
│   │   ├── data-processing/ # 数据处理服务
│   │   ├── avatar-generation/ # 形象生成服务
│   │   └── user-management/ # 用户管理服务
│   ├── middleware/         # 中间件
│   ├── utils/              # 工具函数
│   ├── config/             # 配置文件
│   └── app.js              # 应用入口
├── package.json
└── .env.example           # 环境变量示例
```

## 2. 前端代码实现

### 2.1 核心组件实现

#### 2.1.1 3D渲染引擎组件

```tsx
// src/components/avatar/AvatarRenderer.tsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AvatarModel } from '../../types/avatar';

interface AvatarRendererProps {
  modelUrl: string;
  backgroundColor?: string;
  environmentPreset?: string;
  onLoadComplete?: () => void;
}

const Avatar: React.FC<{ model: AvatarModel }> = ({ model }) => {
  const { scene } = useGLTF(model.url);
  const meshRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      // 应用模型参数
      applyModelParameters(meshRef.current, model.parameters);
    }
  }, [model.parameters]);
  
  useFrame((state, delta) => {
    // 处理动画和更新
    if (meshRef.current && model.animation) {
      updateAnimation(meshRef.current, model.animation, delta);
    }
  });
  
  return <primitive object={scene} ref={meshRef} />;
};

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  modelUrl,
  backgroundColor = '#f5f5f5',
  environmentPreset = 'city',
  onLoadComplete
}) => {
  const avatarModel = useSelector((state: RootState) => state.avatar.currentModel);
  
  return (
    <div style={{ width: '100%', height: '100%', background: backgroundColor }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Environment preset={environmentPreset} />
        <Avatar model={avatarModel} />
        <OrbitControls 
          enablePan={false}
          minDistance={1.5}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

// 辅助函数
function applyModelParameters(model: THREE.Group, parameters: any) {
  // 应用身体参数
  if (parameters.body) {
    applyBodyParameters(model, parameters.body);
  }
  
  // 应用面部参数
  if (parameters.face) {
    applyFacialParameters(model, parameters.face);
  }
  
  // 应用纹理参数
  if (parameters.texture) {
    applyTextureParameters(model, parameters.texture);
  }
}

function applyBodyParameters(model: THREE.Group, bodyParams: any) {
  // 实现身体参数应用逻辑
  // 例如调整骨骼比例、形态混合等
}

function applyFacialParameters(model: THREE.Group, faceParams: any) {
  // 实现面部参数应用逻辑
  // 例如调整面部特征点、表情等
}

function applyTextureParameters(model: THREE.Group, textureParams: any) {
  // 实现纹理参数应用逻辑
  // 例如调整皮肤颜色、材质等
}

function updateAnimation(model: THREE.Group, animation: any, delta: number) {
  // 实现动画更新逻辑
}
```

#### 2.1.2 参数调整面板组件

```tsx
// src/components/editor/ParameterPanel.tsx
import React from 'react';
import { Slider, Select, Tabs, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateBodyParameter, updateFacialParameter, updateTextureParameter } from '../../store/slices/avatarSlice';
import { Parameter, ParameterCategory } from '../../types/parameters';

const { TabPane } = Tabs;
const { Option } = Select;

interface ParameterPanelProps {
  category: ParameterCategory;
  onReset?: () => void;
  onRandomize?: () => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  category,
  onReset,
  onRandomize
}) => {
  const dispatch = useDispatch();
  const parameters = useSelector((state: RootState) => {
    switch (category) {
      case 'body':
        return state.avatar.bodyParameters;
      case 'face':
        return state.avatar.facialParameters;
      case 'texture':
        return state.avatar.textureParameters;
      default:
        return [];
    }
  });
  
  const handleParameterChange = (parameter: Parameter, value: number) => {
    switch (category) {
      case 'body':
        dispatch(updateBodyParameter({ id: parameter.id, value }));
        break;
      case 'face':
        dispatch(updateFacialParameter({ id: parameter.id, value }));
        break;
      case 'texture':
        dispatch(updateTextureParameter({ id: parameter.id, value }));
        break;
    }
  };
  
  const handlePresetSelect = (parameter: Parameter, presetKey: string) => {
    const presetValue = parameter.presets?.[presetKey];
    if (presetValue !== undefined) {
      handleParameterChange(parameter, presetValue);
    }
  };
  
  return (
    <Card title={`${category.charAt(0).toUpperCase() + category.slice(1)} 参数`}>
      <div className="parameter-panel-controls">
        <Button onClick={onReset}>重置</Button>
        <Button onClick={onRandomize}>随机</Button>
      </div>
      
      <div className="parameter-list">
        {parameters.map((param) => (
          <div key={param.id} className="parameter-item">
            <div className="parameter-header">
              <span className="parameter-name">{param.name}</span>
              {param.presets && (
                <Select 
                  size="small" 
                  placeholder="预设"
                  onChange={(value) => handlePresetSelect(param, value)}
                >
                  {Object.entries(param.presets).map(([key, _]) => (
                    <Option key={key} value={key}>{key}</Option>
                  ))}
                </Select>
              )}
            </div>
            
            <Slider
              min={param.min}
              max={param.max}
              step={param.step}
              value={param.value}
              onChange={(value) => handleParameterChange(param, value as number)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
```

#### 2.1.3 数据采集组件

```tsx
// src/components/data-collection/DataCollectionForm.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Steps, message, Upload, Select } from 'antd';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setUserPhysicalData } from '../../store/slices/dataCollectionSlice';
import { captureUserImage, analyzeFacialFeatures } from '../../services/dataCollectionService';

const { Step } = Steps;
const { Option } = Select;

export const DataCollectionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [facialFeatures, setFacialFeatures] = useState(null);
  
  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleCaptureFace = async () => {
    try {
      setLoading(true);
      const imageData = await captureUserImage();
      const features = await analyzeFacialFeatures(imageData);
      setFacialFeatures(features);
      form.setFieldsValue({ facialFeatures: features });
      message.success('面部特征采集成功');
    } catch (error) {
      message.error('面部特征采集失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinish = (values: any) => {
    dispatch(setUserPhysicalData(values));
    message.success('数据采集完成');
  };
  
  const steps = [
    {
      title: '基本信息',
      content: (
        <>
          <Form.Item name="height" label="身高(cm)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="weight" label="体重(kg)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select>
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: '面部特征',
      content: (
        <>
          <Form.Item name="facialFeatures" hidden>
            <Input />
          </Form.Item>
          <div className="facial-capture-container">
            <Button 
              icon={<CameraOutlined />} 
              onClick={handleCaptureFace} 
              loading={loading}
            >
              采集面部特征
            </Button>
            {facialFeatures && (
              <div className="facial-features-preview">
                <p>面部特征采集成功</p>
                {/* 可以添加面部特征预览 */}
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      title: '生活习惯',
      content: (
        <>
          <Form.Item name="sleepHours" label="平均睡眠时间(小时)">            <Input type="number" />
          </Form.Item>
          <Form.Item name="exerciseFrequency" label="每周运动频率">
            <Select>
              <Option value="rarely">很少</Option>
              <Option value="occasionally">偶尔</Option>
              <Option value="regularly">经常</Option>
              <Option value="frequently">频繁</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dailyActivities" label="日常活动">
            <Select mode="multiple">
              <Option value="reading">阅读</Option>
              <Option value="gaming">游戏</Option>
              <Option value="sports">运动</Option>
              <Option value="music">音乐</Option>
              <Option value="art">艺术</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];
  
  return (
    <div className="data-collection-form">
      <Steps current={currentStep}>
        {steps.map(step => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="steps-content">
          {steps[currentStep].content}
        </div>
        
        <div className="steps-action">
          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={handlePrev}>
              上一步
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              完成
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};
```

### 2.2 Redux状态管理

#### 2.2.1 Store配置

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from './slices/avatarSlice';
import dataCollectionReducer from './slices/dataCollectionSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
    dataCollection: dataCollectionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 2.2.2 Avatar状态切片

```tsx
// src/store/slices/avatarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AvatarModel, BodyParameter, FacialParameter, TextureParameter } from '../../types/avatar';

interface AvatarState {
  currentModel: AvatarModel;
  bodyParameters: BodyParameter[];
  facialParameters: FacialParameter[];
  textureParameters: TextureParameter[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AvatarState = {
  currentModel: {
    id: '',
    url: '',
    parameters: {
      body: {},
      face: {},
      texture: {},
    },
    animation: null,
  },
  bodyParameters: [],
  facialParameters: [],
  textureParameters: [],
  isLoading: false,
  error: null,
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setCurrentModel(state, action: PayloadAction<AvatarModel>) {
      state.currentModel = action.payload;
    },
    setBodyParameters(state, action: PayloadAction<BodyParameter[]>) {
      state.bodyParameters = action.payload;
    },
    setFacialParameters(state, action: PayloadAction<FacialParameter[]>) {
      state.facialParameters = action.payload;
    },
    setTextureParameters(state, action: PayloadAction<TextureParameter[]>) {
      state.textureParameters = action.payload;
    },
    updateBodyParameter(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      const parameter = state.bodyParameters.find(param => param.id === id);
      if (parameter) {
        parameter.value = value;
        // 更新当前模型的对应参数
        state.currentModel.parameters.body[id] = value;
      }
    },
    updateFacialParameter(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      const parameter = state.facialParameters.find(param => param.id === id);
      if (parameter) {
        parameter.value = value;
        // 更新当前模型的对应参数
        state.currentModel.parameters.face[id] = value;
      }
    },
    updateTextureParameter(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      const parameter = state.textureParameters.find(param => param.id === id);
      if (parameter) {
        parameter.value = value;
        // 更新当前模型的对应参数
        state.currentModel.parameters.texture[id] = value;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentModel,
  setBodyParameters,
  setFacialParameters,
  setTextureParameters,
  updateBodyParameter,
  updateFacialParameter,
  updateTextureParameter,
  setLoading,
  setError,
} = avatarSlice.actions;

export default avatarSlice.reducer;
```

## 3. 后端代码实现

### 3.1 数据模型定义

```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Avatar',
  }],
  physicalData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhysicalData',
  },
  lifestyleData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LifestyleData',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 密码加密中间件
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 密码验证方法
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

```javascript
// src/models/Avatar.js
const mongoose = require('mongoose');

const AvatarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  modelUrl: {
    type: String,
    required: true,
  },
  parameters: {
    body: {
      type: Map,
      of: Number,
      default: {},
    },
    face: {
      type: Map,
      of: Number,
      default: {},
    },
    texture: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  thumbnail: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Avatar', AvatarSchema);
```

### 3.2 API控制器

```javascript
// src/controllers/avatarController.js
const Avatar = require('../models/Avatar');
const User = require('../models/User');
const { generateAvatar } = require('../services/avatar-generation/avatarGenerator');

// 创建新形象
exports.createAvatar = async (req, res) => {
  try {
    const { name, parameters } = req.body;
    const userId = req.user.id;
    
    // 生成形象
    const avatarData = await generateAvatar(parameters);
    
    // 创建形象记录
    const avatar = new Avatar({
      user: userId,
      name,
      modelUrl: avatarData.modelUrl,
      parameters,
      thumbnail: avatarData.thumbnail,
    });
    
    await avatar.save();
    
    // 更新用户的形象列表
    await User.findByIdAndUpdate(userId, {
      $push: { avatars: avatar._id },
    });
    
    res.status(201).json({
      success: true,
      data: avatar,
    });
  } catch (error) {
    console.error('Avatar creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create avatar',
    });
  }
};

// 获取用户所有形象
exports.getUserAvatars = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const avatars = await Avatar.find({ user: userId });
    
    res.status(200).json({
      success: true,
      count: avatars.length,
      data: avatars,
    });
  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve avatars',
    });
  }
};

// 获取单个形象详情
exports.getAvatarById = async (req, res) => {
  try {
    const avatarId = req.params.id;
    const userId = req.user.id;
    
    const avatar = await Avatar.findById(avatarId);
    
    if (!avatar) {
      return res.status(404).json({
        success: false,
        error: 'Avatar not found',
      });
    }
    
    // 检查权限
    if (avatar.user.toString() !== userId && !avatar.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this avatar',
      });
    }
    
    res.status(200).json({
      success: true,
      data: avatar,
    });
  } catch (error) {
    console.error('Get avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve avatar',
    });
  }
};
```

### 3.3 路由定义

```javascript
// src/routes/avatarRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createAvatar,
  getUserAvatars,
  getAvatarById,
  updateAvatar,
  deleteAvatar,
} = require('../controllers/avatarController');

const router = express.Router();

router.route('/')
  .post(protect, createAvatar)
  .get(protect, getUserAvatars);

router.route('/:id')
  .get(protect, getAvatarById)
  .put(protect, updateAvatar)
  .delete(protect, deleteAvatar);

module.exports = router;
```

## 4. AI特征提取与参数映射

### 4.1 面部特征提取

```javascript
// src/services/data-processing/facialFeatureExtractor.js
const tf = require('@tensorflow/tfjs-node');
const { loadFaceLandmarkModel } = require('../../utils/modelLoader');

let faceLandmarkModel = null;

// 加载面部特征点检测模型
async function loadModel() {
  if (!faceLandmarkModel) {
    faceLandmarkModel = await loadFaceLandmarkModel();
  }
  return faceLandmarkModel;
}

// 提取面部特征点
async function extractFacialLandmarks(imageData) {
  try {
    const model = await loadModel();
    
    // 预处理图像
    const tensor = preprocessImage(imageData);
    
    // 模型推理
    const predictions = await model.predict(tensor);
    
    // 后处理结果
    const landmarks = postprocessLandmarks(predictions);
    
    // 释放资源
    tensor.dispose();
    predictions.dispose();
    
    return landmarks;
  } catch (error) {
    console.error('Facial landmark extraction error:', error);
    throw new Error('Failed to extract facial landmarks');
  }
}

// 图像预处理
function preprocessImage(imageData) {
  // 将图像转换为张量
  const tensor = tf.browser.fromPixels(imageData);
  
  // 调整大小为模型输入尺寸
  const resized = tf.image.resizeBilinear(tensor, [224, 224]);
  
  // 归一化像素值到[-1, 1]
  const normalized = resized.div(127.5).sub(1);
  
  // 添加批次维度
  const batched = normalized.expandDims(0);
  
  // 释放中间张量
  tensor.dispose();
  resized.dispose();
  normalized.dispose();
  
  return batched;
}

// 后处理特征点
function postprocessLandmarks(predictions) {
  // 将预测结果转换为JavaScript数组
  const rawLandmarks = predictions.dataSync();
  
  // 整理为特征点格式
  const landmarks = [];
  for (let i = 0; i < rawLandmarks.length; i += 2) {
    landmarks.push({
      x: rawLandmarks[i],
      y: rawLandmarks[i + 1],
    });
  }
  
  return landmarks;
}

// 分析面部特征
async function analyzeFacialFeatures(landmarks) {
  // 计算面部比例和特征
  const eyeDistance = calculateEyeDistance(landmarks);
  const faceShape = determineFaceShape(landmarks);
  const noseShape = determineNoseShape(landmarks);
  const lipShape = determineLipShape(landmarks);
  
  return {
    faceShape,
    eyeDistance,
    noseShape,
    lipShape,
    landmarks,
  };
}

// 计算眼距
function calculateEyeDistance(landmarks) {
  const leftEye = landmarks[36]; // 左眼外角
  const rightEye = landmarks[45]; // 右眼外角
  
  return Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) +
    Math.pow(rightEye.y - leftEye.y, 2)
  );
}

// 确定脸型
function determineFaceShape(landmarks) {
  // 基于特征点分析脸型
  // 实际实现会更复杂，这里简化处理
  const jawWidth = landmarks[16].x - landmarks[0].x;
  const faceHeight = landmarks[8].y - landmarks[27].y;
  const foreheadWidth = landmarks[26].x - landmarks[17].x;
  
  const jawToForeheadRatio = jawWidth / foreheadWidth;
  const widthToHeightRatio = jawWidth / faceHeight;
  
  if (jawToForeheadRatio < 0.8) {
    return 'heart';
  } else if (jawToForeheadRatio > 1.2) {
    return 'square';
  } else if (widthToHeightRatio < 0.75) {
    return 'oval';
  } else if (widthToHeightRatio > 0.85) {
    return 'round';
  } else {
    return 'diamond';
  }
}

// 确定鼻型
function determineNoseShape(landmarks) {
  // 基于特征点分析鼻型
  // 简化实现
  return 'straight';
}

// 确定唇型
function determineLipShape(landmarks) {
  // 基于特征点分析唇型
  // 简化实现
  return 'medium';
}

module.exports = {
  extractFacialLandmarks,
  analyzeFacialFeatures,
};
```

### 4.2 参数映射系统

```javascript
// src/services/data-processing/parameterMapper.js
const { analyzeFacialFeatures } = require('./facialFeatureExtractor');
const { analyzeBodyType } = require('./bodyTypeAnalyzer');

// 将用户数据映射到模型参数
async function mapUserDataToModelParameters(userData) {
  try {
    // 提取和分析面部特征
    const facialFeatures = userData.facialFeatures || await analyzeFacialFeatures(userData.faceImage);
    
    // 分析体型
    const bodyTypeAnalysis = userData.bodyTypeAnalysis || await analyzeBodyType(userData);
    
    // 映射身体参数
    const bodyParameters = mapBodyParameters(userData, bodyTypeAnalysis);
    
    // 映射面部参数
    const facialParameters = mapFacialParameters(facialFeatures);
    
    // 映射纹理参数
    const textureParameters = mapTextureParameters(userData);
    
    return {
      body: bodyParameters,
      face: facialParameters,
      texture: textureParameters,
    };
  } catch (error) {
    console.error('Parameter mapping error:', error);
    throw new Error('Failed to map user data to model parameters');
  }
}

// 映射身体参数
function mapBodyParameters(userData, bodyTypeAnalysis) {
  const { height, weight, gender, age } = userData;
  const { bodyType, bodyProportions } = bodyTypeAnalysis;
  
  // 计算BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // 基于BMI映射体重参数
  let weightParameter = 0.5;
  if (bmi < 18.5) {
    weightParameter = 0.3; // 偏瘦
  } else if (bmi > 25) {
    weightParameter = 0.7; // 偏胖
  }
  
  // 基于身高映射高度参数
  const heightParameter = height / 170; // 相对于170cm的比例
  
  // 基于性别调整参数
  const shoulderWidthBase = gender === 'male' ? 1.0 : 0.85;
  const hipSizeBase = gender === 'male' ? 0.9 : 1.0;
  
  return {
    height: heightParameter,
    weight: weightParameter,
    shoulderWidth: shoulderWidthBase * bodyProportions.shoulderWidth,
    chestSize: bodyProportions.chestCircumference / 100,
    waistSize: bodyProportions.waistCircumference / 100,
    hipSize: hipSizeBase * bodyProportions.hipCircumference / 100,
    legLength: bodyProportions.legLength / 100,
    armLength: bodyProportions.armLength / 100,
    neckLength: bodyProportions.neckLength / 100,
    bodyType: bodyType,
  };
}

// 映射面部参数
function mapFacialParameters(facialFeatures) {
  const { faceShape, eyeDistance, noseShape, lipShape, landmarks } = facialFeatures;
  
  // 计算面部比例参数
  const faceWidth = landmarks[16].x - landmarks[0].x;
  const faceHeight = landmarks[8].y - landmarks[27].y;
  const faceWidthToHeightRatio = faceWidth / faceHeight;
  
  // 计算眼睛参数
  const leftEyeWidth = landmarks[39].x - landmarks[36].x;
  const rightEyeWidth = landmarks[45].x - landmarks[42].x;
  const eyeSize = ((leftEyeWidth + rightEyeWidth) / 2) / faceWidth;
  
  // 计算鼻子参数
  const noseWidth = landmarks[35].x - landmarks[31].x;
  const noseLength = landmarks[33].y - landmarks[27].y;
  const noseWidthToFaceRatio = noseWidth / faceWidth;
  
  // 计算嘴巴参数
  const mouthWidth = landmarks[54].x - landmarks[48].x;
  const lipThickness = landmarks[57].y - landmarks[51].y;
  const mouthWidthToFaceRatio = mouthWidth / faceWidth;
  
  return {
    faceShape: faceShape,
    faceWidth: faceWidthToHeightRatio,
    eyeSize: eyeSize * 5, // 缩放到合适范围
    eyeDistance: eyeDistance / faceWidth,
    noseLength: noseLength / faceHeight,
    noseWidth: noseWidthToFaceRatio,
    mouthWidth: mouthWidthToFaceRatio,
    lipThickness: lipThickness / faceHeight * 10, // 缩放到合适范围
  };
}

// 映射纹理参数
function mapTextureParameters(userData) {
  const { skinTone, hairColor, eyeColor } = userData;
  
  // 默认值
  const defaultSkinTone = { r: 0.8, g: 0.7, b: 0.6 };
  const defaultHairColor = { r: 0.1, g: 0.1, b: 0.1 };
  const defaultEyeColor = { r: 0.3, g: 0.2, b: 0.1 };
  
  return {
    skinTone: skinTone || defaultSkinTone,
    hairColor: hairColor || defaultHairColor,
    eyeColor: eyeColor || defaultEyeColor,
    skinSmoothness: 0.7,
    hairShininess: 0.5,
  };
}

module.exports = {
  mapUserDataToModelParameters,
  mapBodyParameters,
  mapFacialParameters,
  mapTextureParameters,
};
```

## 5. 系统集成与部署

### 5.1 应用入口

```javascript
// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

// 路由导入
const userRoutes = require('./routes/userRoutes');
const avatarRoutes = require('./routes/avatarRoutes');
const dataCollectionRoutes = require('./routes/dataCollectionRoutes');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// API路由
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/avatars', avatarRoutes);
app.use('/api/v1/data-collection', dataCollectionRoutes);

// 前端应用服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
  });
});

// 数据库连接
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 5.2 Docker配置

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建前端
RUN cd client && npm install && npm run build

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["node", "src/app.js"]
```

```yaml
# docker-compose.yml
version: '3'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/avatar-system
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mongo

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 6. 总结

本文档详细描述了3D虚拟AI形象系统的代码实现细节，包括：

1. **项目结构设计**：前端和后端的目录结构和文件组织
2. **前端代码实现**：核心组件、状态管理和数据流
3. **后端代码实现**：数据模型、API控制器和路由定义
4. **AI特征提取与参数映射**：面部特征提取算法和参数映射系统
5. **系统集成与部署**：应用入口和Docker配置

通过这些实现细节，开发团队可以按照统一的标准和架构进行开发，确保系统各模块之间的协调工作和高效集成。