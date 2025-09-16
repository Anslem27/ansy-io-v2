export interface Article {
    title: string;
    link: string;
    pubDate: string;
    thumbnail?: string;
    categories: string[];
}

export interface MediumGridItemProps {
    article: Article;
    index: number;
}