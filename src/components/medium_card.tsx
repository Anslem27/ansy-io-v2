import { MediumGridItemProps } from "@/lib/types/types";
import { formatDistanceToNow, parseISO } from "date-fns";

export const MediumGridItem: React.FC<MediumGridItemProps> = ({ article, index }) => {
    const formatDate = (dateString: string): string => {
        const date = parseISO(dateString);
        const distance = formatDistanceToNow(date, { addSuffix: true });
        return distance;
    };

    const formattedDate = formatDate(article.pubDate);
    const colors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-yellow-500'];

    return (
        <div className="p-1">
            <div className="flex justify-start items-start flex-row w-full">
                <div className="cursor-pointer p-3">
                    <span className="text-4xl font-bold text-gray-500">
                        {index < 9 ? `0${index + 1}` : index + 1}
                    </span>
                </div>
                <a
                    href={article.link}
                    className="no-underline text-inherit hover:opacity-80 transition-opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="flex flex-col">
                        <h3 className="mt-2 text-md font-bold text-foreground">
                            {article.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                        <div className="flex flex-wrap mt-2 gap-2">
                            {article.categories.map((category, categoryIndex) => (
                                <span
                                    key={category}
                                    className={`text-xs capitalize ${colors[categoryIndex % colors.length]}`}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};