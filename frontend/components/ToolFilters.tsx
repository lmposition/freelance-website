'use client'

import { Fragment } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Category } from '@/types'

interface ToolFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function ToolFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ToolFiltersProps) {
  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : 'Toutes les catégories'

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Barre de recherche */}
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un outil..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        />
      </div>

      {/* Filtre par catégorie */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 font-medium">
            {selectedCategoryName}
          </span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => {
                  const buttonClasses = active
                    ? 'w-full text-left px-4 py-2 text-sm transition-colors bg-gray-100 text-primary-600 font-medium'
                    : !selectedCategory
                    ? 'w-full text-left px-4 py-2 text-sm transition-colors text-primary-600 font-medium'
                    : 'w-full text-left px-4 py-2 text-sm transition-colors text-gray-700'
                  
                  return (
                    <button
                      onClick={() => onCategoryChange(null)}
                      className={buttonClasses}
                    >
                      Toutes les catégories
                    </button>
                  )
                }}
              </Menu.Item>
              
              {categories.map((category) => (
                <Menu.Item key={category.id}>
                  {({ active }) => {
                    const isSelected = selectedCategory === category.id
                    const buttonClasses = active
                      ? 'w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 bg-gray-100'
                      : 'w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2'
                    
                    const textClasses = isSelected
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-700'
                    
                    return (
                      <button
                        onClick={() => onCategoryChange(category.id)}
                        className={buttonClasses}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className={textClasses}>{category.name}</span>
                      </button>
                    )
                  }}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}