import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://tcmmloypcovltgciocdm.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Validate configuration
if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY is not defined in environment variables');
  console.error('Please add SUPABASE_ANON_KEY to your .env.local file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these with Supabase CLI)
export interface Registration {
  id: number
  company_name: string
  company_size: string
  address: string
  representative_name: string
  position: string
  email: string
  phone: string
  selected_event: string
  additional_info?: string
  accept_terms: boolean
  is_validated: boolean
  validated_at?: string
  user_password?: string
  created_at: string
  updated_at: string
}

export interface ActivityOption {
  id: string
  label: string
  category: string
  created_at: string
}

export interface RegistrationActivity {
  id: number
  registration_id: number
  activity_id: string
  activity_label: string
  activity_category: string
}

export interface MurPost {
  id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}

export interface MurPostImage {
  id: number
  post_id: number
  image_url: string
  image_name: string
  image_size: number
  created_at: string
}

export interface MurPostDocument {
  id: number
  post_id: number
  document_url: string
  document_name: string
  document_size: number
  document_type: string
  created_at: string
}

export interface MurPostLike {
  id: number
  post_id: number
  user_id: number
  created_at: string
}

export interface MurPostComment {
  id: number
  post_id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}

export interface MurCommentLike {
  id: number
  comment_id: number
  user_id: number
  created_at: string
}

export interface Chat {
  id: number
  name: string
  type: 'admin' | 'individual' | 'group'
  created_at: string
  last_message_id?: number
}

export interface ChatParticipant {
  id: number
  chat_id: number
  user_id: number
  joined_at: string
  is_admin: boolean
}

export interface ChatMessage {
  id: number
  chat_id: number
  sender_id: number
  content: string
  timestamp: string
  is_admin: boolean
}

// Database helper functions
export class SupabaseDatabase {
  // Registration functions
  static async createRegistration(data: Omit<Registration, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('registrations')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async getRegistrationByEmail(email: string) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async validateRegistration(id: number) {
    const { data, error } = await supabase
      .from('registrations')
      .update({ 
        is_validated: true, 
        validated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Activity functions
  static async getActivityOptions() {
    const { data, error } = await supabase
      .from('activity_options')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async addRegistrationActivity(data: Omit<RegistrationActivity, 'id'>) {
    const { data: result, error } = await supabase
      .from('registration_activities')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  // MUR Post functions
  static async createPost(data: Omit<MurPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('mur_posts')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async getPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('mur_posts')
      .select(`
        *,
        mur_post_images(*),
        mur_post_documents(*),
        mur_post_likes(*),
        mur_post_comments(*)
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  }

  static async addPostImage(data: Omit<MurPostImage, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('mur_post_images')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async addPostDocument(data: Omit<MurPostDocument, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('mur_post_documents')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async togglePostLike(postId: number, userId: number) {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('mur_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('mur_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      
      if (error) throw error
      return { liked: false }
    } else {
      // Add like
      const { error } = await supabase
        .from('mur_post_likes')
        .insert([{ post_id: postId, user_id: userId }])
      
      if (error) throw error
      return { liked: true }
    }
  }

  // Chat functions
  static async createChat(data: Omit<Chat, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('chats')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async getChatsForUser(userId: number) {
    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        chats(*),
        chat_messages(*)
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async sendMessage(data: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const { data: result, error } = await supabase
      .from('chat_messages')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async getChatMessages(chatId: number, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  }
}

export default supabase
