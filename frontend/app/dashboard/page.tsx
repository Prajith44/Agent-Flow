"use client";
import ReactMarkdown from "react-markdown";

import { useState, useRef, useEffect } from "react";


export default function DashboardPage() {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Claude 4.5 Sonnet");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // 🎤 MIC STATES
// 🎤 MIC STATES
const [isListening, setIsListening] = useState(false);
const [audioLevel, setAudioLevel] = useState(0);
const recognitionRef = useRef<any>(null);
const audioContextRef = useRef<AudioContext | null>(null);



  const [input, setInput] = useState("");
const [messages, setMessages] = useState<
  { role: "user" | "assistant"; content: string }[]
>([]);
const sendMessage = async () => {
  if (!input.trim()) return;

  // Show user message
  setMessages((prev) => [
    ...prev,
    { role: "user", content: input },
  ]);

  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: input }),
  });

  const data = await res.json();

  // Show assistant response
  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: data.reply },
  ]);

  setInput("");
};



  const fileInputRef = useRef<HTMLInputElement>(null);
const folderInputRef = useRef<HTMLInputElement>(null);
const plusMenuRef = useRef<HTMLDivElement>(null);
const modelMenuRef = useRef<HTMLDivElement>(null);

// Scroll button
const messagesEndRef = useRef<HTMLDivElement>(null);
const chatContainerRef = useRef<HTMLDivElement>(null);
const [showScrollDown, setShowScrollDown] = useState(false);


useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

useEffect(() => {
  const container = chatContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50;

    setShowScrollDown(!isAtBottom);
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, []);


// Outside click cancelation
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      plusMenuRef.current &&
      !plusMenuRef.current.contains(event.target as Node)
    ) {
      setShowPlusMenu(false);
    }

    if (
      modelMenuRef.current &&
      !modelMenuRef.current.contains(event.target as Node)
    ) {
      setShowModelMenu(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


const models = [
  "ChatGPT-5.2",
  "ChatGPT-5.2 Thinking",
  "Gemini 1.5 Pro",
  "Gemini 1.5 Flash",
  "Claude Sonnet 4",
  "Claude Sonnet 3.7",
  "Cursor",
];

// 🎤 START MIC (Speech → Text)
// 🎤 START MIC
const startMic = async () => {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser");
    return;
  }

  // 🎧 Speech recognition
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    setInput(transcript);
  };

  recognition.onend = () => stopMic();
  recognition.onerror = () => stopMic();

  recognitionRef.current = recognition;
  recognition.start();
  setIsListening(true);

  // 🔊 Start frequency visualizer
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  audioContextRef.current = audioContext;

  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = 256;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  const animate = () => {
    analyser.getByteFrequencyData(dataArray);
    const avg =
      dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(avg);
    if (recognitionRef.current) requestAnimationFrame(animate);
  };

  animate();
};

// 🛑 STOP MIC
const stopMic = () => {
  recognitionRef.current?.stop();
  recognitionRef.current = null;
  audioContextRef.current?.close();
  audioContextRef.current = null;
  setAudioLevel(0);
  setIsListening(false);
};

// End of mic code


  return (
    <div className="flex h-screen bg-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-gray-200 flex flex-col">

        <div className="flex items-center gap-2 px-4 py-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            ✦
          </div>
          <button className="font-semibold text-gray-900">
            AgentFlow
          </button>
        </div>

        <div className="flex-1 px-2 space-y-1 text-sm">
          {[
            "✏️ New chat",
            "🕘 Chat History",
            "🤖 Agents",
            "📚 Prompt library",
            "🔗 Integrations",
          ].map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-2 rounded-md text-gray-900 hover:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="px-2 py-3 border-t">
          <button className="w-full text-left px-3 py-2 rounded-md text-gray-900 hover:bg-gray-100">
            ➕ New project
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* ================= TOP BAR ================= */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 relative">

          {/* MODEL SELECTOR */}
          <div className="relative">
            <button
              onClick={() => setShowModelMenu((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              ✴ {selectedModel}
              <span className="text-gray-500">▾</span>
            </button>

            {showModelMenu && (
              <div 
              ref={modelMenuRef}
              className="absolute top-12 left-0 w-72 rounded-xl border border-gray-200 bg-white shadow-xl z-[999] overflow-hidden">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                        setShowModelMenu((prev) => !prev);
                        setShowPlusMenu(false);
                      setSelectedModel(model);
                      setShowModelMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* USER AVATAR */}
          <button className="h-8 w-8 rounded-full border flex items-center justify-center text-sm font-medium">
            N
          </button>
        </header>

        {/* CENTER EMPTY STATE */}

        <main
  ref={chatContainerRef}
  className="flex-1 overflow-y-auto px-4 py-6 relative"
>

  {/* EMPTY STATE (ONLY WHEN NO MESSAGES) */}
  {messages.length === 0 && (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
        ✦
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">
        AgentFlow
      </h1>
      <p className="text-gray-500">
        Ask anything and get started
      </p>
    </div>
  )}

  {/* CHAT MESSAGES (VISIBLE AREA) */}
  {messages.length > 0 && (
    <div className="max-w-3xl mx-auto space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
  className={`rounded-xl px-4 py-2 text-sm max-w-[70%] ${
    msg.role === "user"
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-900"
  }`}
>
  <ReactMarkdown
    components={{
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      p: ({ children }) => <p className="mb-2">{children}</p>,
      ul: ({ children }) => (
        <ul className="list-disc ml-5 mb-2">{children}</ul>
      ),
      li: ({ children }) => <li className="mb-1">{children}</li>,
    }}
  >
    {msg.content}
  </ReactMarkdown>
</div>


        </div>
      ))}
      {/* ✅ ADD THIS LINE HERE */}
  <div ref={messagesEndRef} />
</div>
  )}
{showScrollDown && (
  <button
    onClick={() =>
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    className="
      fixed
      bottom-24
      right-6
      h-10 w-10
      rounded-full
      bg-white
      border
      shadow-md
      flex
      items-center
      justify-center
      text-gray-700
      hover:bg-gray-100
    "
  >
    ↓
  </button>
)}
</main>



        {/* HIDDEN FILE INPUT (FILES) */}
<input
  ref={fileInputRef}
  type="file"
  multiple
  className="hidden"
  onChange={(e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files),
      ]);
    }
  }}
/>

{/* HIDDEN FILE INPUT (FOLDER) */}
<input
  ref={folderInputRef}
  type="file"
  webkitdirectory="true"
  className="hidden"
  onChange={(e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files),
      ]);
    }
  }}
/>



        {/* ================= CHAT INPUT ================= */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative max-w-4xl mx-auto">

            {/* OUTER CONTAINER (NO overflow-hidden ❌) */}
            <div className="rounded-2xl border border-gray-300 bg-white">

                {/* SELECTED FILES PREVIEW (CHATGPT STYLE) */}
{selectedFiles.length > 0 && (
  <div className="flex flex-wrap gap-2 px-4 pt-3">
    {selectedFiles.map((file, index) => (
      <div
        key={index}
        className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm bg-gray-50"
      >
        <span className="text-gray-900 truncate max-w-[160px]">
          {file.name}
        </span>

        <button
          onClick={() =>
            setSelectedFiles((prev) =>
              prev.filter((_, i) => i !== index)
            )
          }
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}


              {/* TEXT INPUT */}
              <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }}
  placeholder="Ask anything or tag with @"
  className="
    w-full
    px-4 py-4
    bg-white
    text-gray-900
    placeholder-gray-500
    outline-none
  "
/>



              {/* ACTION BAR */}
              <div className="flex items-center justify-between px-3 py-2 border-t">

                {/* LEFT ACTIONS */}
                <div className="flex items-center gap-2">

                  {/* PLUS WRAPPER */}
                  <div className="relative">

                    <button
                      onClick={() => setShowPlusMenu((prev) => !prev)}
                      className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg hover:bg-gray-800"
                    >
                      +
                    </button>

                    {/* PLUS POPUP */}
{showPlusMenu && (
  <div 
  ref={plusMenuRef}
  className="absolute bottom-12 left-0 w-52 rounded-xl border border-gray-200 bg-white shadow-xl z-[999] flex flex-col">
    
    {/* Upload File */}
    <button
      onClick={() => {
        setShowModelMenu((prev) => !prev);
        setShowModelMenu(false);
        setShowPlusMenu(false);
        fileInputRef.current?.click();
      }}
      className="px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
    >
      📄 Upload file
    </button>

    {/* Create Image */}
    <button
      className="px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
    >
      🎨 Create image
    </button>

    {/* Upload Folder */}
    <button
      onClick={() => {
        setShowPlusMenu(false);
        folderInputRef.current?.click();
      }}
      className="px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
    >
      📁 Upload folder
    </button>
  </div>
)}

                  </div>

                  {["Web search", "Deep research", "Canvas", "Image", "Prompts"].map(
                    (item) => (
                      <button
                        key={item}
                        className="h-8 px-3 rounded-full text-gray-900 hover:bg-gray-100 text-sm"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2">
                  
                  {/* 🎤 MIC BUTTON */}
{/* 🎤 CHATGPT-STYLE MIC */}
{!isListening ? (
  <button
    type="button"
    onClick={startMic}
    className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
  >
    🎤
  </button>
) : (
  <div className="flex items-center gap-3">
    {/* Frequency bar */}
    <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
      <div
        className="h-full bg-red-500 transition-all"
        style={{ width: `${Math.min(audioLevel, 100)}%` }}
      />
    </div>

    {/* Stop button */}
    <button
      type="button"
      onClick={stopMic}
      className="px-3 py-1 text-sm rounded-full bg-red-500 text-white"
    >
      Done
    </button>
  </div>
)}


                  <button
  onClick={sendMessage}
  className="h-8 w-8 rounded-full bg-gray-900 text-white"
>
  ⬆️
</button>

                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
