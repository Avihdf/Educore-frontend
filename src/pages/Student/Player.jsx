import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChapterSidebar from '../../components/Students/ChapterSidebar';
import VideoDisplay from '../../components/Students/VideoDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';
import Loading from '../../components/Students/Loading';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

   const api_url = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${api_url}/api/courseplayer/${id}`, { withCredentials: true })
      .then(res => {
        if (res.data.error) {
          navigate('/', { state: { error: res.data.error } });
        } else {
          setCourse(res.data.courseplayer);
        }
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || 'Internal Server Error';
        navigate('/', { state: { error: errorMsg } });
      });
  }, [id, navigate]);

  if (!course) return <Loading />;

  const activeChapter = course.chapters[activeChapterIndex];
  const activeVideo = activeChapter.chaptervideos[activeVideoIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-4 px-4 sm:px-6 bg-black min-h-screen relative">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-[270px] min-w-[230px] bg-black border border-gray-800 shadow-lg rounded-2xl py-4 flex-col">
        <h3 className="mb-6 text-center text-white font-semibold text-2xl tracking-tight">
          Chapters
        </h3>
        <ChapterSidebar
          chapters={course.chapters}
          onSelectChapter={(idx) => {
            setActiveChapterIndex(idx);
            setActiveVideoIndex(0);
          }}
          activeIndex={activeChapterIndex}
        />
      </aside>

      {/* Sidebar (mobile drawer) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex">
          <div className="w-64 bg-black border-r border-gray-800 shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">Chapters</h3>
              <button
                className="text-red-500"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ChapterSidebar
              chapters={course.chapters}
              onSelectChapter={(idx) => {
                setActiveChapterIndex(idx);
                setActiveVideoIndex(0);
                setMobileSidebarOpen(false);
              }}
              activeIndex={activeChapterIndex}
            />
          </div>
          {/* Clickable overlay to close */}
          <div
            className="flex-1"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <section className="mt-10 md:mt-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
            {activeVideo.title}
          </h2>
          <VideoDisplay video={activeVideo} />
        </section>

        {/* Thumbnails grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {activeChapter.chaptervideos.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideoIndex(idx)}
              className={`rounded-xl bg-zinc-900 p-2 flex flex-col
                border-2 transition-all
                ${activeVideoIndex === idx
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-zinc-700 hover:border-blue-400 hover:shadow-lg'}
              `}
            >
              <div className="w-full h-20 sm:h-24 bg-zinc-800 rounded mb-2 flex items-center justify-center">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-gray-300"
                >
                  <polygon points="5,3 19,12 5,21 5,3" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-100">
                {vid.title || `Video ${idx + 1}`}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Player;
