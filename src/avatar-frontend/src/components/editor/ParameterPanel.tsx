import React from 'react';
import { ParameterCategory, Parameter } from '../../types/avatar';

interface ParameterPanelProps {
  category: ParameterCategory;
  parameters: Parameter[];
  onParameterChange: (parameterId: string, value: number | string) => void;
  onReset?: () => void;
  onRandomize?: () => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  category,
  parameters,
  onParameterChange,
  onReset,
  onRandomize
}) => {
  const renderParameter = (parameter: Parameter) => {
    // 根据参数类型渲染不同的控制组件
    if (parameter.options && parameter.options.length > 0) {
      // 如果有选项，渲染下拉选择框
      return (
        <div key={parameter.id} className="parameter-item">
          <label htmlFor={parameter.id}>{parameter.name}</label>
          <select
            id={parameter.id}
            value={parameter.default.toString()}
            onChange={(e) => onParameterChange(parameter.id, e.target.value)}
          >
            {parameter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      // 否则渲染滑块控制
      return (
        <div key={parameter.id} className="parameter-item">
          <label htmlFor={parameter.id}>{parameter.name}</label>
          <input
            type="range"
            id={parameter.id}
            min={parameter.min || 0}
            max={parameter.max || 100}
            step={parameter.step || 1}
            value={parameter.default as number}
            onChange={(e) => onParameterChange(parameter.id, parseFloat(e.target.value))}
          />
          <span className="parameter-value">{parameter.default}</span>
        </div>
      );
    }
  };

  return (
    <div className="parameter-panel">
      <div className="parameter-panel-header">
        <h3>{category === ParameterCategory.BODY ? '身体参数' : 
             category === ParameterCategory.FACE ? '面部参数' : '纹理参数'}</h3>
        <div className="parameter-panel-actions">
          {onReset && (
            <button onClick={onReset} className="reset-button">
              重置
            </button>
          )}
          {onRandomize && (
            <button onClick={onRandomize} className="randomize-button">
              随机
            </button>
          )}
        </div>
      </div>
      <div className="parameter-list">
        {parameters.map(renderParameter)}
      </div>
    </div>
  );
};

export default ParameterPanel;