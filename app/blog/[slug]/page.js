import { getAllItems, markdownToHtml } from '@/lib/api';
import BlogPostContent from '@/components/BlogPostContent';

export async function generateStaticParams() {
    const posts = getAllItems('blog');

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    const posts = getAllItems('blog');
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        return <div>Post not found</div>;
    }

    // markdownToHtml is async
    const content = await markdownToHtml(post.content || '');

    // Serialize Date object for Client Component
    const serializablePost = {
        ...post,
        date: post.date ? post.date.toString() : null,
    };

    return <BlogPostContent post={serializablePost} content={content} />;
}
