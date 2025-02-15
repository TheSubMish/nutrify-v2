import Image from 'next/image'

export function BlogHeader({ title, date, readTime, image }) {
  return (
    <header>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex items-center text-gray-500 mb-4">
        <span>{date}</span>
        <span className="mx-2">•</span>
        <span>{readTime}</span>
      </div>
      <Image src={image || "/placeholder.svg"} alt={title} width={800} height={400} className="w-full object-cover rounded-lg" />
    </header>
  )
}