import { Studio } from '../../src/types';
import { ChevronDown } from 'lucide-react';

interface StudioSelectorProps {
  studios: Studio[];
  selectedStudio: Studio | null;
  onSelect: (studio: Studio) => void;
}

export default function StudioSelector({ studios, selectedStudio, onSelect }: StudioSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Изберете студио
      </label>
      <div className="relative">
        <select
          value={selectedStudio?.id || ''}
          onChange={(e) => {
            const studio = studios.find(s => s.id === e.target.value);
            if (studio) onSelect(studio);
          }}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-gray-800"
        >
          {studios.map(studio => (
            <option key={studio.id} value={studio.id}>
              {studio.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={24} />
      </div>
    </div>
  );
}
