// 定义3D虚拟AI形象系统中的模型类型

// 动画类型定义
export interface Animation {
  name: string;
  duration: number;
  speed?: number;
  loop?: boolean;
}

// 模型参数类型定义
export interface ModelParameters {
  // 身体参数
  bodyParameters?: Record<string, number>;
  // 面部参数
  facialParameters?: Record<string, number>;
  // 纹理参数
  textureParameters?: Record<string, string>;
}

// 头像模型类型定义
export interface AvatarModel {
  url: string;
  parameters: ModelParameters;
  animation: Animation | null;
}

// 参数类别枚举
export enum ParameterCategory {
  BODY = 'body',
  FACE = 'face',
  TEXTURE = 'texture'
}

// 参数定义
export interface Parameter {
  id: string;
  name: string;
  category: ParameterCategory;
  min?: number;
  max?: number;
  default: number | string;
  step?: number;
  options?: string[];
}