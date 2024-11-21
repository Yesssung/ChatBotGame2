import openai
import os
import logging
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import HTTPException


# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 메시지 모델 정의
class Message(BaseModel):
    text: str

class OpenAIRequest(BaseModel):
    model: str
    messages: list

@app.post("/chat")
async def chat_with_openai(message: Message):
    """기본 /chat 엔드포인트"""
    logger.info("Received message: %s", message.text)
    try:
        start_time = time.time()  # 시작 시간 기록

        # OpenAI ChatCompletion 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": message.text}],
        )

        end_time = time.time()  # 종료 시간 기록
        elapsed_time = end_time - start_time
        logger.info("OpenAI API response time: %.2f seconds", elapsed_time)

        return {"response": response.choices[0].message["content"]}
    except Exception as e:
        logger.error("Error calling OpenAI API: %s", str(e))
        return {"error": str(e)}

@app.post("/api/openai")
async def openai_custom_api(request: OpenAIRequest):
    logger.info("Received custom OpenAI request with model: %s", request.model)
    try:
        response = openai.ChatCompletion.create(
            model=request.model,
            messages=request.messages,
        )
        # 필요한 데이터만 반환
        return {"response": response.choices[0].message["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

