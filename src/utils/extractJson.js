const extractJson = (text) => {
    // Remove markdown code block wrappers
    const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```[\s\S]*?```/)
    if (match) return match[1].trim()

    // Try to match raw JSON array
    const arrayMatch = text.match(/\[\s*\{\s*"title"[\s\S]*\}\s*\]/)
    if (arrayMatch) return arrayMatch[0].trim()

    // Fallback
    return text.trim()
}

export default extractJson