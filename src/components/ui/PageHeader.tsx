import { Flex } from 'antd';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, extra, className }: PageHeaderProps) {
  return (
    <Flex 
      vertical={false} 
      align="center" 
      justify="space-between" 
      className={`mb-6 ${className || ''}`}
    >
      <div>
        <h1 
          className="text-white font-bold m-0 font-sans" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '30px',
            lineHeight: '36px',
            letterSpacing: '0px'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className="text-white/60 m-0 mt-1.5 font-sans" 
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0px'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </Flex>
  );
}

export default PageHeader;
