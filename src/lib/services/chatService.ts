import { SupabaseDatabase, supabase } from '../supabase';

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  company: string;
  is_validated: boolean;
  created_at: string;
  status: 'online' | 'offline';
  activities: string[];
}

export interface ChatMessage {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  chat_id: number;
  created_at: string;
  sender?: {
    representative_name: string;
    company_name: string;
  };
}

export interface Chat {
  id: number;
  participant1_id: number;
  participant2_id: number;
  created_at: string;
  updated_at: string;
  participant1?: {
    representative_name: string;
    company_name: string;
  };
  participant2?: {
    representative_name: string;
    company_name: string;
  };
  last_message?: ChatMessage;
  unread_count?: number;
}

export class ChatService {
  /**
   * Search users for chat
   */
  static async searchUsers(query: string, currentUserId: number): Promise<ChatUser[]> {
    try {
      let queryBuilder = supabase
        .from('registrations')
        .select(`
          id,
          representative_name,
          email,
          company_name,
          is_validated,
          created_at
        `)
        .eq('is_validated', true)
        .neq('id', currentUserId);

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`representative_name.ilike.%${query}%,company_name.ilike.%${query}%,email.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order('representative_name', { ascending: true });

      if (error) {
        console.error('Search users error:', error);
        return [];
      }

      // Get activities for each user
      const usersWithActivities = await Promise.all(
        data.map(async (user) => {
          const { data: activities } = await supabase
            .from('registration_activities')
            .select(`
              activity_options (
                label
              )
            `)
            .eq('registration_id', user.id);

          return {
            id: user.id,
            name: user.representative_name,
            email: user.email,
            company: user.company_name,
            is_validated: user.is_validated,
            created_at: user.created_at,
            status: user.is_validated ? 'online' : 'offline',
            activities: activities?.map(act => act.activity_options?.label) || []
          };
        })
      );

      return usersWithActivities;
    } catch (error) {
      console.error('Search users service error:', error);
      return [];
    }
  }

  /**
   * Get or create a chat between two users
   */
  static async getOrCreateChat(userId1: number, userId2: number): Promise<Chat | null> {
    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select(`
          id,
          participant1_id,
          participant2_id,
          created_at,
          updated_at
        `)
        .or(`and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
        .single();

      if (existingChat) {
        return await this.getChatWithDetails(existingChat.id);
      }

      // Create new chat
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          participant1_id: userId1,
          participant2_id: userId2
        })
        .select('id')
        .single();

      if (error || !newChat) {
        console.error('Create chat error:', error);
        return null;
      }

      return await this.getChatWithDetails(newChat.id);
    } catch (error) {
      console.error('Get or create chat service error:', error);
      return null;
    }
  }

  /**
   * Get chat with full details
   */
  private static async getChatWithDetails(chatId: number): Promise<Chat | null> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          participant1_id,
          participant2_id,
          created_at,
          updated_at,
          registrations!chats_participant1_id_fkey (
            representative_name,
            company_name
          ),
          registrations!chats_participant2_id_fkey (
            representative_name,
            company_name
          )
        `)
        .eq('id', chatId)
        .single();

      if (error || !data) {
        console.error('Get chat details error:', error);
        return null;
      }

      // Get last message
      const { data: lastMessage } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          chat_id,
          created_at,
          registrations!chat_messages_sender_id_fkey (
            representative_name,
            company_name
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        id: data.id,
        participant1_id: data.participant1_id,
        participant2_id: data.participant2_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        participant1: {
          representative_name: data.registrations?.representative_name || '',
          company_name: data.registrations?.company_name || ''
        },
        participant2: {
          representative_name: data.registrations?.representative_name || '',
          company_name: data.registrations?.company_name || ''
        },
        last_message: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          sender_id: lastMessage.sender_id,
          receiver_id: lastMessage.receiver_id,
          chat_id: lastMessage.chat_id,
          created_at: lastMessage.created_at,
          sender: {
            representative_name: lastMessage.registrations?.representative_name || '',
            company_name: lastMessage.registrations?.company_name || ''
          }
        } : undefined
      };
    } catch (error) {
      console.error('Get chat with details service error:', error);
      return null;
    }
  }

  /**
   * Get all chats for a user
   */
  static async getUserChats(userId: number): Promise<Chat[]> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          participant1_id,
          participant2_id,
          created_at,
          updated_at,
          registrations!chats_participant1_id_fkey (
            representative_name,
            company_name
          ),
          registrations!chats_participant2_id_fkey (
            representative_name,
            company_name
          )
        `)
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Get user chats error:', error);
        return [];
      }

      // Get last messages and unread counts for each chat
      const chatsWithDetails = await Promise.all(
        data.map(async (chat) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select(`
              id,
              content,
              sender_id,
              receiver_id,
              chat_id,
              created_at,
              registrations!chat_messages_sender_id_fkey (
                representative_name,
                company_name
              )
            `)
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('receiver_id', userId)
            .eq('is_read', false);

          return {
            id: chat.id,
            participant1_id: chat.participant1_id,
            participant2_id: chat.participant2_id,
            created_at: chat.created_at,
            updated_at: chat.updated_at,
            participant1: {
              representative_name: chat.registrations?.representative_name || '',
              company_name: chat.registrations?.company_name || ''
            },
            participant2: {
              representative_name: chat.registrations?.representative_name || '',
              company_name: chat.registrations?.company_name || ''
            },
            last_message: lastMessage ? {
              id: lastMessage.id,
              content: lastMessage.content,
              sender_id: lastMessage.sender_id,
              receiver_id: lastMessage.receiver_id,
              chat_id: lastMessage.chat_id,
              created_at: lastMessage.created_at,
              sender: {
                representative_name: lastMessage.registrations?.representative_name || '',
                company_name: lastMessage.registrations?.company_name || ''
              }
            } : undefined,
            unread_count: unreadCount || 0
          };
        })
      );

      return chatsWithDetails;
    } catch (error) {
      console.error('Get user chats service error:', error);
      return [];
    }
  }

  /**
   * Get messages for a chat
   */
  static async getChatMessages(chatId: number, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          chat_id,
          created_at,
          registrations!chat_messages_sender_id_fkey (
            representative_name,
            company_name
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get chat messages error:', error);
        return [];
      }

      return data.map(message => ({
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        chat_id: message.chat_id,
        created_at: message.created_at,
        sender: {
          representative_name: message.registrations?.representative_name || '',
          company_name: message.registrations?.company_name || ''
        }
      }));
    } catch (error) {
      console.error('Get chat messages service error:', error);
      return [];
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(chatId: number, senderId: number, receiverId: number, content: string): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: content,
          is_read: false
        })
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          chat_id,
          created_at,
          registrations!chat_messages_sender_id_fkey (
            representative_name,
            company_name
          )
        `)
        .single();

      if (error || !message) {
        console.error('Send message error:', error);
        return { success: false, error: 'Failed to send message' };
      }

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return {
        success: true,
        message: {
          id: message.id,
          content: message.content,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          chat_id: message.chat_id,
          created_at: message.created_at,
          sender: {
            representative_name: message.registrations?.representative_name || '',
            company_name: message.registrations?.company_name || ''
          }
        }
      };
    } catch (error) {
      console.error('Send message service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(chatId: number, userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Mark messages as read error:', error);
        return { success: false, error: 'Failed to mark messages as read' };
      }

      return { success: true };
    } catch (error) {
      console.error('Mark messages as read service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}
