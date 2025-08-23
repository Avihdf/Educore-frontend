import React from 'react';

const api_url = import.meta.env.VITE_API_BASE_URL;

const assetURL = (path) => {
  if (!path) return '';
  const normalized = path.replace(/\\/g, '/');
  const filename = normalized.split('/').pop();
  return `${api_url}/coursesuploads/${filename}`;
};

const VideoDisplay = ({ video, onVideoEnd }) => {
  if (!video || typeof video !== 'string') {
    return <div className="text-red-500">Video not found</div>;
  }

  return (
    <div className="w-full -mt-3.5 rounded-2xl overflow-hidden shadow-lg bg-black relative aspect-video max-h-[480px] border border-zinc-800">
      <video
        src={assetURL(video)}
        controls
        className="w-full h-full object-contain bg-black"
        preload="metadata"
        onEnded={onVideoEnd}
      />
    </div>
  );
};

export default VideoDisplay;
