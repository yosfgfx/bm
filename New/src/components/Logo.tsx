import { FC } from 'react';

export const Logo: FC = () => {
  return (
    <div className="fixed top-8 right-4 z-20">
      <img 
        src="https://raw.githubusercontent.com/yosfgfx/MeetRoomBooking/main/logo-new.png"
        alt="Logo" 
        className="max-w-[260px] w-full h-auto"
      />
    </div>
  );
};
