"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanyard } from 'react-use-lanyard';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Gamepad2,
    Code2,
    Activity
} from 'lucide-react';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { LanyardActivity, LanyardSWRResponse } from '@/lib/types/types';
import SpotifyLogo from './spotify_logo';


// Status colors
const statusColors = {
    online: "#22c55e",
    idle: "#eab308",
    dnd: "#ef4444",
    offline: "#6b7280"
};

// Activity type detection
const getActivityInfo = (activity: LanyardActivity) => {
    const name = activity.name.toLowerCase();

    if (/code|vs code|visual studio|intellij|webstorm/i.test(name)) {
        return {
            type: 'coding',
            color: '#10B981',
            icon: Code2,
            label: 'Coding'
        };
    }

    if (name.includes('spotify')) {
        return {
            type: 'music',
            color: '#1DB954',
            icon: SpotifyLogo,
            label: 'Listening'
        };
    }

    return {
        type: 'gaming',
        color: '#8B5CF6',
        icon: Gamepad2,
        label: 'Playing'
    };
};


const WaveBars: React.FC<{ color?: string }> = ({ color = "#1DB954" }) => (
    <div className="flex items-end justify-center gap-0.5 h-3">
        {[1, 2, 3].map((i) => (
            <motion.div
                key={i}
                className="w-0.5 rounded-sm"
                style={{ backgroundColor: color }}
                animate={{
                    height: ['20%', '100%', '20%']
                }}
                transition={{
                    duration: 1.5 + i * 0.1,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: i * 0.1
                }}
            />
        ))}
    </div>
);

export const DiscordStatusPill: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const lanyard = useLanyard({
        userId: "878728452155539537",
    }) as LanyardSWRResponse;

    // Loading state
    if (lanyard.isValidating && !lanyard.data) {
        return (
            <motion.div
                className="h-10 w-10 bg-muted rounded-full flex items-center justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            </motion.div>
        );
    }

    if (!lanyard.data?.data?.discord_user) {
        return (
            <motion.div className="h-10 w-10 bg-muted/50 rounded-full flex items-center justify-center">
                <DiscordLogoIcon className="w-4 h-4 text-muted-foreground" />
            </motion.div>
        );
    }

    const userData = lanyard.data.data.discord_user;
    const activities = lanyard.data.data.activities || [];
    const status = lanyard.data.data.discord_status;
    const spotify = lanyard.data.data.spotify;
    const isListeningToSpotify = lanyard.data.data.listening_to_spotify;

    // Determine current activity
    let currentActivity = null;
    let activityInfo = null;

    if (isListeningToSpotify && spotify) {
        currentActivity = {
            name: 'Spotify',
            details: spotify.song,
            state: spotify.artist,
        };
        activityInfo = {
            type: 'music',
            color: '#1DB954',
            icon: SpotifyLogo,
            label: 'Listening'
        };
    } else if (activities.length > 0) {
        // Find non-Spotify activity
        const nonSpotifyActivity = activities.find(a =>
            !a.name.toLowerCase().includes('spotify')
        );

        if (nonSpotifyActivity) {
            currentActivity = nonSpotifyActivity;
            activityInfo = getActivityInfo(nonSpotifyActivity);
        }
    }

    const statusColor = statusColors[status];
    const ActivityIcon = activityInfo?.icon || Activity;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        className={cn(
                            "relative cursor-pointer select-none",
                            "bg-background/80 backdrop-blur-sm border border-border/50",
                            "rounded-full flex items-center transition-all duration-300",
                            "hover:bg-background/90 hover:border-border",
                            "h-10" // Fixed height to match dock
                        )}
                        onClick={() => setIsExpanded(!isExpanded)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            width: isExpanded && currentActivity ? "auto" : "40px"
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded && currentActivity ? (
                                // Expanded state with activity details
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="flex items-center h-full px-3 space-x-2 min-w-0"
                                >
                                    {/* Activity icon with animation */}
                                    <div className="flex-shrink-0">
                                        {activityInfo?.type === 'music' ? (
                                            <WaveBars color={activityInfo.color} />
                                        ) : (
                                            <ActivityIcon
                                                className="w-4 h-4"
                                                style={{ color: activityInfo?.color || statusColor }}
                                            />
                                        )}
                                    </div>

                                    {/* Activity text */}
                                    <div className="flex-1 min-w-0 max-w-40">
                                        <div className="text-xs font-medium truncate">
                                            {currentActivity.details || currentActivity.name}
                                        </div>
                                        {currentActivity.state && (
                                            <div className="text-xs text-muted-foreground truncate">
                                                {currentActivity.state}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status indicator */}
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: statusColor }}
                                    />
                                </motion.div>
                            ) : (
                                // Collapsed state
                                <motion.div
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-10 w-10 flex items-center justify-center relative"
                                >
                                    {/* Avatar */}
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage
                                            src={userData.avatar
                                                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                                                : undefined
                                            }
                                            alt={userData.display_name || userData.username}
                                        />
                                        <AvatarFallback className="text-xs">
                                            {(userData.display_name || userData.username).charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Status dot */}
                                    <div
                                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
                                        style={{ backgroundColor: statusColor }}
                                    />

                                    {/* Activity indicator */}
                                    {currentActivity && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${activityInfo?.color || statusColor}20` }}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <ActivityIcon
                                                className="w-2.5 h-2.5"
                                                style={{ color: activityInfo?.color || statusColor }}
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-64">
                    <div className="space-y-1">
                        <div className="font-medium">
                            {userData.display_name || userData.username}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                            Status: {status}
                        </div>
                        {currentActivity && (
                            <div className="text-xs">
                                <div className="font-medium">
                                    {activityInfo?.label} {currentActivity.name}
                                </div>
                                {currentActivity.details && (
                                    <div className="text-muted-foreground">
                                        {currentActivity.details}
                                    </div>
                                )}
                                {currentActivity.state && (
                                    <div className="text-muted-foreground">
                                        {currentActivity.state}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                            Click to {isExpanded ? 'collapse' : 'expand'}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};