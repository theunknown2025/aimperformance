import { SupabaseDatabase, supabase } from '../supabase';

export interface MURPost {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user?: {
    representative_name: string;
    company_name: string;
  };
  images?: Array<{
    id: number;
    filename: string;
    url: string;
  }>;
  documents?: Array<{
    id: number;
    filename: string;
    url: string;
  }>;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
}

export interface CreateMURPostData {
  title: string;
  content: string;
  user_id: number;
  images?: File[];
  documents?: File[];
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: string;
  user?: {
    representative_name: string;
    company_name: string;
  };
}

export class MURService {
  /**
   * Get all MUR posts with related data
   */
  static async getAllPosts(): Promise<MURPost[]> {
    try {
      const { data, error } = await supabase
        .from('mur_posts')
        .select(`
          id,
          title,
          content,
          user_id,
          created_at,
          updated_at,
          is_deleted,
          registrations!inner (
            representative_name,
            company_name
          ),
          mur_images (
            id,
            filename,
            url
          ),
          mur_documents (
            id,
            filename,
            url
          )
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get MUR posts error:', error);
        return [];
      }

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        user_id: post.user_id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        is_deleted: post.is_deleted,
        user: {
          representative_name: post.registrations.representative_name,
          company_name: post.registrations.company_name
        },
        images: post.mur_images || [],
        documents: post.mur_documents || []
      }));
    } catch (error) {
      console.error('Get MUR posts service error:', error);
      return [];
    }
  }

  /**
   * Get MUR post by ID
   */
  static async getPostById(id: number): Promise<MURPost | null> {
    try {
      const { data, error } = await supabase
        .from('mur_posts')
        .select(`
          id,
          title,
          content,
          user_id,
          created_at,
          updated_at,
          is_deleted,
          registrations!inner (
            representative_name,
            company_name
          ),
          mur_images (
            id,
            filename,
            url
          ),
          mur_documents (
            id,
            filename,
            url
          )
        `)
        .eq('id', id)
        .eq('is_deleted', false)
        .single();

      if (error || !data) {
        console.error('Get MUR post error:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_deleted: data.is_deleted,
        user: {
          representative_name: data.registrations.representative_name,
          company_name: data.registrations.company_name
        },
        images: data.mur_images || [],
        documents: data.mur_documents || []
      };
    } catch (error) {
      console.error('Get MUR post service error:', error);
      return null;
    }
  }

  /**
   * Create a new MUR post
   */
  static async createPost(data: CreateMURPostData): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
      // Insert the post
      const { data: post, error: postError } = await supabase
        .from('mur_posts')
        .insert({
          title: data.title,
          content: data.content,
          user_id: data.user_id,
          is_deleted: false
        })
        .select('id')
        .single();

      if (postError || !post) {
        console.error('Create MUR post error:', postError);
        return { success: false, error: 'Failed to create post' };
      }

      // Handle file uploads if any
      if (data.images && data.images.length > 0) {
        await this.uploadImages(post.id, data.images);
      }

      if (data.documents && data.documents.length > 0) {
        await this.uploadDocuments(post.id, data.documents);
      }

      return { success: true, id: post.id };
    } catch (error) {
      console.error('Create MUR post service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Update a MUR post
   */
  static async updatePost(id: number, data: Partial<CreateMURPostData>, userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify ownership
      const { data: existingPost } = await supabase
        .from('mur_posts')
        .select('user_id')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();

      if (!existingPost || existingPost.user_id !== userId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Update the post
      const { error } = await supabase
        .from('mur_posts')
        .update({
          title: data.title,
          content: data.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Update MUR post error:', error);
        return { success: false, error: 'Failed to update post' };
      }

      return { success: true };
    } catch (error) {
      console.error('Update MUR post service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Delete a MUR post (soft delete)
   */
  static async deletePost(id: number, userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify ownership
      const { data: existingPost } = await supabase
        .from('mur_posts')
        .select('user_id')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();

      if (!existingPost || existingPost.user_id !== userId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Soft delete the post
      const { error } = await supabase
        .from('mur_posts')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) {
        console.error('Delete MUR post error:', error);
        return { success: false, error: 'Failed to delete post' };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete MUR post service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Upload images for a post
   */
  private static async uploadImages(postId: number, images: File[]): Promise<void> {
    try {
      for (const image of images) {
        const filename = `${Date.now()}_${image.name}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('mur-images')
          .upload(filename, image);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('mur-images')
          .getPublicUrl(filename);

        // Insert image record
        await supabase
          .from('mur_images')
          .insert({
            post_id: postId,
            filename: filename,
            url: urlData.publicUrl
          });
      }
    } catch (error) {
      console.error('Upload images service error:', error);
    }
  }

  /**
   * Upload documents for a post
   */
  private static async uploadDocuments(postId: number, documents: File[]): Promise<void> {
    try {
      for (const document of documents) {
        const filename = `${Date.now()}_${document.name}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('mur-documents')
          .upload(filename, document);

        if (uploadError) {
          console.error('Document upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('mur-documents')
          .getPublicUrl(filename);

        // Insert document record
        await supabase
          .from('mur_documents')
          .insert({
            post_id: postId,
            filename: filename,
            url: urlData.publicUrl
          });
      }
    } catch (error) {
      console.error('Upload documents service error:', error);
    }
  }

  /**
   * Get comments for a post
   */
  static async getComments(postId: number): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('mur_comments')
        .select(`
          id,
          content,
          user_id,
          post_id,
          created_at,
          registrations!inner (
            representative_name,
            company_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get comments error:', error);
        return [];
      }

      return data.map(comment => ({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        post_id: comment.post_id,
        created_at: comment.created_at,
        user: {
          representative_name: comment.registrations.representative_name,
          company_name: comment.registrations.company_name
        }
      }));
    } catch (error) {
      console.error('Get comments service error:', error);
      return [];
    }
  }

  /**
   * Add a comment to a post
   */
  static async addComment(postId: number, userId: number, content: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('mur_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content: content
        });

      if (error) {
        console.error('Add comment error:', error);
        return { success: false, error: 'Failed to add comment' };
      }

      return { success: true };
    } catch (error) {
      console.error('Add comment service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Toggle like on a post
   */
  static async toggleLike(postId: number, userId: number): Promise<{ success: boolean; liked?: boolean; error?: string }> {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('mur_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('mur_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Unlike error:', error);
          return { success: false, error: 'Failed to unlike post' };
        }

        return { success: true, liked: false };
      } else {
        // Like
        const { error } = await supabase
          .from('mur_likes')
          .insert({
            post_id: postId,
            user_id: userId
          });

        if (error) {
          console.error('Like error:', error);
          return { success: false, error: 'Failed to like post' };
        }

        return { success: true, liked: true };
      }
    } catch (error) {
      console.error('Toggle like service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}
