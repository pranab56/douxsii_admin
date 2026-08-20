import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';

interface FormInputProps {
  label?: string | React.ReactNode;
  name: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'otp';
  rules?: Rule[];
  className?: string;
  length?: number;
  readOnly?: boolean;
  dependencies?: string[];
}

export const FormInput = ({
  label,
  name,
  placeholder,
  type = 'text',
  rules,
  className,
  length = 4,
  readOnly = false,
  dependencies
}: FormInputProps) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={className}
      dependencies={dependencies}
      hasFeedback={type === 'password'}
    >
      {type === 'password' ? (
        <Input.Password placeholder={placeholder} className="h-12 border-white/10 rounded-lg px-4" />
      ) : type === 'otp' ? (
        <Input.OTP length={length} variant="filled" style={{ height: '50px' }} />
      ) : (
        <Input placeholder={placeholder} type={type} readOnly={readOnly} className="h-12 border-white/10 rounded-lg px-4" />
      )}
    </Form.Item>
  );
};
