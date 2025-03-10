# 3D虚拟AI形象系统模型生成规范

## 1. 模型生成概述

3D模型生成模块是虚拟AI形象系统的核心组件，负责将数据处理模块提供的参数映射转换为可视化的3D模型。本文档详细说明模型生成的技术规范、参数映射标准以及实现方案。

## 2. 模型基础架构

### 2.1 基础模型库

#### 2.1.1 模型分类

| 模型类型 | 说明 | 三角面数范围 | 用途 |
|---------|------|------------|------|
| 基础人形模型 | 标准人体比例模型 | 5,000-20,000 | 初始化模型基础 |
| 面部细节模型 | 面部表情与细节 | 3,000-10,000 | 面部表情系统 |
| 发型模型集 | 各类发型模板 | 1,000-5,000 | 头发渲染基础 |
| 服装模型集 | 基础服装模板 | 2,000-8,000 | 服装系统基础 |

#### 2.1.2 模型标准

- **拓扑结构**：四边形主导拓扑，保证变形平滑性
- **UV映射**：标准化UV布局，0-1空间，无重叠
- **骨骼系统**：标准人形骨骼，支持动画重定向
- **LOD级别**：每个模型支持3级LOD

### 2.2 LOD分级策略

| LOD级别 | 距离范围 | 三角面数 | 纹理分辨率 | 应用场景 |
|---------|---------|---------|------------|----------|
| LOD0 (高模) | <5m | 20,000+ | 2048×2048 | 近距离观察、特写镜头 |
| LOD1 (中模) | 5-15m | 5,000-20,000 | 1024×1024 | 中距离交互、一般场景 |
| LOD2 (低模) | >15m | <5,000 | 512×512 | 远距离、群体场景 |

#### 2.2.1 LOD切换参数

```typescript
interface LODSwitchParameters {
  distanceThresholds: {
    high2medium: number;      // 高模切换到中模的距离阈值
    medium2low: number;       // 中模切换到低模的距离阈值
  };
  transitionDuration: number; // 切换过渡时间(秒)
  screenSizeThreshold: number; // 屏幕占比阈值
  performanceAdaptive: boolean; // 是否根据性能自适应调整
}
```

## 3. 参数映射系统

### 3.1 身体参数映射

#### 3.1.1 映射参数定义

```typescript
interface BodyMappingParameters {
  // 基础体型参数
  height: number;             // 身高比例 (0.5-1.5)
  weight: number;             // 体重影响 (0.5-1.5)
  muscularity: number;        // 肌肉度 (0-1)
  bodyFat: number;            // 体脂率 (0-1)
  
  // 身体比例参数
  shoulderWidth: number;      // 肩宽 (0.7-1.3)
  chestSize: number;          // 胸围 (0.7-1.3)
  waistSize: number;          // 腰围 (0.7-1.3)
  hipSize: number;            // 臀围 (0.7-1.3)
  legLength: number;          // 腿长 (0.8-1.2)
  armLength: number;          // 臂长 (0.8-1.2)
  neckLength: number;         // 颈长 (0.8-1.2)
  
  // 姿态参数
  postureType: PostureType;   // 姿态类型
  postureIntensity: number;   // 姿态强度 (0-1)
}

enum PostureType {
  STANDARD = 'standard',
  ATHLETIC = 'athletic',
  RELAXED = 'relaxed',
  TENSE = 'tense'
}
```

#### 3.1.2 映射算法

身体参数映射采用多层级变形系统：

1. **骨骼比例调整**：根据身高、四肢长度等参数调整骨骼比例
2. **形态混合**：基于体重、肌肉度等参数在预设形态之间进行混合
3. **局部变形**：应用特定区域的细节变形

```typescript
interface MorphingSystem {
  // 形态目标权重计算
  calculateMorphTargetWeights(bodyParams: BodyMappingParameters): MorphTargetWeights;
  
  // 骨骼比例调整
  adjustSkeletonProportions(bodyParams: BodyMappingParameters): SkeletonAdjustments;
  
  // 应用变形到模型
  applyMorphing(model: BaseModel, weights: MorphTargetWeights): MorphedModel;
}
```

### 3.2 面部参数映射

#### 3.2.1 映射参数定义

```typescript
interface FacialMappingParameters {
  // 基础面部参数
  faceShape: FaceShape;       // 脸型
  faceWidth: number;          // 脸宽 (0.8-1.2)
  faceLength: number;         // 脸长 (0.8-1.2)
  
  // 眼睛参数
  eyeSize: number;            // 眼睛大小 (0.8-1.2)
  eyeDistance: number;        // 眼距 (0.8-1.2)
  eyeRotation: number;        // 眼睛角度 (-10-10度)
  eyeColor: Color;            // 眼睛颜色
  
  // 鼻子参数
  noseLength: number;         // 鼻长 (0.8-1.2)
  noseWidth: number;          // 鼻宽 (0.8-1.2)
  noseBridge: number;         // 鼻梁高度 (0.8-1.2)
  
  // 嘴巴参数
  mouthWidth: number;         // 嘴宽 (0.8-1.2)
  lipThickness: number;       // 嘴唇厚度 (0.8-1.2)
  
  // 其他参数
  jawShape: JawShape;         // 下巴形状
  cheekboneHeight: number;    // 颧骨高度 (0.8-1.2)
  earSize: number;            // 耳朵大小 (0.8-1.2)
}

enum FaceShape {
  OVAL = 'oval',
  ROUND = 'round',
  SQUARE = 'square',
  HEART = 'heart',
  DIAMOND = 'diamond'
}

enum JawShape {
  ROUNDED = 'rounded',
  SQUARE = 'square',
  POINTED = 'pointed',
  ANGULAR = 'angular'
}

interface Color {
  r: number;                  // 红色分量 (0-1)
  g: number;                  // 绿色分量 (0-1)
  b: number;                  // 蓝色分量 (0-1)
}
```

#### 3.2.2 映射算法

面部参数映射采用基于特征点的变形系统：

1. **特征点定位**：根据面部参数计算关键特征点位置
2. **网格变形**：基于特征点位置变形面部网格
3. **细节混合**：应用细节纹理和法线贴图

```typescript
interface FacialMorphingSystem {
  // 计算面部特征点位置
  calculateLandmarkPositions(facialParams: FacialMappingParameters): LandmarkPositions;
  
  // 生成面部网格
  generateFacialMesh(baseModel: FaceBaseModel, landmarks: LandmarkPositions): FaceMesh;
  
  // 应用表情混合形态
  applyExpressionBlendShapes(faceMesh: FaceMesh, expression: Expression): AnimatedFaceMesh;
}
```

### 3.3 动作参数映射

#### 3.3.1 映射参数定义

```typescript
interface MotionMappingParameters {
  // 行走参数
  walkingStyle: WalkingStyle;  // 行走风格
  walkingSpeed: number;        // 行走速度 (0.5-1.5)
  stepLength: number;          // 步长 (0.8-1.2)
  
  // 姿势参数
  idlePose: IdlePose;          // 待机姿势
  postureTension: number;      // 姿势紧张度 (0-1)
  
  // 手势参数
  handGestureStyle: HandGestureStyle; // 手势风格
  gestureFrequency: number;    // 手势频率 (0-1)
  
  // 表情参数
  expressiveness: number;      // 表情丰富度 (0-1)
  emotionalResponseSpeed: number; // 情绪响应速度 (0.5-1.5)
  dominantEmotion: Emotion;    // 主导情绪
}

enum WalkingStyle {
  CASUAL = 'casual',
  CONFIDENT = 'confident',
  RELAXED = 'relaxed',
  HURRIED = 'hurried',
  TIRED = 'tired'
}

enum IdlePose {
  NEUTRAL = 'neutral',
  RELAXED = 'relaxed',
  ALERT = 'alert',
  CONFIDENT = 'confident',
  SHY = 'shy'
}

enum HandGestureStyle {
  MINIMAL = 'minimal',
  EXPRESSIVE = 'expressive',
  PRECISE = 'precise',
  CASUAL = 'casual'
}

enum Emotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  SURPRISED = 'surprised',
  FEARFUL = 'fearful'
}
```

#### 3.3.2 映射算法

动作参数映射采用动画混合与程序化生成系统：

1. **基础动画选择**：根据动作类型选择基础动画
2. **动画混合**：基于参数在多个动画之间进行混合
3. **程序化调整**：应用程序化规则进行细节调整

```typescript
interface MotionMappingSystem {
  // 选择基础动画
  selectBaseAnimations(motionParams: MotionMappingParameters): Animation[];
  
  // 计算动画混合权重
  calculateBlendWeights(motionParams: MotionMappingParameters): BlendWeights;
  
  // 应用程序化调整
  applyProceduralAdjustments(animation: Animation, motionParams: MotionMappingParameters): AdjustedAnimation;
}
```

### 3.4 权重分配机制

#### 3.4.1 基础权重比例

| 参数类型 | 默认权重 | 说明 |
|---------|---------|------|
| 身体参数 | 60% | 对整体形象影响最大 |
| 面部参数 | 30% | 对个性表达影响显著 |
| 动作参数 | 10% | 对行为特征影响重要 |

#### 3.4.2 动态调整机制

```typescript
interface WeightAdjustmentSystem {
  // 基于用户行为数据调整权重
  adjustWeightsBasedOnBehavior(userData: UserBehaviorData): WeightAdjustments;
  
  // 应用权重调整
  applyWeightAdjustments(baseWeights: ParameterWeights, adjustments: WeightAdjustments): AdjustedParameterWeights;
  
  // 权重优先级处理
  handlePriorityOverrides(weights: AdjustedParameterWeights, overrides: PriorityOverrides): FinalParameterWeights;
}
```

## 4. 纹理处理系统

### 4.1 皮肤纹理生成

#### 4.1.1 皮肤纹理参数

```typescript
interface SkinTextureParameters {
  // 基础参数
  skinTone: SkinTone;          // 肤色
  skinUndertone: Undertone;    // 肤色基调
  skinSmoothness: number;      // 皮肤光滑度 (0-1)
  
  // 细节参数
  poreVisibility: number;      // 毛孔可见度 (0-1)
  wrinkleIntensity: number;    // 皱纹强度 (0-1)
  frecklesDensity: number;     // 雀斑密度 (0-1)
  blemishDensity: number;      // 瑕疵密度 (0-1)
  
  //