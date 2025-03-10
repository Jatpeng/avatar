import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { AvatarModel } from '../../types/avatar';
import * as THREE from 'three';

// 辅助函数：应用模型参数
const applyModelParameters = (model: THREE.Group, parameters: any) => {
  // 这里将实现参数应用到模型的逻辑
  console.log('应用模型参数', parameters);
};
 
// 辅助函数：更新动画
const updateAnimation = (model: THREE.Group, animation: any, delta: number) => {
  // 这里将实现动画更新逻辑
  console.log('更新动画', animation, delta);
};

interface AvatarProps {
  model: AvatarModel;
}

const Avatar: React.FC<AvatarProps> = ({ model }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  
  const { scene, errors } = useGLTF(model.url, undefined, undefined, (error) => {
    console.error('模型加载失败:', error);
    setLoadError('模型加载失败，显示默认占位模型');
  });
  
  const meshRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    setIsLoading(false);
  }, [scene]);
  
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

interface AvatarRendererProps {
  modelUrl: string;
  backgroundColor?: string;
  environmentPreset?: string;
  onLoadComplete?: () => void;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  modelUrl,
  backgroundColor = '#f5f5f5',
  environmentPreset = 'city',
  onLoadComplete
}) => {
  return (
    <div style={{ width: '100%', height: '100%', background: backgroundColor }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Environment preset={environmentPreset} />
        <Avatar model={{ url: modelUrl, parameters: {}, animation: null }} />
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

export default AvatarRenderer;