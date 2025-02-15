import Image from 'next/image'
import Link from 'next/link'

export function BlogCard({ post }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Image src={post.image || "/placeholder.svg"} alt={post.title} width={300} height={200} className="w-full object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <Link href={`/blog/${post.id}`} className="mt-4 inline-block text-primary hover:underline">
          Read More
        </Link>
      </div>
    </div>
  )
}