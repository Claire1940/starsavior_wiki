#!/usr/bin/env python3
"""
测试 YouTube MCP 服务器的核心功能
"""

import asyncio
import sys
from core.config import Config
from core.youtube import YouTube
from core.utils import extract_video_id


async def test_search():
    """测试搜索功能"""
    print("\n" + "=" * 70)
    print("测试 1: YouTube 搜索")
    print("=" * 70)

    youtube = YouTube()
    keyword = "Python tutorial"

    print(f"搜索关键词: {keyword}")
    videos = await youtube.search(keyword, max_results=3, max_duration=3600)

    print(f"\n找到 {len(videos)} 个视频:")
    for i, video in enumerate(videos, 1):
        print(f"\n{i}. {video['title']}")
        print(f"   URL: {video['url']}")
        print(f"   频道: {video['channel']}")
        print(f"   时长: {video['duration']} ({video['duration_seconds']}秒)")
        print(f"   观看: {video['view_count']:,}")

    return videos


async def test_transcript(video_id):
    """测试字幕获取"""
    print("\n" + "=" * 70)
    print("测试 2: 获取字幕")
    print("=" * 70)

    youtube = YouTube()

    print(f"视频 ID: {video_id}")
    result = await youtube.get_transcript(video_id, languages=['en'])

    if result['success']:
        print(f"\n✓ 字幕获取成功")
        print(f"  语言: {result['language']}")
        print(f"  长度: {len(result['transcript'])} 字符")
        print(f"  缓存: {'是' if result.get('cached') else '否'}")
        print(f"\n前 200 字符:")
        print(result['transcript'][:200] + "...")
    else:
        print(f"\n✗ 字幕获取失败: {result.get('error')}")

    return result


async def test_search_and_transcribe():
    """测试组合功能"""
    print("\n" + "=" * 70)
    print("测试 3: 搜索并获取字幕")
    print("=" * 70)

    youtube = YouTube()
    keyword = "Python basics"

    print(f"搜索关键词: {keyword}")
    print(f"获取前 2 个视频的字幕...")

    result = await youtube.search_and_transcribe(keyword, num_videos=2, max_duration=3600)

    print(f"\n找到 {result['count']} 个视频:")
    for i, video in enumerate(result['videos'], 1):
        print(f"\n{i}. {video['title']}")
        print(f"   URL: {video['url']}")
        print(f"   时长: {video['duration']}")
        if video['transcript_available']:
            print(f"   ✓ 字幕可用 ({len(video['transcript'])} 字符)")
        else:
            print(f"   ✗ 字幕不可用")

    return result


async def main():
    """主测试函数"""
    print("\n🚀 YouTube MCP 服务器核心功能测试")

    # 验证配置
    if not Config.validate():
        print("\n❌ 配置验证失败，请检查 .env 文件")
        sys.exit(1)

    # 打印配置
    Config.print_summary()

    try:
        # 测试 1: 搜索
        videos = await test_search()

        if videos:
            # 测试 2: 获取第一个视频的字幕
            first_video_id = videos[0]['video_id']
            await test_transcript(first_video_id)

        # 测试 3: 组合功能
        await test_search_and_transcribe()

        print("\n" + "=" * 70)
        print("✓ 所有测试完成")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
