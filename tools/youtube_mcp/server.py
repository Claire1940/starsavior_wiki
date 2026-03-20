#!/usr/bin/env python3
"""
YouTube MCP 服务器

提供 YouTube 搜索和字幕获取功能
"""

import asyncio
import json
import sys
from typing import Any

from mcp.server import Server
from mcp.types import Tool, TextContent

from core.config import Config
from core.youtube import YouTube
from core.utils import extract_video_id


# 创建 MCP 服务器实例
app = Server("youtube-mcp")

# 创建 YouTube 实例
youtube = YouTube()


@app.list_tools()
async def list_tools() -> list[Tool]:
    """列出所有可用的工具"""
    return [
        Tool(
            name="youtube_search",
            description="搜索 YouTube 视频，返回视频链接和元数据",
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "搜索关键词"
                    },
                    "max_results": {
                        "type": "number",
                        "description": "返回结果数量（默认 5）",
                        "default": 5
                    },
                    "max_duration": {
                        "type": "number",
                        "description": "最大视频时长（秒，默认 3600）",
                        "default": 3600
                    }
                },
                "required": ["keyword"]
            }
        ),
        Tool(
            name="youtube_get_transcript",
            description="获取 YouTube 视频字幕",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "YouTube 视频 URL 或 video_id"
                    },
                    "languages": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "字幕语言优先级（默认 ['zh', 'en']）",
                        "default": ["zh", "en"]
                    }
                },
                "required": ["url"]
            }
        ),
        Tool(
            name="youtube_search_and_transcribe",
            description="搜索关键词并获取前 N 个视频的字幕（组合功能）",
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "搜索关键词"
                    },
                    "num_videos": {
                        "type": "number",
                        "description": "获取字幕的视频数量（默认 2）",
                        "default": 2
                    },
                    "max_duration": {
                        "type": "number",
                        "description": "最大视频时长（秒，默认 3600）",
                        "default": 3600
                    }
                },
                "required": ["keyword"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """处理工具调用"""
    try:
        if name == "youtube_search":
            return await handle_youtube_search(arguments)
        elif name == "youtube_get_transcript":
            return await handle_youtube_get_transcript(arguments)
        elif name == "youtube_search_and_transcribe":
            return await handle_youtube_search_and_transcribe(arguments)
        else:
            return [TextContent(
                type="text",
                text=json.dumps({"error": f"未知工具: {name}"}, indent=2)
            )]
    except Exception as e:
        return [TextContent(
            type="text",
            text=json.dumps({"error": str(e)}, indent=2)
        )]


async def handle_youtube_search(args: dict) -> list[TextContent]:
    """处理 YouTube 搜索"""
    keyword = args["keyword"]
    max_results = args.get("max_results", 5)
    max_duration = args.get("max_duration", 3600)

    print(f"\n🔍 搜索 YouTube: {keyword}")

    # 搜索视频
    videos = await youtube.search(keyword, max_results=max_results, max_duration=max_duration)

    result = {
        "keyword": keyword,
        "count": len(videos),
        "videos": videos
    }

    print(f"✓ 找到 {len(videos)} 个视频")

    return [TextContent(
        type="text",
        text=json.dumps(result, ensure_ascii=False, indent=2)
    )]


async def handle_youtube_get_transcript(args: dict) -> list[TextContent]:
    """处理 YouTube 字幕获取"""
    url = args["url"]
    languages = args.get("languages", ["zh", "en"])

    print(f"\n📥 获取字幕: {url}")

    # 提取 video_id
    try:
        video_id = extract_video_id(url)
    except ValueError as e:
        return [TextContent(
            type="text",
            text=json.dumps({"error": str(e)}, ensure_ascii=False, indent=2)
        )]

    # 获取字幕
    result = await youtube.get_transcript(video_id, languages=languages)

    if result.get("success"):
        cached_info = " (缓存)" if result.get("cached") else ""
        print(f"✓ 字幕获取成功{cached_info}: {len(result.get('transcript', ''))} 字符")
    else:
        print(f"✗ 字幕获取失败: {result.get('error', '未知错误')}")

    return [TextContent(
        type="text",
        text=json.dumps(result, ensure_ascii=False, indent=2)
    )]


async def handle_youtube_search_and_transcribe(args: dict) -> list[TextContent]:
    """处理 YouTube 搜索并获取字幕"""
    keyword = args["keyword"]
    num_videos = args.get("num_videos", 2)
    max_duration = args.get("max_duration", 3600)

    print(f"\n🔍 搜索并获取字幕: {keyword}")

    # 搜索并获取字幕
    result = await youtube.search_and_transcribe(
        keyword,
        num_videos=num_videos,
        max_duration=max_duration
    )

    # 统计成功数量
    success_count = sum(1 for v in result["videos"] if v.get("transcript_available"))
    print(f"✓ 完成: {success_count}/{len(result['videos'])} 个视频获取到字幕")

    return [TextContent(
        type="text",
        text=json.dumps(result, ensure_ascii=False, indent=2)
    )]


async def main():
    """主函数"""
    # 验证配置
    if not Config.validate():
        print("\n❌ 配置验证失败，请检查 .env 文件")
        sys.exit(1)

    # 打印配置摘要
    Config.print_summary()

    # 运行服务器
    from mcp.server.stdio import stdio_server

    async with stdio_server() as (read_stream, write_stream):
        print("🚀 YouTube MCP 服务器已启动")
        print("等待客户端连接...\n")
        await app.run(read_stream, write_stream, app.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
