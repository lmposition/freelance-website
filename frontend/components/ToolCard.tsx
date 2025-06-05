import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

interface Tool {
  id: string
  slug: string
  name: string
  description: string
  url: string
  color: string
  category: {
    id: string
    name: string
    slug: string
    color: string
  }
  featured?: boolean
  logo?: string
  tags?: string[]
  rating?: number
  reviewCount?: number
}

interface ToolCardProps {
  tool: Tool
  featured?: boolean
}

export default function ToolCard({ tool, featured = false }: ToolCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 flex flex-col h-full ${featured ? 'md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: tool.color }}
          >
            {tool.logo || tool.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tool.name}
            </h3>
            <span className="text-sm text-gray-500">{tool.category.name}</span>
          </div>
        </div>
        
        {tool.rating && (
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{tool.rating}</span>
            {tool.reviewCount && (
              <span className="text-sm text-gray-500">({tool.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed flex-1">
        {tool.description}
      </p>

      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-auto">
        <Link
          href={`/tools/${tool.slug}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-center transition-colors duration-200"
        >
          En savoir plus
        </Link>
        
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}