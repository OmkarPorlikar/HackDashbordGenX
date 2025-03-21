import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationButtonProps {
  to: string;
  icon: React.ReactNode;
  text: string; 
  number:number;
}

export function NavigationButton({ to, icon, text , number }: NavigationButtonProps) {
  return (
    <Link
      to={to}
      className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition flex items-center gap-4"
    >
      {icon}
      <span className="text-lg font-medium">{text}</span>
      <span className="text-[1.45rem] font-medium  text-green-300">{number}</span>
    </Link>
  );
}