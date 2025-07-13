import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { siteConfig } from "../lib/config";

export type Post = {
  title: string;
  publishedAt: string;
  summary: string;
  author: string;
  slug: string;
  image?: string;
  content?: string;
};

// Static blog posts data
const blogPosts: Post[] = [
  {
    title: "Introducing Tweeti",
    publishedAt: "2024-01-15",
    summary: "A decentralized Twitter alternative that puts you in control",
    author: "Tweeti Team",
    slug: "introducing-tweeti",
    content: `
# Introducing Tweeti

Tweeti is a revolutionary decentralized social media platform built on Arweave, designed to give users complete control over their data while providing a familiar and intuitive experience.

## Key Features

- Permanent Storage on Arweave
- User-owned Data
- Decentralized Architecture
- Twitter-like Experience
- Privacy-focused Design

Join us in reshaping the future of social media!
    `,
  },
  {
    title: "How We Manage Data",
    publishedAt: "2024-01-16",
    summary: "Learn about our approach to data storage and management using Arweave",
    author: "Tweeti Team",
    slug: "how-we-manage-data",
    content: `
# How We Manage Data on Tweeti

At Tweeti, we leverage Arweave's permanent storage to ensure your data remains accessible and under your control forever.

## Our Architecture

- Permanent Storage: All data is stored on Arweave
- Data Ownership: Users retain complete control
- Accessibility: Data is always available
- Security: End-to-end encryption
    `,
  },
];

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  const post = blogPosts.find((post) => post.slug === slug);
  if (!post) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const content = post.content ? await markdownToHTML(post.content) : "";
  const defaultImage = `${siteConfig.url}/og?title=${encodeURIComponent(post.title)}`;

  return {
    source: content,
    metadata: {
      ...post,
      image: post.image || defaultImage,
    },
    slug,
  };
}

export async function getBlogPosts() {
  return blogPosts.map((post) => ({
    ...post,
    image: post.image || `${siteConfig.url}/og?title=${encodeURIComponent(post.title)}`,
  }));
}
