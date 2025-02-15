import Image from 'next/image'
import Link from 'next/link'

export function RelatedPosts({ posts }) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
            {posts.map((post) => (
                <div key={post.id} className="mb-4">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} width={300} height={200} className="w-full object-cover rounded-lg mb-2" />
                    <h4 className="font-semibold mb-1">{post.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="text-primary hover:underline text-sm">
                        Read More
                    </Link>
                </div>
            ))}
        </div>
    )
}