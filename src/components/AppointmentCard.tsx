import { FC } from 'react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface AppointmentCardProps {
  name: string;
  date: Date;
  time: string;
  room: string;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  name,
  date,
  time,
  room,
}) => {
  const dayName = format(date, 'EEEE', { locale: arSA });
  const formattedDate = format(date, 'd MMMM yyyy', { locale: arSA });

  return (
    <div className="glass-effect rounded-xl p-6 transition-all hover:bg-white/20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-arabic-bold text-white">{name}</h3>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
            {time}
          </span>
        </div>
        <div className="text-white/80">
          <p className="font-arabic">{dayName}</p>
          <p className="text-sm">{formattedDate}</p>
        </div>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-white/70 text-sm">
            القاعة: <span className="text-white">{room}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
