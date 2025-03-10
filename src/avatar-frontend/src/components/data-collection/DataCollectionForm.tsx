import React, { useState } from 'react';
import { ParameterCategory } from '../../types/avatar';

interface DataCollectionFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const DataCollectionForm: React.FC<DataCollectionFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // 基本信息
    basicInfo: {
      height: '',
      weight: '',
      gender: '男'
    },
    // 面部特征
    facialFeatures: {
      faceShape: '椭圆形',
      eyeColor: '黑色',
      hairColor: '黑色',
      hairStyle: '短发'
    }
  });

  const handleInputChange = (category: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category as keyof typeof formData],
        [field]: value
      }
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderBasicInfoStep = () => (
    <div className="form-step">
      <h3>基本信息</h3>
      <div className="form-group">
        <label htmlFor="height">身高 (cm)</label>
        <input
          type="number"
          id="height"
          value={formData.basicInfo.height}
          onChange={(e) => handleInputChange('basicInfo', 'height', e.target.value)}
          placeholder="请输入身高"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="weight">体重 (kg)</label>
        <input
          type="number"
          id="weight"
          value={formData.basicInfo.weight}
          onChange={(e) => handleInputChange('basicInfo', 'weight', e.target.value)}
          placeholder="请输入体重"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="gender">性别</label>
        <select
          id="gender"
          value={formData.basicInfo.gender}
          onChange={(e) => handleInputChange('basicInfo', 'gender', e.target.value)}
        >
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="其他">其他</option>
        </select>
      </div>
    </div>
  );

  const renderFacialFeaturesStep = () => (
    <div className="form-step">
      <h3>面部特征</h3>
      <div className="form-group">
        <label htmlFor="faceShape">脸型</label>
        <select
          id="faceShape"
          value={formData.facialFeatures.faceShape}
          onChange={(e) => handleInputChange('facialFeatures', 'faceShape', e.target.value)}
        >
          <option value="椭圆形">椭圆形</option>
          <option value="圆形">圆形</option>
          <option value="方形">方形</option>
          <option value="心形">心形</option>
          <option value="长形">长形</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="eyeColor">眼睛颜色</label>
        <select
          id="eyeColor"
          value={formData.facialFeatures.eyeColor}
          onChange={(e) => handleInputChange('facialFeatures', 'eyeColor', e.target.value)}
        >
          <option value="黑色">黑色</option>
          <option value="棕色">棕色</option>
          <option value="蓝色">蓝色</option>
          <option value="绿色">绿色</option>
          <option value="灰色">灰色</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="hairColor">头发颜色</label>
        <select
          id="hairColor"
          value={formData.facialFeatures.hairColor}
          onChange={(e) => handleInputChange('facialFeatures', 'hairColor', e.target.value)}
        >
          <option value="黑色">黑色</option>
          <option value="棕色">棕色</option>
          <option value="金色">金色</option>
          <option value="红色">红色</option>
          <option value="灰色">灰色</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="hairStyle">发型</label>
        <select
          id="hairStyle"
          value={formData.facialFeatures.hairStyle}
          onChange={(e) => handleInputChange('facialFeatures', 'hairStyle', e.target.value)}
        >
          <option value="短发">短发</option>
          <option value="长发">长发</option>
          <option value="卷发">卷发</option>
          <option value="直发">直发</option>
          <option value="秃顶">秃顶</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="data-collection-form">
      <div className="steps-indicator">
        <div className={`step ${currentStep === 0 ? 'active' : ''}`}>基本信息</div>
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>面部特征</div>
      </div>

      <div className="form-content">
        {currentStep === 0 && renderBasicInfoStep()}
        {currentStep === 1 && renderFacialFeaturesStep()}
      </div>

      <div className="form-actions">
        {currentStep > 0 && (
          <button onClick={handlePrevious} className="previous-button">
            上一步
          </button>
        )}
        {currentStep < 1 ? (
          <button onClick={handleNext} className="next-button">
            下一步
          </button>
        ) : (
          <button onClick={handleSubmit} className="submit-button">
            提交
          </button>
        )}
        {onCancel && (
          <button onClick={onCancel} className="cancel-button">
            取消
          </button>
        )}
      </div>
    </div>
  );
};

export default DataCollectionForm;