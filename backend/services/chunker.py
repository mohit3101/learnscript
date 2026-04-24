import tiktoken


def chunk_transcript(text: str, max_tokens: int = 3000) -> list[str]:
    enc = tiktoken.encoding_for_model("gpt-4o-mini")
    tokens = enc.encode(text)

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i : i + max_tokens]
        chunks.append(enc.decode(chunk_tokens))

    return chunks
