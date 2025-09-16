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

export interface LanyardUser {
  id: string;
  username: string;
  display_name?: string;
  avatar?: string;
  discriminator: string;
  public_flags?: number;
}

export interface LanyardActivity {
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

export interface LanyardSpotify {
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

export interface LanyardData {
  discord_user: LanyardUser;
  listening_to_spotify: boolean;
  spotify?: LanyardSpotify;
  activities: LanyardActivity[];
  discord_status: "online" | "idle" | "dnd" | "offline";
}

export interface LanyardSWRResponse {
  data?: {
    data: LanyardData;
  };
  error?: any;
  isValidating: boolean;
}

export interface MusicPlatform {
    name: string;
    color: string;
    logo: React.ReactElement;
    getUrl: (id: string) => string;
}

export interface MusicData {
    imageUrl?: string;
    title: string;
    artist: string;
}