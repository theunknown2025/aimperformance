import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST - Upload files (images or documents)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string; // 'image' or 'document'
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    if (!type || !['image', 'document'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "image" or "document"' },
        { status: 400 }
      );
    }
    
    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    const allowedTypes = type === 'image' ? allowedImageTypes : allowedDocumentTypes;
    
    // Validate file sizes (5MB for images, 10MB for documents)
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    
    const uploadedFiles = [];
    
    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${type}. Allowed types: ${allowedTypes.join(', ')}` },
          { status: 400 }
        );
      }
      
      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large. Maximum size for ${type}s: ${maxSize / (1024 * 1024)}MB` },
          { status: 400 }
        );
      }
    }
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Process each file
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomString}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);
      
      // Write file to disk
      await writeFile(filePath, buffer);
      
      // Create file URL
      const fileUrl = `/uploads/${type}/${fileName}`;
      
      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type
      });
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} ${type}${uploadedFiles.length > 1 ? 's' : ''} uploaded successfully`
    });
    
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
