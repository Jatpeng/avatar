# 3D虚拟AI形象系统数据采集模块设计

## 1. 模块概述

数据采集模块是整个3D虚拟AI形象系统的基础，负责从多种来源获取用户数据，为后续的数据处理和3D渲染提供必要的输入。本文档详细说明数据采集模块的API接口设计、数据结构定义以及实现方案。

## 2. 数据采集分类

### 2.1 设备信息采集

#### 2.1.1 采集内容

| 数据类型 | 说明 | 采集方式 |
|---------|------|--------|
| 设备类型 | 手机/平板/可穿戴设备 | 系统API |
| 系统版本 | iOS/Android/其他 | 系统API |
| 硬件规格 | CPU/GPU/内存 | 系统API |
| 摄像头规格 | 分辨率/帧率/类型 | 设备API |
| 传感器列表 | 可用传感器类型 | 设备API |

#### 2.1.2 API接口

```typescript
// 设备信息采集接口
interface DeviceInfoCollector {
  /**
   * 获取基本设备信息
   * @returns 设备基本信息对象
   */
  getBasicDeviceInfo(): Promise<DeviceInfo>;
  
  /**
   * 获取设备传感器列表
   * @returns 可用传感器列表
   */
  getAvailableSensors(): Promise<SensorInfo[]>;
  
  /**
   * 获取摄像头规格
   * @returns 摄像头规格信息
   */
  getCameraSpecs(): Promise<CameraSpecs>;
  
  /**
   * 检测设备兼容性
   * @returns 兼容性检测结果
   */
  checkCompatibility(): Promise<CompatibilityResult>;
}

// 设备信息数据结构
interface DeviceInfo {
  deviceId: string;           // 设备唯一标识
  deviceType: string;         // 设备类型
  systemName: string;         // 系统名称
  systemVersion: string;      // 系统版本
  manufacturer: string;       // 制造商
  model: string;              // 型号
  hardwareSpecs: HardwareSpecs; // 硬件规格
  timestamp: number;          // 采集时间戳
}

interface HardwareSpecs {
  cpuModel: string;           // CPU型号
  cpuCores: number;           // CPU核心数
  gpuModel: string;           // GPU型号
  totalMemory: number;        // 总内存(MB)
  screenResolution: {
    width: number;            // 屏幕宽度
    height: number;           // 屏幕高度
    ppi: number;              // 屏幕像素密度
  };
}

interface SensorInfo {
  sensorId: string;           // 传感器ID
  sensorType: SensorType;     // 传感器类型
  manufacturer: string;       // 制造商
  accuracy: number;           // 精度
  maxRange: number;           // 最大范围
  minDelay: number;           // 最小延迟
  power: number;              // 功耗
  isAvailable: boolean;       // 是否可用
}

enum SensorType {
  ACCELEROMETER = 'accelerometer',
  GYROSCOPE = 'gyroscope',
  MAGNETOMETER = 'magnetometer',
  PROXIMITY = 'proximity',
  LIGHT = 'light',
  PRESSURE = 'pressure',
  HEART_RATE = 'heart_rate',
  STEP_COUNTER = 'step_counter'
}

interface CameraSpecs {
  hasFrontCamera: boolean;    // 是否有前置摄像头
  hasBackCamera: boolean;     // 是否有后置摄像头
  frontCamera?: {
    resolution: {
      width: number;          // 宽度
      height: number;         // 高度
    };
    focalLength: number;      // 焦距
    aperture: number;         // 光圈
    supportsFaceDetection: boolean; // 是否支持面部检测
  };
  maxFps: number;             // 最大帧率
  supportedFormats: string[]; // 支持的格式
}

interface CompatibilityResult {
  isCompatible: boolean;      // 是否兼容
  missingFeatures: string[];  // 缺失功能列表
  recommendations: string[];  // 建议
}
```

### 2.2 用户身体数据采集

#### 2.2.1 采集内容

| 数据类型 | 说明 | 采集方式 |
|---------|------|--------|
| 身高 | 用户身高(cm) | 用户输入/传感器 |
| 体重 | 用户体重(kg) | 用户输入/传感器 |
| 体型 | 身体比例数据 | 图像分析/用户输入 |
| 面部特征 | 面部关键点数据 | 摄像头+CV算法 |
| 肤色 | 皮肤色调 | 图像分析 |
| 发型特征 | 发型、发色数据 | 图像分析/用户输入 |

#### 2.2.2 API接口

```typescript
// 用户身体数据采集接口
interface PhysicalDataCollector {
  /**
   * 获取用户输入的基本身体数据
   * @param userData 用户输入数据
   * @returns 处理后的用户身体数据
   */
  collectUserInputData(userData: UserInputData): Promise<UserPhysicalData>;
  
  /**
   * 通过摄像头采集面部特征
   * @param options 面部采集选项
   * @returns 面部特征数据
   */
  captureFacialFeatures(options: CaptureOptions): Promise<FacialFeatures>;
  
  /**
   * 分析用户体型
   * @param imageData 用户全身图像数据
   * @returns 体型分析结果
   */
  analyzeBodyType(imageData: ImageData): Promise<BodyTypeAnalysis>;
  
  /**
   * 检测肤色
   * @param imageData 面部图像数据
   * @returns 肤色分析结果
   */
  detectSkinTone(imageData: ImageData): Promise<SkinToneResult>;
  
  /**
   * 分析发型特征
   * @param imageData 头部图像数据
   * @returns 发型特征分析
   */
  analyzeHairFeatures(imageData: ImageData): Promise<HairFeatures>;
}

// 用户身体数据结构
interface UserInputData {
  height?: number;            // 身高(cm)
  weight?: number;            // 体重(kg)
  age?: number;               // 年龄
  gender?: string;            // 性别
  bodyType?: string;          // 用户选择的体型
  preferences?: {
    [key: string]: any;       // 用户偏好设置
  };
}

interface UserPhysicalData {
  userId: string;             // 用户ID
  height: number;             // 身高(cm)
  weight: number;             // 体重(kg)
  bmi: number;                // 体质指数
  bodyType: string;           // 体型分类
  bodyProportions: BodyProportions; // 身体比例
  skinTone: string;           // 肤色
  hairFeatures: HairFeatures; // 发型特征
  facialFeatures: FacialFeatures; // 面部特征
  timestamp: number;          // 采集时间戳
}

interface BodyProportions {
  shoulderWidth: number;      // 肩宽
  chestCircumference: number; // 胸围
  waistCircumference: number; // 腰围
  hipCircumference: number;   // 臀围
  legLength: number;          // 腿长
  armLength: number;          // 臂长
  neckLength: number;         // 颈长
}

interface FacialFeatures {
  faceShape: string;          // 脸型
  landmarks: FacialLandmark[];
  eyeColor: string;           // 眼睛颜色
  eyeDistance: number;        // 眼距
  noseShape: string;          // 鼻子形状
  lipShape: string;           // 嘴唇形状
  jawline: string;            // 下颌线
  facialSymmetry: number;     // 面部对称度(0-1)
}

interface FacialLandmark {
  type: LandmarkType;         // 特征点类型
  position: {
    x: number;               // x坐标
    y: number;               // y坐标
    z?: number;              // z坐标(可选)
  };
}

enum LandmarkType {
  LEFT_EYE = 'left_eye',
  RIGHT_EYE = 'right_eye',
  NOSE_TIP = 'nose_tip',
  MOUTH_LEFT = 'mouth_left',
  MOUTH_RIGHT = 'mouth_right',
  // 更多面部特征点...
}

interface HairFeatures {
  hairColor: string;          // 发色
  hairLength: string;         // 发长
  hairType: string;           // 发质(直发/卷发等)
  hairStyle: string;          // 发型
  hairDensity: number;        // 发密度(0-1)
}

interface CaptureOptions {
  captureHighResolution: boolean; // 是否高分辨率
  detectExpressions: boolean;    // 是否检测表情
  captureDepthData: boolean;     // 是否采集深度数据
  numberOfFrames: number;        // 采集帧数
}

interface BodyTypeAnalysis {
  bodyType: string;           // 体型分类
  confidence: number;         // 置信度(0-1)
  bodyProportions: BodyProportions; // 身体比例
  posture: string;            // 姿势评估
}

interface SkinToneResult {
  dominantTone: string;       // 主要肤色
  rgbValue: [number, number, number]; // RGB值
  undertone: string;          // 肤色基调(暖/冷/中性)
  confidence: number;         // 置信度(0-1)
}
```

### 2.3 生活习惯数据采集

#### 2.3.1 采集内容

| 数据类型 | 说明 | 采集方式 |
|---------|------|--------|
| 睡眠数据 | 睡眠时间/质量 | 可穿戴设备/用户输入 |
| 运动数据 | 运动类型/频率/强度 | 健康应用/可穿戴设备 |
| 日常活动 | 活动类型/频率 | 应用使用记录/用户输入 |

#### 2.3.2 API接口

```typescript
// 生活习惯数据采集接口
interface LifestyleDataCollector {
  /**
   * 获取睡眠数据
   * @param timeRange 时间范围
   * @returns 睡眠数据
   */
  getSleepData(timeRange: TimeRange): Promise<SleepData[]>;
  
  /**
   * 获取运动习惯数据
   * @param timeRange 时间范围
   * @returns 运动数据
   */
  getExerciseData(timeRange: TimeRange): Promise<ExerciseData[]>;
  
  /**
   * 获取日常活动数据
   * @param timeRange 时间范围
   * @returns 活动数据
   */
  getDailyActivityData(timeRange: TimeRange): Promise<ActivityData[]>;
  
  /**
   * 从健康应用导入数据
   * @param source 数据源
   * @param dataTypes 数据类型
   * @returns 导入结果
   */
  importFromHealthApp(source: HealthAppSource, dataTypes: string[]): Promise<ImportResult>;
}

// 生活习惯数据结构
interface TimeRange {
  startDate: Date;            // 开始日期
  endDate: Date;              // 结束日期
}

interface SleepData {
  date: Date;                 // 日期
  bedTime: Date;              // 上床时间
  wakeTime: Date;             // 起床时间
  totalSleepTime: number;     // 总睡眠时间(分钟)
  deepSleepTime: number;      // 深度睡眠时间(分钟)
  remSleepTime: number;       // REM睡眠时间(分钟)
  lightSleepTime: number;     // 浅度睡眠时间(分钟)
  awakeTime: number;          // 清醒时间(分钟)
  sleepQuality: number;       // 睡眠质量评分(0-100)
  heartRateAvg: number;       // 平均心率
  respirationRateAvg: number; // 平均呼吸率
  source: string;             // 数据来源