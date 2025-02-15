import Image from 'next/image'

export function BlogAuthor({ author }) {
  return (
    <div className="flex items-center mt-8 p-4 bg-gray-100 rounded-lg">
      <Image src={author.avatar || "/placeholder.svg"} alt={author.name} width={64} height={64} className="rounded-full mr-4" />
      <div>
        <h3 className="font-semibold">{author.name}</h3>
        <p className="text-gray-600">{author.bio}</p>
      </div>
    </div>
  )
}