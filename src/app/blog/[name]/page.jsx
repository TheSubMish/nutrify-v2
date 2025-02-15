import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogAuthor } from '@/components/blog/BlogAuthor'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogPost({ params }) {
  // In a real application, you would fetch the blog post data based on the ID
  const post = {
    id: params.id,
    title: "5 AI-Powered Diet Tips for a Healthier You",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
    date: "2025-02-15",
    readTime: "5 min read",
    author: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Nutritionist and AI enthusiast"
    },
    image: "/placeholder.svg?height=400&width=800"
  }

  const relatedPosts = [
    {
      id: 2,
      title: "The Future of Personalized Nutrition",
      excerpt: "Explore how AI is shaping the future of diet planning...",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      title: "Understanding Macros: A Beginner's Guide",
      excerpt: "Learn the basics of macronutrients and how they impact your diet...",
      image: "/placeholder.svg?height=200&width=300"
    }
  ]

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BlogHeader title={post.title} date={post.date} readTime={post.readTime} image={post.image} />
        <div className="mt-8 flex flex-col lg:flex-row">
          <div className="lg:w-2/3 lg:pr-8">
            <BlogContent content={post.content} />
            <BlogAuthor author={post.author} />
          </div>
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}