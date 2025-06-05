import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { tools } from '../../../data/tools'
import Header from '../../../components/Header'

interface Props {
  params: { slug: string }
}

export default function ToolPage({ params }: Props) {
  const tool = tools.find((t) => t.slug === params.slug)
  
  if (!tool) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Retour aux outils</span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: tool.color }}
              >
                {tool.logo || tool.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {tool.category.name}
                  </span>
                  {tool.rating && (
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium text-gray-700">{tool.rating}</span>
                      {tool.reviewCount && (
                        <span className="text-gray-500">({tool.reviewCount} avis)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Accéder au site</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {tool.description}
          </p>

          {tool.tags && (
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de {tool.name}</h2>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-gray-100">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Présentation de l'outil"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              {tool.name} est un outil puissant conçu pour les entrepreneurs qui souhaitent 
              optimiser leur productivité et améliorer leur flux de travail.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Fonctionnalités principales</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Interface utilisateur intuitive et moderne</li>
              <li>Intégrations avec les outils populaires</li>
              <li>Support client réactif</li>
              <li>Sécurité et confidentialité des données</li>
            </ul>

            <p className="text-gray-600 leading-relaxed">
              Que vous soyez une startup en croissance ou une entreprise établie, 
              {tool.name} s'adapte à vos besoins spécifiques.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}