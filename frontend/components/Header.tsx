'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function Header({ activeTab = 'tools', onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold text-gray-900">ToolFinder</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/etudes-de-cas" className="text-gray-700 hover:text-blue-600 font-medium">
                Études de cas
              </Link>
              <Link href="/guides" className="text-gray-700 hover:text-blue-600 font-medium">
                Nos guides
              </Link>
            </div>
          </div>

          <div className="hidden md:flex">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => onTabChange?.('tools')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'tools'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Explorer les outils
              </button>
              <button
                onClick={() => onTabChange?.('simulators')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'simulators'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nos simulateurs
              </button>
            </div>
          </div>

          <div className="hidden md:flex">
            <Link 
              href="/devenir-partenaire" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Devenir partenaire
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link href="/etudes-de-cas" className="block text-gray-700 font-medium">
                Études de cas
              </Link>
              <Link href="/guides" className="block text-gray-700 font-medium">
                Nos guides
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onTabChange?.('tools')
                    setMobileMenuOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'tools' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Explorer les outils
                </button>
                <button
                  onClick={() => {
                    onTabChange?.('simulators')
                    setMobileMenuOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'simulators' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Nos simulateurs
                </button>
              </div>
              <Link
                href="/devenir-partenaire"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium block text-center"
              >
                Devenir partenaire
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}