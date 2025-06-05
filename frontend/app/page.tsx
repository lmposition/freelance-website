'use client'

import { useState } from 'react'
import Header from '../components/Header'
import ToolCard from '../components/ToolCard'
import { tools } from '../data/tools'

export default function Home() {
  const [activeTab, setActiveTab] = useState('tools')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter(tool => 
    !searchQuery || 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (activeTab === 'simulators') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Simulateurs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bientôt disponible - Des simulateurs pour vous aider dans vos décisions business
          </p>
          <div className="bg-white rounded-xl border p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">🔧</div>
            <p className="text-gray-600">Cette section est en cours de développement</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez les meilleurs outils pour entrepreneurs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une sélection curatée d'outils essentiels pour booster votre productivité.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher un outil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun outil trouvé pour votre recherche.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}