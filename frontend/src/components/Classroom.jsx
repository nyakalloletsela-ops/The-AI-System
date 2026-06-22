import ChatPanel from './ChatPanel';
import WhiteboardWorkspace from './WhiteboardWorkspace';

export default function Classroom() {
  return (
    <div className="flex h-screen w-screen">
      {/* Left panel – AI Tutor */}
      <div className="w-1/2 border-r border-gray-700 overflow-hidden">
        <ChatPanel />
      </div>
      {/* Right panel – Interactive Whiteboard */}
      <div className="w-1/2 bg-gray-800 overflow-hidden">
        <WhiteboardWorkspace />
      </div>
    </div>
  );
}