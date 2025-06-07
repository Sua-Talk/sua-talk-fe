export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

                {/* Loading text */}
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading...
                </p>

            </div>
        </div>
    )
}
