import React, { useEffect, useRef, useState } from "react";
import { LoaderCircle, Mic, ArrowUp } from "lucide-react";

export default function ChatInput({ input, setInput, onSend, onVoiceSend, isLoading, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const recognitionRef = useRef(null);
  const hasSentVoiceRef = useRef(false);

  useEffect(() => {
    // Stop the microphone if this component is removed from the page.
    return () => recognitionRef.current?.stop();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    // Chrome uses webkitSpeechRecognition, while some browsers use SpeechRecognition.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    hasSentVoiceRef.current = false;
    setVoiceMessage("");

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let spokenText = "";
      let finalText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0].transcript;
        spokenText += text;
        if (event.results[index].isFinal) finalText += text;
      }

      // Show words while the user speaks, even before the browser finalizes them.
      setInput(spokenText.trim());

      // Send only one final result. This avoids duplicate messages from speech events.
      if (finalText.trim() && !hasSentVoiceRef.current) {
        hasSentVoiceRef.current = true;
        onVoiceSend(finalText.trim());
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      const message = event.error === "not-allowed"
        ? "Microphone permission was denied. Allow it in your browser settings."
        : "Voice input could not start. Please try again.";
      setVoiceMessage(message);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  // This footer stays outside the scrollable message area, so it always has its own space.
  return (
    <footer className="shrink-0 bg-[#0f172a] p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1e293b] rounded-full flex items-center px-3 py-2 border border-slate-700/50 focus-within:border-slate-500 transition">
          
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Create or select a chat to begin" : "Ask anything"}
            disabled={isLoading || disabled}
            className="w-full bg-transparent text-white placeholder-slate-400 px-3 outline-none resize-none text-[15px] max-h-32 overflow-y-auto disabled:cursor-not-allowed disabled:opacity-50"
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading || disabled}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              title={isListening ? "Stop listening" : "Speak your message"}
              className={`p-2 rounded-full transition disabled:opacity-50 ${isListening ? "bg-red-500/15 text-red-300 animate-pulse" : "text-slate-400 hover:text-white"}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onSend}
              disabled={isLoading || disabled || !input.trim()}
              className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
            </button>
          </div>

        </div>
        {isListening && <p className="mt-2 px-3 text-xs text-indigo-300">Listening… Speak your message.</p>}
        {voiceMessage && <p className="mt-2 px-3 text-xs text-amber-300">{voiceMessage}</p>}
      </div>
    </footer>
  );
}
