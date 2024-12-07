import { FC } from 'react';
import weqaalogo from "./MeetRoomBooking/New/assets/logo-new.png"

export const Logo: FC = () => {
  return (
    <div className="fixed top-8 right-4 z-20">
      <img         
        src={weqaalogo} alt="Logo" 
        className="max-w-[260px] w-full h-auto"
      />
    </div>
  );
};
