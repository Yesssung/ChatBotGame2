import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callOpenAI } from "../api/axiosInstance";

const ChatWindow: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const USER_PREFIX = "사용자:";
  const AI_PREFIX = "AI:";

  const getPromptForGenre = (genre: string) => {
    switch (genre) {
      case "romance":
        return "로맨스 게임 시작 할까용";
      case "mystery":
        return "추리 게임 시작.";
      case "survival":
        return "생존 게임 시작.";
      case "simulation":
        return "시뮬레이션 게임 시작.";
      default:
        return "이야기를 시작해보세요";
    }
  };

  useEffect(() => {
    const prompt = getPromptForGenre(genre || "default");
    setChatHistory([`${AI_PREFIX} ${prompt}`]);
  }, [genre]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const getAIResponse = async (userMessage: string) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = getPromptForGenre(genre || "default"); // prompt 정의 추가
      const response = await callOpenAI(
        [
          { role: "system", content: prompt },
          { role: "user", content: userMessage },
        ],
        "gpt-4"
      );

      const aiMessage =
        response.response || response.choices?.[0]?.message?.content;

      if (aiMessage) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          `${USER_PREFIX} ${userMessage}`,
          `${AI_PREFIX} ${aiMessage}`,
        ]);
      } else {
        console.error("AI 응답 데이터가 없습니다.");
      }
    } catch (error: unknown) {
      console.error("Error fetching AI response:", error);
      setError("API 호출 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserInput = () => {
    const MAX_MESSAGE_LENGTH = 200;
    if (userInput.trim().length > MAX_MESSAGE_LENGTH) {
      alert(`메시지는 ${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요.`);
      return;
    }

    if (userInput.trim()) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        `${USER_PREFIX} ${userInput}`,
      ]);
      getAIResponse(userInput);
      setUserInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUserInput();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen max-w-lg mx-auto border shadow-lg bg-gray-50">
      <header className="w-full bg-blue-600 text-white text-center py-4">
        <h1 className="text-xl font-bold">채팅 - {genre}</h1>
      </header>

      <div className="flex-grow w-full p-4 overflow-y-auto space-y-4 bg-white">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.startsWith(USER_PREFIX) ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-md max-w-xs text-sm ${
                message.startsWith(USER_PREFIX)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {message.replace("사용자: ", "").replace("AI: ", "")}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500">AI가 응답 중입니다...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div ref={chatEndRef}></div>
      </div>

      <div className="flex w-full p-4 bg-gray-100">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading} // AI 응답 중 입력 비활성화
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleUserInput}
          disabled={loading} // AI 응답 중 버튼 비활성화
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
