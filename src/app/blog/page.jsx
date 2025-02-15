import { BlogCard } from '@/components/blog/blogcard'
import Button from '@/components/ui/Button'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogList() {
  // This would typically come from an API or database
  const blogPosts = [
    {
      id: 1,
      title: "5 AI-Powered Diet Tips for a Healthier You",
      excerpt: "Discover how artificial intelligence can revolutionize your eating habits...",
      date: "2025-02-15",
      readTime: "5 min read",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      title: "The Future of Personalized Nutrition",
      excerpt: "Explore how AI is shaping the future of diet planning and nutritional advice...",
      date: "2025-02-10",
      readTime: "7 min read",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      title: "Understanding Macros: A Beginner's Guide",
      excerpt: "Learn the basics of macronutrients and how they impact your diet...",
      date: "2025-02-05",
      readTime: "6 min read",
      image: "/placeholder.svg?height=200&width=300"
    }
  ]

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">NutrifyMe Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button>Load More Posts</Button>
        </div>
      </div>
      <Footer />
    </>
  )
}