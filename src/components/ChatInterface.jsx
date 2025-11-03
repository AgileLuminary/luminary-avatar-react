import { useRef } from "react";
import { useSpeech } from "../hooks/useSpeech.jsx";

export const ChatInterface = ({ hidden }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      tts(text);
      input.current.value = "";
    }
  };
  if (hidden) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-end p-4 flex-col pointer-events-none">
      <div className="w-full flex flex-col items-end justify-end gap-2"></div>
      <div className="flex items-center gap-1 pointer-events-auto w-full max-w-xs self-end">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`bg-gray-500 hover:bg-gray-600 text-white h-10 px-2 flex items-center justify-center font-semibold uppercase rounded-md ${
            recording ? "bg-red-500 hover:bg-red-600" : ""
          } ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        </button>

        <input
          className="w-full h-10 px-3 rounded-md bg-white bg-opacity-80 placeholder:text-gray-600 placeholder:italic text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Type a message..."
          ref={input}
          onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); } }}
        />

        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`bg-gray-500 hover:bg-gray-600 text-white h-10 px-2 flex items-center justify-center font-semibold uppercase rounded-md ${
            loading || message ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          <span className="sr-only">Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M2.3 3.3a1 1 0 0 1 1.06-.17l17 7a1 1 0 0 1 0 1.84l-17 7A1 1 0 0 1 2 20V4a1 1 0 0 1 .3-.7Zm2.7 3.4v10.6L16.38 12 5 6.7Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};


