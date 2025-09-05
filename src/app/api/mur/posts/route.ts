import { NextRequest, NextResponse } from 'next/server';
import { SupabaseDatabase, supabase } from '../../../../lib/supabase';

// GET - Fetch all posts with user info, media, likes, and comments count
export async function GET(request: NextRequest) {
  try {
    const { data: posts, error } = await supabase
      .from('mur_posts')
      .select(`
        *,
        registrations!mur_posts_user_id_fkey(company_name, email),
        mur_post_images(*),
        mur_post_documents(*),
        mur_post_likes(*),
        mur_post_comments!mur_post_comments_post_id_fkey(*)
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const postsWithCounts = posts.map(post => ({
      ...post,
      user_name: post.registrations?.company_name,
      user_email: post.registrations?.email,
      likes_count: post.mur_post_likes?.length || 0,
      comments_count: post.mur_post_comments?.filter(c => !c.is_deleted).length || 0,
      images_count: post.mur_post_images?.length || 0,
      documents_count: post.mur_post_documents?.length || 0,
      images: post.mur_post_images || [],
      documents: post.mur_post_documents || []
    }));
    
    return NextResponse.json({ posts: postsWithCounts });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const { content, images, documents, userId } = await request.json();
    
    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      );
    }
    
    // Create the post using Supabase
    const post = await SupabaseDatabase.createPost({
      user_id: userId,
      content: content,
      is_deleted: false
    });
    
    const postId = post.id;
    
    // Add images if provided
    if (images && images.length > 0) {
      for (const image of images.slice(0, 5)) { // Max 5 images
        await SupabaseDatabase.addPostImage({
          post_id: postId,
          image_url: image.url,
          image_name: image.name,
          image_size: image.size
        });
      }
    }
    
    // Add documents if provided
    if (documents && documents.length > 0) {
      for (const document of documents.slice(0, 5)) { // Max 5 documents
        await SupabaseDatabase.addPostDocument({
          post_id: postId,
          document_url: document.url,
          document_name: document.name,
          document_size: document.size,
          document_type: document.type
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      postId,
      message: 'Post created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(request: NextRequest) {
  try {
    const { postId, content, userId } = await request.json();
    
    if (!postId || !content || !userId) {
      return NextResponse.json(
        { error: 'PostId, content, and userId are required' },
        { status: 400 }
      );
    }
    
    // Verify user owns the post
    const { data: post, error: fetchError } = await supabase
      .from('mur_posts')
      .select('user_id')
      .eq('id', postId)
      .eq('is_deleted', false)
      .single();
    
    if (fetchError || !post || post.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to edit this post' },
        { status: 403 }
      );
    }
    
    // Update the post
    const { error: updateError } = await supabase
      .from('mur_posts')
      .update({ content: content })
      .eq('id', postId);
    
    if (updateError) throw updateError;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');
    
    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'PostId and userId are required' },
        { status: 400 }
      );
    }
    
    // Verify user owns the post
    const { data: post, error: fetchError } = await supabase
      .from('mur_posts')
      .select('user_id')
      .eq('id', postId)
      .eq('is_deleted', false)
      .single();
    
    if (fetchError || !post || post.user_id !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }
    
    // Soft delete the post
    const { error: deleteError } = await supabase
      .from('mur_posts')
      .update({ 
        is_deleted: true, 
        deleted_at: new Date().toISOString() 
      })
      .eq('id', postId);
    
    if (deleteError) throw deleteError;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
