import Header from '@/components/Header'

export const metadata = {
  title: 'Devenir partenaire - ToolFinder',
  description: 'Rejoignez notre réseau de partenaires et faites découvrir votre outil à notre communauté d\'entrepreneurs.',
}

export default function DevenirPartenairePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Devenir partenaire
          </h1>
          <p className="text-xl text-gray-600">
            Rejoignez notre réseau de partenaires et faites découvrir votre outil à notre communauté d'entrepreneurs.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Votre entreprise"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="contact@votre-entreprise.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de votre outil
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="https://votre-outil.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre outil
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Décrivez votre outil et ses fonctionnalités principales..."
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 text-lg"
            >
              Envoyer ma candidature
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}