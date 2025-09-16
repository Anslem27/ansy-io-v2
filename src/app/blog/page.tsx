"use client";

import BlurFade from "@/components/magicui/blur-fade";
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import Link from "next/link";
import { Article } from "@/lib/types/types";
import { MediumGridItem } from "@/components/medium_card";

const BLUR_FADE_DELAY = 0.04;


export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingMedium, setIsLoadingMedium] = useState<boolean>(true);


  // Fetch Medium articles
  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anslemAnsy")
      .then(res => res.json())
      .then((data: { items: Article[] }) => {
        setArticles(data.items);
        setIsLoadingMedium(false);
      })
      .catch((error) => {
        console.error('Error fetching Medium articles:', error);
        setIsLoadingMedium(false);
      });
  }, []);

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog</h1>
      </BlurFade>

      {/* Medium Articles Section */}
      <div className="mt-12">
        <BlurFade delay={BLUR_FADE_DELAY * 6}>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-medium text-xl tracking-tighter">medium articles</h2>
            <Link href={"https://medium.com/@anslemAnsy"}>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <p className="my-1 text-xs font-semibold text-muted-foreground pb-4">
            I also have a blog on Medium, I write about almost anything that comes to mind, or how I'm learning and growing in my career, sharing knowledge and all that.
          </p>
        </BlurFade>

        {isLoadingMedium ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <BlurFade delay={BLUR_FADE_DELAY * 8 + index * 0.05} key={article.title}>
                <MediumGridItem
                  article={article}
                  index={index}
                />
              </BlurFade>
            ))}
          </div>
        )}

        {!isLoadingMedium && articles.length === 0 && (
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <p className="text-sm text-muted-foreground text-center py-8">
              No Medium articles found at the moment.
            </p>
          </BlurFade>
        )}
      </div>
    </section>
  );
}