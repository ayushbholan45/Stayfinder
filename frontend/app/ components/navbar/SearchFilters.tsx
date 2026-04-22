'use client';
import { useState } from 'react';

const SearchFilters = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const divider = (left: string, right: string) => {
    const hide = hovered === left || hovered === right;
    return (
      <div className={`w-px h-6 bg-gray-300 transition-opacity duration-200 flex-shrink-0 ${hide ? 'opacity-0' : 'opacity-100'}`} />
    );
  };

  return (
    <div className='h-12 lg:h-[64px] flex flex-row items-center justify-between border border-gray-200 rounded-full'>
      <div className="hidden lg:flex flex-row items-center flex-1 h-full">

        <div
          onMouseEnter={() => setHovered('where')}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer w-[250px] h-full px-8 flex flex-col justify-center rounded-full transition ${hovered === 'where' ? 'bg-gray-200' : ''}`}
        >
          <p className="text-xs font-semibold">Where</p>
          <p className="text-sm text-gray-500">Wanted location</p>
        </div>

        {divider('where', 'checkin')}

        <div
          onMouseEnter={() => setHovered('checkin')}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer h-full px-8 flex flex-col justify-center rounded-full transition ${hovered === 'checkin' ? 'bg-gray-200' : ''}`}
        >
          <p className="text-xs font-semibold">Check in</p>
          <p className="text-sm text-gray-500">Add dates</p>
        </div>

        {divider('checkin', 'checkout')}

        <div
          onMouseEnter={() => setHovered('checkout')}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer h-full px-8 flex flex-col justify-center rounded-full transition ${hovered === 'checkout' ? 'bg-gray-200' : ''}`}
        >
          <p className="text-xs font-semibold">Check out</p>
          <p className="text-sm text-gray-500">Add dates</p>
        </div>

        {divider('checkout', 'who')}

        <div
          onMouseEnter={() => setHovered('who')}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer h-full flex-1 flex flex-row items-center justify-between pr-2 rounded-full transition ${hovered === 'who' ? 'bg-gray-200' : ''}`}
        >
          <div className="px-8 flex flex-col justify-center">
            <p className="text-xs font-semibold">Who</p>
            <p className="text-sm text-gray-500">Add guests</p>
          </div>

          <div className="p-2 flex-shrink-0">
            <div className="cursor-pointer p-2 lg:p-4 bg-stayfinder hover:bg-stayfinder-dark transition rounded-full text-white">
              <svg
                viewBox="0 0 32 32"
                style={{display:'block', fill:'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth:4, overflow:'visible'}}
                aria-hidden="true" role="presentation" focusable="false"
              >
                <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchFilters;