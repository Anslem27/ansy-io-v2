"use client";

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Article } from '@/lib/types/types';
import { MediumGridItem } from './medium_card';


// Main Blog Section Component
const BlogSection: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anslemAnsy")
            .then(res => {
                if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
                return res.json();
            })
            .then((data: { items: Article[] }) => {
                setArticles(data.items ?? []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching articles:', err);
                setError(true);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <p className="my-1 text-xs font-semibold text-foreground pb-2">
                I also have a blog, I write about almost anything that comes to mind, or how I'm learning and growing in my career, sharing knowledge and all that.
            </p>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : error ? null : (
                <div className="space-y-4">
                    {articles
                        .filter((_, index) => [1, 3, 6].includes(index))
                        .map((article, index) => (
                            <MediumGridItem
                                key={article.title}
                                article={article}
                                index={[0, 1, 2][index]}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default BlogSection;