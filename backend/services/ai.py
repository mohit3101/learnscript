import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv

# Explicit path — works regardless of where uvicorn is launched from
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

from openai import AsyncOpenAI
from services.prompts import (
    notes_system, notes_user,
    cheatsheet_system, cheatsheet_user,
    code_system, code_user,
    mindmap_system, mindmap_user,
    merge_system, merge_user,
)
from services.chunker import chunk_transcript

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found. Check your .env file.")

client = AsyncOpenAI(api_key=api_key)
MODEL = "gpt-4o-mini"


async def call_llm(system: str, user: str, max_tokens: int = 1500) -> str:
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_tokens=max_tokens,
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


async def generate_notes(transcript: str) -> str:
    chunks = chunk_transcript(transcript)

    tasks = [
        call_llm(notes_system(), notes_user(chunk, i, len(chunks)))
        for i, chunk in enumerate(chunks)
    ]
    results = await asyncio.gather(*tasks)

    if len(results) == 1:
        return results[0]

    combined = "\n\n---\n\n".join(results)
    return await call_llm(merge_system(), merge_user(combined[:8000]), max_tokens=2000)


async def generate_all(transcript: str) -> dict:
    notes_task = generate_notes(transcript)
    cheatsheet_task = call_llm(
        cheatsheet_system(), cheatsheet_user(transcript), max_tokens=1200
    )
    code_task = call_llm(
        code_system(), code_user(transcript), max_tokens=1500
    )
    mindmap_task = call_llm(
        mindmap_system(), mindmap_user(transcript), max_tokens=800
    )

    notes, cheatsheet, code, mindmap = await asyncio.gather(
        notes_task, cheatsheet_task, code_task, mindmap_task
    )

    return {
        "notes": notes,
        "cheatsheet": cheatsheet,
        "code": code,
        "mindmap": mindmap,
    }
