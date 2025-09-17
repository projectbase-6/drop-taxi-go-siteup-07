import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Generate hours (01-12)
  const hours = Array.from({
    length: 12
  }, (_, i) => String(i + 1).padStart(2, '0'));

  // Generate minutes (00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
  const minutes = Array.from({
    length: 12
  }, (_, i) => String(i * 5).padStart(2, '0'));
  const periods = ['AM', 'PM'];
  
  // Auto-close dialog and submit when all values are selected after user interaction
  useEffect(() => {
    // Only auto-submit if dialog is open, we have all valid selections, and user has interacted
    if (isOpen && hasUserInteracted && selectedHour && selectedMinute && selectedPeriod) {
      const timeValue = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
      onChange(timeValue);
      setIsOpen(false);
      setHasUserInteracted(false); // Reset for next time
    }
  }, [selectedHour, selectedMinute, selectedPeriod, isOpen, hasUserInteracted, onChange]);
  const formatDisplayTime = () => {
    if (value) {
      const [time, period] = value.split(' ');
      return {
        time,
        period
      };
    }
    return {
      time: placeholder.split(' ')[0],
      period: placeholder.split(' ')[1]
    };
  };
  const {
    time,
    period
  } = formatDisplayTime();
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={cn("h-auto w-full justify-start text-left font-normal p-0 hover:bg-transparent", className)}>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <div className="text-muted-foreground">
              {time || 'Select time'}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Select Time</DialogTitle>
        <DialogDescription className="sr-only">Choose hour, minute, and AM/PM for your pickup time</DialogDescription>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pickup-Time</h3>
            <span className="text-sm text-gray-500">Drop Time</span>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="text-2xl font-bold text-blue-600">
              {selectedHour && selectedMinute && selectedPeriod 
                ? `${selectedHour}:${selectedMinute} ${selectedPeriod}` 
                : 'Select time'}
            </div>
            
          </div>

          <div className="flex gap-3 sm:gap-4 mb-6">
            {/* Hour Selector */}
            <div className="flex-1 min-w-0">
              <div className="text-center text-sm text-gray-600 mb-2">Hr</div>
              <div className="relative">
                <ScrollArea className="h-32 border rounded-lg">
                  {hours.map(hour => <div key={hour} className={`p-2 text-center cursor-pointer hover:bg-gray-100 text-sm ${selectedHour === hour ? 'bg-blue-500 text-white' : ''}`} onClick={() => {
                      setSelectedHour(hour);
                      setHasUserInteracted(true);
                    }}>
                      {hour}
                    </div>)}
                </ScrollArea>
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  <ChevronUp className="h-3 w-3 text-gray-400" />
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Minute Selector */}
            <div className="flex-1 min-w-0">
              <div className="text-center text-sm text-gray-600 mb-2">Min</div>
              <div className="relative">
                <ScrollArea className="h-32 border rounded-lg">
                  {minutes.map(minute => <div key={minute} className={`p-2 text-center cursor-pointer hover:bg-gray-100 text-sm ${selectedMinute === minute ? 'bg-blue-500 text-white' : ''}`} onClick={() => {
                      setSelectedMinute(minute);
                      setHasUserInteracted(true);
                    }}>
                      {minute} min
                    </div>)}
                </ScrollArea>
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  <ChevronUp className="h-3 w-3 text-gray-400" />
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* AM/PM Selector */}
            <div className="flex-1 min-w-0">
              <div className="text-center text-sm text-gray-600 mb-2">AM/PM</div>
              <div className="space-y-2">
                {periods.map(p => <div key={p} className={`p-2 sm:p-3 text-center cursor-pointer rounded border text-sm ${selectedPeriod === p ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`} onClick={() => {
                    setSelectedPeriod(p);
                    setHasUserInteracted(true);
                  }}>
                    {p}
                  </div>)}
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            Click any time option to select
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default CustomTimePicker;