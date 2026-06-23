export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'inactive' | 'cancelled'
          plan: string
          started_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'active' | 'inactive' | 'cancelled'
          plan?: string
          started_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'inactive' | 'cancelled'
          plan?: string
          started_at?: string
          expires_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          order_index: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order_index?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          video_url: string | null
          thumbnail_url: string | null
          duration_seconds: number
          order_index: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          duration_seconds?: number
          order_index?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          duration_seconds?: number
          order_index?: number
          published?: boolean
          created_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          watched_percentage: number
          completed: boolean
          last_watched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          watched_percentage?: number
          completed?: boolean
          last_watched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          watched_percentage?: number
          completed?: boolean
          last_watched_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type EventItem = Database['public']['Tables']['events']['Row']

// Extended types with relations
export type PostWithAuthor = Post & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>
  likes: { count: number }[]
  comments: { count: number }[]
  user_has_liked?: boolean
}

export type CommentWithAuthor = Comment & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>
}

export type CourseWithModules = Course & {
  modules: (Module & {
    lessons: Lesson[]
  })[]
}

export type LessonWithProgress = Lesson & {
  progress: Progress[]
}

export type ModuleWithLessons = Module & {
  lessons: Lesson[]
}
