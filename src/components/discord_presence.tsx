"use client";

import React, { useState, useEffect } from 'react';
import { useLanyard } from 'react-use-lanyard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Loader2,
    MessageCircle,
    Music,
    Play,
    Apple,
    Youtube,
    Gamepad2,
    Code2,
    Activity,
    ExternalLink,
    Clock,
    Headphones
} from 'lucide-react';
import { DiscordLogoIcon } from '@radix-ui/react-icons';

const SpotifyIcon: React.FC<{ size?: number; className?: string }> = ({
    size = 20,
    className = ""
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.455c-.155.255-.49.335-.744.18-2.04-1.245-4.606-1.526-7.634-.84-.292.066-.583-.118-.65-.41-.066-.292.118-.583.41-.65 3.317-.75 6.157-.427 8.374.975.254.155.335.49.18.744l.064.001zm1.064-2.368c-.196.32-.612.42-.932.224-2.336-1.437-5.892-1.854-8.656-1.015-.363.11-.745-.098-.855-.461-.11-.363.098-.745.461-.855 3.152-.958 7.09-.494 9.758 1.175.32.196.42.612.224.932zm.092-2.467C14.898 9.92 8.845 9.664 5.157 10.978c-.431.154-.905-.07-1.059-.501-.154-.431.07-.905.501-1.059 4.255-1.517 10.956-1.225 14.44 1.44.378.289.454.826.165 1.204-.289.378-.826.454-1.204.165l.018.003z" />
    </svg>
);

// Type definitions (keeping your existing ones)
interface LanyardUser {
    id: string;
    username: string;
    display_name?: string;
    avatar?: string;
    discriminator: string;
    public_flags?: number;
}

interface LanyardActivity {
    id: string;
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: {
        start?: number;
        end?: number;
    };
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
    application_id?: string;
    url?: string;
}

interface LanyardSpotify {
    track_id: string;
    timestamps: {
        start: number;
        end: number;
    };
    album: string;
    album_art_url: string;
    artist: string;
    song: string;
}

interface LanyardData {
    discord_user: LanyardUser;
    listening_to_spotify: boolean;
    spotify?: LanyardSpotify;
    activities: LanyardActivity[];
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
}

interface LanyardResponse {
    data: LanyardData;
    isValidating: boolean;
    error?: any;
}

interface MusicPlatform {
    name: string;
    color: string;
    logo: React.ReactElement;
    getUrl: (id: string) => string;
}

interface MusicData {
    imageUrl?: string;
    title: string;
    artist: string;
}

// Enhanced platform configuration
const musicPlatforms: Record<string, MusicPlatform> = {
    spotify: {
        name: "Spotify",
        color: "#1DB954",
        logo: <SpotifyIcon />,
        getUrl: (id: string) => `https://open.spotify.com/track/${id}`
    },
    apple: {
        name: "Apple Music",
        color: "#FA243C",
        logo: <Apple fill="currentColor" />,
        getUrl: (id: string) => `https://music.apple.com/us/album/${id}`
    },
    youtube: {
        name: "YouTube Music",
        color: "#FF0000",
        logo: <Youtube fill="currentColor" />,
        getUrl: (id: string) => `https://www.youtube.com/watch?v=${id}`
    }
};

// Status color mapping
const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-400"
};

// Enhanced wave animation component
const WaveBars: React.FC<{ color?: string; size?: 'sm' | 'md' }> = ({
    color = "#1DB954",
    size = 'md'
}) => {
    const barHeight = size === 'sm' ? 'h-4' : 'h-6';
    const barWidth = size === 'sm' ? 'w-0.5' : 'w-1';

    return (
        <div className={cn("flex items-end justify-center gap-0.5", barHeight)}>
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={cn(barWidth, "rounded-sm")}
                    style={{
                        backgroundColor: color,
                        animation: `wave${i} ${1.5 + i * 0.1}s ease-in-out infinite`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes wave1 {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        @keyframes wave2 {
          0%, 100% { height: 60%; }
          25% { height: 20%; }
          75% { height: 90%; }
        }
        @keyframes wave3 {
          0%, 100% { height: 40%; }
          33% { height: 90%; }
          66% { height: 30%; }
        }
        @keyframes wave4 {
          0%, 100% { height: 30%; }
          50% { height: 80%; }
        }
      `}</style>
        </div>
    );
};

// Loading skeleton component
const ActivitySkeleton: React.FC = () => (
    <Card>
        <CardContent className="p-4">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Format elapsed time utility
const formatElapsedTime = (timestamp: number): string => {
    const elapsed = Date.now() - timestamp;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
};

// Main component
const DiscordActivityStream: React.FC = () => {
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const lanyard = useLanyard({
        userId: "878728452155539537",
    }) as LanyardResponse;

    const detectMusicPlatform = (data: LanyardData | null): string | null => {
        if (!data) return null;
        if (data.listening_to_spotify) return "spotify";

        const activities = data.activities || [];
        for (const activity of activities) {
            const name = activity.name.toLowerCase();
            if (name.includes("apple music")) return "apple";
            if (name.includes("youtube music")) return "youtube";
        }

        return null;
    };

    const handleImageError = (id: string): void => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        setImageErrors({});
    }, [lanyard.data]);

    // Loading state
    if (lanyard.isValidating && !lanyard.data) {
        return (
            <div className="space-y-3">
                <ActivitySkeleton />
            </div>
        );
    }

    // Error state
    if (!lanyard.data?.data?.discord_user) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 rounded-md bg-muted items-center justify-center">
                            <DiscordLogoIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Discord Status</p>
                            <p className="text-xs text-muted-foreground">Currently unavailable</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const userData = lanyard.data.data.discord_user;
    const activities = lanyard.data.data.activities || [];
    const status = lanyard.data.data.discord_status;
    const platform = detectMusicPlatform(lanyard.data.data);

    const activityComponents: React.ReactElement[] = [];

    // Music activity component
    if (platform) {
        let musicData: MusicData = { title: "", artist: "" };
        let trackId = "";

        if (platform === "spotify" && lanyard.data.data.spotify) {
            const spotifyData = lanyard.data.data.spotify;
            musicData = {
                imageUrl: spotifyData.album_art_url,
                title: spotifyData.song,
                artist: spotifyData.artist,
            };
            trackId = spotifyData.track_id;
        } else {
            const musicActivity = activities.find(a =>
                a.name.toLowerCase().includes(platform === "apple" ? "apple music" : "youtube music")
            );

            if (musicActivity) {
                musicData = {
                    imageUrl: musicActivity.assets?.large_image
                        ? `https://cdn.discordapp.com/app-assets/${musicActivity.application_id}/${musicActivity.assets.large_image}`
                        : undefined,
                    title: musicActivity.details || "Unknown Song",
                    artist: musicActivity.state || "Unknown Artist",
                };

                if (musicActivity.url) {
                    trackId = musicActivity.url.split("/").pop() || "";
                }
            }
        }

        if (musicData.title) {
            const platformInfo = musicPlatforms[platform];
            const musicActivityId = `music-${platform}`;

            activityComponents.push(
                <TooltipProvider key={musicActivityId}>
                    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group border">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                {/* Album art with avatar fallback */}
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={!imageErrors[musicActivityId] ? musicData.imageUrl : undefined}
                                            alt="Album art"
                                            onError={() => handleImageError(musicActivityId)}
                                        />
                                        <AvatarFallback
                                            className="text-xs"
                                            style={{ backgroundColor: `${platformInfo.color}15` }}
                                        >
                                            <WaveBars color={platformInfo.color} size="sm" />
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Status indicator */}
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                                        statusColors[status]
                                    )} />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    {/* Platform and user info */}
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs px-2 py-0.5"
                                            style={{
                                                backgroundColor: `${platformInfo.color}15`,
                                                color: platformInfo.color
                                            }}
                                        >
                                            <Headphones className="w-3 h-3 mr-1" />
                                            {platformInfo.name}
                                        </Badge>
                                        <span className="text-sm font-medium text-foreground truncate">
                                            {userData.display_name || userData.username}
                                        </span>
                                    </div>

                                    {/* Song info */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="font-semibold text-sm truncate cursor-help">
                                                {musicData.title}
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{musicData.title}</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <p className="text-xs text-muted-foreground truncate">
                                        by {musicData.artist}
                                    </p>
                                </div>

                                {/* Play button */}
                                {trackId && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                asChild
                                            >
                                                <Link href={platformInfo.getUrl(trackId)}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Open in {platformInfo.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TooltipProvider>
            );
        }
    }

    // Other activities (filtered to exclude music)
    const nonMusicActivities = activities.filter((activity: LanyardActivity) => {
        if (!activity?.name) return false;
        const name = activity.name.toLowerCase();
        if (platform === "spotify" && name === "spotify") return false;
        if (platform === "apple" && name.includes("apple music")) return false;
        if (platform === "youtube" && name.includes("youtube music")) return false;
        return true;
    });

    nonMusicActivities.forEach((activity: LanyardActivity, index: number) => {
        const activityId = `activity-${index}`;
        const activityImage = activity.assets?.large_image
            ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}`
            : undefined;

        // Determine activity type
        const isCodeActivity = /code|vs code|visual studio|intellij|webstorm/i.test(activity.name);
        const activityType = isCodeActivity ? 'coding' : 'gaming';
        const activityColor = isCodeActivity ? '#10B981' : '#8B5CF6';
        const ActivityIcon = isCodeActivity ? Code2 : Gamepad2;

        activityComponents.push(
            <TooltipProvider key={activityId}>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group border">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            {/* Activity icon */}
                            <div className="relative">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={!imageErrors[activityId] ? activityImage : undefined}
                                        alt="Activity icon"
                                        onError={() => handleImageError(activityId)}
                                    />
                                    <AvatarFallback
                                        style={{ backgroundColor: `${activityColor}15` }}
                                    >
                                        <ActivityIcon
                                            className="h-6 w-6"
                                            style={{ color: activityColor }}
                                        />
                                    </AvatarFallback>
                                </Avatar>

                                {/* Status indicator */}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                                    statusColors[status]
                                )} />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                {/* Activity type and user */}
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        variant="secondary"
                                        className="text-xs px-2 py-0.5"
                                        style={{
                                            backgroundColor: `${activityColor}15`,
                                            color: activityColor
                                        }}
                                    >
                                        <ActivityIcon className="w-3 h-3 mr-1" />
                                        {activityType === 'coding' ? 'Coding' : 'Playing'}
                                    </Badge>
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {userData.display_name || userData.username}
                                    </span>
                                </div>

                                {/* Activity name */}
                                <p className="font-semibold text-sm truncate">
                                    {activity.name}
                                </p>

                                {/* Activity details */}
                                <div className="space-y-0.5">
                                    {activity.details && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {activity.details}
                                        </p>
                                    )}
                                    {activity.state && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {activity.state}
                                        </p>
                                    )}
                                    {activity.timestamps?.start && (
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatElapsedTime(activity.timestamps.start)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TooltipProvider>
        );
    });

    // Show activities or offline state
    if (activityComponents.length > 0) {
        return <div className="space-y-3">{activityComponents}</div>;
    }

    // Offline/no activity state
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={userData.avatar
                                    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                                    : undefined
                                }
                                alt={userData.display_name || userData.username}
                            />
                            <AvatarFallback>
                                <MessageCircle className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>

                        {/* Status indicator */}
                        <div className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                            statusColors[status]
                        )} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                                <Activity className="w-3 h-3 mr-1" />
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                            <span className="text-sm font-medium">
                                {userData.display_name || userData.username}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {status === 'offline' ? 'Currently offline' : 'No current activity'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DiscordActivityStream;