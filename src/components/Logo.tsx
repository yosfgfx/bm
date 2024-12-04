import { FC } from 'react';

export const Logo: FC = () => {
  return (
    <div className="fixed top-8 right-4 z-20">
      <img 
        src={`${import.meta.env.BASE_URL}assets/logo-new.png`}
        alt="Logo" 
        className="max-w-[260px] w-full h-auto"
      />
    </div>
  );
};
