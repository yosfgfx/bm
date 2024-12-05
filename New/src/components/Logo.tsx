import { FC } from 'react';

export const Logo: FC = () => {
  return (
    <div className="fixed top-8 right-4 z-20">
      <img         
        url="https://raw.githubusercontent.com/yosfgfx/MeetRoomBooking/main/New/assets/logo-new.png" 
        type = "image/png"
        alt="Logo" 
        className="max-w-[260px] w-full h-auto"
      />
    </div>
  );
};
