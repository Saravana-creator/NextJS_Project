export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  tags: string[];
  publishedAt: string;
};

export const blogs: Blog[] = [];
