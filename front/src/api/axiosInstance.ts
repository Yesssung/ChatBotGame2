import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 서버 주소

// OpenAI API 호출 함수
export const callOpenAI = async (messages: any, model: string = "gpt-4") => {
  try {
    console.log("Axios 요청 URL:", `${API_BASE_URL}/api/openai`);
    const response = await axios.post(`${API_BASE_URL}/api/openai`, {
      model: model,
      messages: messages,
    });
    return response.data;
  } catch (error: any) {
    console.error("API 호출 오류:", error.response || error.message);
    throw error; // 호출한 곳에서 에러 처리
  }
};
