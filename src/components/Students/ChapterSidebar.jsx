import React from 'react';

const ChapterSidebar = ({ chapters, onSelectChapter, activeIndex }) => (
  <nav className="flex-1 mt-20 md:mt-0 max-h-[70vh] overflow-y-auto pr-2">
    <ul className="flex flex-col gap-2 ml-2">
      {chapters.map((chapter, index) => (
        <li
          key={index}
          onClick={() => onSelectChapter(index)}
          aria-current={activeIndex === index}
          className={`
            text-center py-3 cursor-pointer rounded-xl
            transition-all duration-150
            font-medium text-base
            ${activeIndex === index
              ? 'bg-blue-600 text-white shadow font-bold scale-105'
              : 'bg-zinc-900 text-gray-200 hover:bg-zinc-800'}
          `}
        >
          {chapter.chaptername}
        </li>
      ))}
    </ul>
  </nav>
);

export default ChapterSidebar;
