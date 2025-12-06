"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (term: string) => void;
    initialValue?: string;
}

export function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
    const [term, setTerm] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(term);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 relative z-10">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-accent-pink rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-dark-800 border border-dark-600 rounded-xl overflow-hidden shadow-2xl transition-colors focus-within:border-accent-purple/50">
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search for deals..."
                        className="w-full bg-transparent text-white px-6 py-4 placeholder-gray-500 focus:outline-none text-lg"
                    />
                    <button
                        type="submit"
                        className="p-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </form>
    );
}
