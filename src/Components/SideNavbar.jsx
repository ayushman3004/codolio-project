import { useTheme } from '../context/ThemeContext';

export default function SideNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 h-full flex flex-col transition-colors duration-300
      bg-gray-50 border-r border-gray-200
      dark:bg-gray-950 dark:border-gray-800
      p-4">

      {/* Header / Logo */}
      <h2 className="text-xl font-bold mb-8 px-2 tracking-wide
        text-gray-800 dark:text-white flex items-center gap-2">
        <span className="p-1 bg-blue-600 rounded-lg"></span>
        Codolio
      </h2>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 dark:text-gray-400">
            Sheets
          </p>
          <ul className="space-y-1">
            <NavItem active>Striver SDE Sheet</NavItem>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

function NavItem({ children, active }) {
  return (
    <li className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium
      ${active
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200 border border-transparent'
      }`}>
      {children}
    </li>
  );
}
