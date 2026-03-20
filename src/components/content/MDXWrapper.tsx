import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

export async function MDXWrapper({
  language,
  slug,
  contentType = 'guide'
}: {
  language: string
  slug: string
  contentType?: string
}) {
  try {
    const filePath = path.join(process.cwd(), 'content', language, contentType, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Content not found: ${filePath}`)
    }

    const source = fs.readFileSync(filePath, 'utf8')
    const { content } = matter(source)
    const mdxContent = await compileMDX({
      source: content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      },
    })

    return mdxContent.content
  } catch (error) {
    console.error(`Failed to load MDX: ${language}/${contentType}/${slug}`, error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Content not found</p>
      </div>
    )
  }
}
