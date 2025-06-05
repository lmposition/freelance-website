import Header from '@/components/Header'

export const metadata = {
  title: 'Nos guides - ToolFinder',
  description: 'Guides pratiques et tutoriels pour optimiser votre utilisation des outils entrepreneurs.',
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Guides pratiques et tutoriels pour optimiser votre utilisation des outils entrepreneurs.
          </p>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-gray-600">
              Bientôt disponible - Des guides complets
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}