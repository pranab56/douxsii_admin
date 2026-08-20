import { Card as AntCard, CardProps as AntCardProps } from 'antd';

export function Card({ className, ...props }: AntCardProps) {
  return (
    <AntCard
      className={`border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${className || ''}`}
      {...props}
    />
  );
}

Card.Meta = AntCard.Meta;
Card.Grid = AntCard.Grid;

export default Card;
