import { getAllItems } from '@/lib/api';
import BlogList from '@/components/BlogList';

export default function BlogIndex() {
    const posts = getAllItems('blog');

    // Serialize posts
    const serializablePosts = posts.map(post => ({
        ...post,
        date: post.date ? post.date.toString() : null,
    }));

    return <BlogList posts={serializablePosts} />;
}
