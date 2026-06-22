export default function WhiteboardWorkspace() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-800">
      <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-600 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">Interactive Whiteboard</h2>
        <p className="text-lg">Live collaboration & 3D workspace coming soon</p>
        <p className="text-sm mt-4">Draw, annotate, and visualize concepts in real time.</p>
      </div>
    </div>
  );
}