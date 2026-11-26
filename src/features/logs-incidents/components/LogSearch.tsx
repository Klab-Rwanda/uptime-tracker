interface LogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Search input for filtering logs by message, platform, or severity.
 */
export const LogSearch = ({ value, onChange }: LogSearchProps) => {
  return (
    <div className="relative w-full sm:w-96">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 10a7 7 0 1114 0a7 7 0 01-14 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 mt-5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:sm:text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Search logs by message, platform or severity..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
