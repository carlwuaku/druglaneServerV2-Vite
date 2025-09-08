"use client";

export default function ErrorPage({ error, resetErrorBoundary: resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    return (
        <div className="w-full h-[300px] flex flex-col justify-center items-center">
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}