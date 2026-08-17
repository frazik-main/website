import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function postSlug(post: BlogPost) {
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-?/, "").replace(/\.(md|mdx)$/, "");
}

export function postYear(post: BlogPost) {
  return (post.data.date ?? new Date()).getFullYear().toString();
}

export function postTags(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((tag) => tag.trim());
}

export function postPath(post: BlogPost) {
  return `/blog/${postYear(post)}/${postSlug(post)}/`;
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (left, right) => (right.data.date?.getTime() ?? 0) - (left.data.date?.getTime() ?? 0),
  );
}
