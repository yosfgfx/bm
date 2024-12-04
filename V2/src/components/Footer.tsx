import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <div className="glass-effect rounded-2xl p-6 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-white/70" />
          <p>إدارة دعم ومتابعة الأعمال للصحة الحيوانية</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-white/70" />
          <p>للتواصل والاستفسار: 0537557446</p>
        </div>
      </div>
    </div>
  );
};