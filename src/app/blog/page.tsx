'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { getBlogPosts, saveBlogPost, deleteBlogPost, updateBlogPost, uploadBlogImages, BlogPost } from '../../lib/blogService';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { parseDocument } from '../../lib/fileParser';
import { uploadDocumentToCloudinary } from '../../lib/cloudinary';

// BlogPost interface is now imported from blogService

export default function BlogPage(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Akeno Tech Team',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load blog posts from Firebase
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error: any) {
        console.error('Error loading blog posts:', error);
        setBlogPosts([]);
        // Show user-friendly error message
        if (error?.message?.includes('permission denied')) {
          console.error('⚠️ Firebase Permission Error: Please update Firestore security rules in Firebase Console');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();

    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual elements
    const elementTimers = [0, 1, 2, 3, 4, 5].map((index) => 
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
      }, 300 + (index * 150))
    );

    return () => {
      clearTimeout(timer);
      elementTimers.forEach(clearTimeout);
    };
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePublishPost = async () => {
    if (newPost.title && newPost.content) {
      if (isEditing && editingPost) {
        await handleUpdatePost();
      } else {
        setSavingPost(true);
        try {
          const postData = {
            title: newPost.title,
            content: newPost.content,
            excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
            author: newPost.author,
            date: new Date().toISOString().split('T')[0],
            tags: newPost.tags,
            readTime: Math.ceil(newPost.content.split(' ').length / 200) + ' min read'
          };

          // Save to Firebase first to get post ID
          const postId = await saveBlogPost(postData);
          console.log('✅ Blog post saved successfully');
          
          // Upload images if any (don't block publishing if this fails)
          if (selectedImages.length > 0) {
            setUploadingImages(true);
            // Upload images in background - don't wait for it to complete
            uploadBlogImages(selectedImages, postId)
              .then((imageUrls) => {
                console.log('✅ Images uploaded successfully:', imageUrls);
                if (imageUrls && imageUrls.length > 0) {
                  // Update the post with image URLs if upload succeeds
                  return updateBlogPost(postId, { images: imageUrls });
                } else {
                  throw new Error('No image URLs returned');
                }
              })
              .then(() => {
                console.log('✅ Post updated with image URLs');
                // Reload posts to show updated post with images
                return getBlogPosts();
              })
              .then((posts) => {
                console.log('✅ Reloaded posts with images');
                setBlogPosts(posts);
                setUploadingImages(false);
              })
              .catch((error: any) => {
                console.error('❌ Error uploading/updating images:', error);
                console.error('Error code:', error?.code);
                console.error('Error message:', error?.message);
                setUploadingImages(false);
                // Errors are logged to console, no alert shown
              });
          }
          
          // Reload posts to show the new post immediately (even without images)
          const updatedPosts = await getBlogPosts();
          setBlogPosts(updatedPosts);
          
          setNewPost({
            title: '',
            content: '',
            excerpt: '',
            author: 'Akeno Tech Team',
            tags: [],
          });
          setSelectedImages([]);
          setImagePreviews([]);
          setIsWritingMode(false);
          setSavingPost(false);
        } catch (error: any) {
          console.error('Error saving blog post:', error);
          setSavingPost(false);
          // Errors are logged to console, no alert shown
        }
      }
    }
  };

  const handleReadMore = async (post: BlogPost) => {
    // Reload the post to get latest images
    try {
      const allPosts = await getBlogPosts();
      const updatedPost = allPosts.find(p => p.id === post.id);
      if (updatedPost) {
        console.log('Post images:', updatedPost.images);
        setSelectedPost(updatedPost);
      } else {
    setSelectedPost(post);
      }
    } catch (error) {
      console.error('Error reloading post:', error);
      setSelectedPost(post);
    }
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      tags: post.tags,
    });
    setImagePreviews(post.images || []);
    setSelectedImages([]);
    setIsEditing(true);
    setIsWritingMode(true);
  };

  const handleUpdatePost = async () => {
    if (editingPost && newPost.title && newPost.content) {
      setSavingPost(true);
      try {
        const updatedData = {
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
          author: newPost.author,
          tags: newPost.tags,
          readTime: Math.ceil(newPost.content.split(' ').length / 200) + ' min read'
        };

        await updateBlogPost(editingPost.id, updatedData);
        console.log('✅ Blog post updated successfully');
        
        // Handle images: keep existing ones that are still in previews, add new ones
        const existingImageUrls = imagePreviews.filter(p => p.startsWith('http'));
        let finalImageUrls = existingImageUrls;
        
        // Update with existing images first (in case some were removed)
        await updateBlogPost(editingPost.id, { images: finalImageUrls });
        
        // Upload new images if any (don't block update if this fails)
        if (selectedImages.length > 0) {
          setUploadingImages(true);
          // Upload images in background
          uploadBlogImages(selectedImages, editingPost.id)
            .then((newImageUrls) => {
              finalImageUrls = [...existingImageUrls, ...newImageUrls];
              return updateBlogPost(editingPost.id, { images: finalImageUrls });
            })
            .then(() => {
              // Reload posts to show updated post with images
              return getBlogPosts();
            })
            .then(setBlogPosts)
            .catch((error) => {
              console.error('Error uploading images:', error);
              // Errors are logged to console, no alert shown
            })
            .finally(() => {
              setUploadingImages(false);
            });
        }
        
        // Reload posts to ensure we have the latest data (even without new images)
        const updatedPosts = await getBlogPosts();
        setBlogPosts(updatedPosts);

        // Reset form and editing state
        setNewPost({
          title: '',
          content: '',
          excerpt: '',
          author: 'Akeno Tech Team',
          tags: [],
        });
        setSelectedImages([]);
        setImagePreviews([]);
        setEditingPost(null);
        setIsEditing(false);
        setIsWritingMode(false);
        setSavingPost(false);
      } catch (error) {
        console.error('Error updating blog post:', error);
        setSavingPost(false);
        // Errors are logged to console, no alert shown
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteBlogPost(postId);
        console.log('✅ Blog post deleted successfully');
        // Reload posts to ensure we have the latest data
        const updatedPosts = await getBlogPosts();
        setBlogPosts(updatedPosts);
      } catch (error) {
        console.error('Error deleting blog post:', error);
        // Errors are logged to console, no alert shown
      }
    }
  };

  const handleCancelEdit = () => {
    setNewPost({
      title: '',
      content: '',
      excerpt: '',
      author: 'Akeno Tech Team',
      tags: [],
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setEditingPost(null);
    setIsEditing(false);
    setIsWritingMode(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    // Check if it's an existing image (URL) or a new preview (data URL)
    const preview = imagePreviews[index];
    const isExistingImage = preview && preview.startsWith('http');
    
    if (isExistingImage) {
      // Remove from previews only (existing images from Firebase)
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      // Note: We don't delete from Firebase here - user can do that separately if needed
    } else {
      // Remove new image preview and file
      const newImageIndex = index - (imagePreviews.filter(p => p.startsWith('http')).length);
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      setSelectedImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
  };

  // Handle PDF/Word document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = file.type || file.name.split('.').pop()?.toLowerCase();
    const isValidFile = 
      fileType === 'application/pdf' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.doc');

    if (!isValidFile) {
      console.error('Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx)');
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
      return;
    }

    setDocumentFile(file);
    setUploadingDocument(true);

    try {
      // Upload file to Cloudinary (better CORS support)
      const fileUrl = await uploadDocumentToCloudinary(file, 'blog-documents');
      console.log('✅ Document uploaded to Cloudinary:', fileUrl);

      // Parse document to extract text and images
      const parsed = await parseDocument(file);
      
      // Set the extracted content
      setNewPost(prev => ({
        ...prev,
        title: parsed.title || prev.title || file.name.replace(/\.(pdf|docx?|doc)$/i, ''),
        content: parsed.text,
        excerpt: parsed.text.substring(0, 150) + '...',
      }));

      // Add extracted images
      if (parsed.images && parsed.images.length > 0) {
        setSelectedImages(prev => [...prev, ...parsed.images]);
        parsed.images.forEach(imageFile => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(imageFile);
        });
      }

      // Automatically open writing mode to show the extracted content
      setIsWritingMode(true);
      setIsUploadMode(false);
      
      console.log(`✅ Document uploaded successfully! File saved to Cloudinary. Text extracted: ${parsed.text.length} characters. Images found: ${parsed.images.length}`);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      console.error('Please check: File is not password-protected, file size is under 10MB, file format is supported (.pdf, .doc, .docx)');
    } finally {
      setUploadingDocument(false);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  // Rich text formatting functions
  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    const textBefore = newPost.content.substring(0, start);
    const textAfter = newPost.content.substring(end);

    // Save current scroll position to maintain view
    const currentScrollTop = textarea.scrollTop;
    const currentScrollLeft = textarea.scrollLeft;
    
    // If text is selected, wrap it; otherwise, insert markers and place cursor between them
    if (selectedText) {
      const newText = textBefore + before + selectedText + after + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      
      // Restore selection and scroll position after state update
      // Use multiple attempts to ensure scroll position is restored
      const restoreScroll = () => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      };
      
      // Immediate restore
      setTimeout(restoreScroll, 0);
      
      // After React update - multiple attempts
      setTimeout(() => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.focus();
          const newStart = start + before.length;
          const newEnd = end + before.length;
          textareaEl.setSelectionRange(newStart, newEnd);
          // Restore scroll position
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      }, 20);
      
      // Additional restore after longer delay
      setTimeout(() => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      }, 100);
      
      // Final restore using requestAnimationFrame
      requestAnimationFrame(() => {
        setTimeout(() => {
          const textareaEl = contentTextareaRef.current;
          if (textareaEl) {
            textareaEl.scrollTop = currentScrollTop;
            textareaEl.scrollLeft = currentScrollLeft;
          }
        }, 0);
      });
    } else {
      const newText = textBefore + before + after + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      
      // Place cursor between the markers and maintain scroll position
      const restoreScroll = () => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      };
      
      // Immediate restore
      setTimeout(restoreScroll, 0);
      
      // After React update - multiple attempts
      setTimeout(() => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.focus();
          const newCursorPos = start + before.length;
          textareaEl.setSelectionRange(newCursorPos, newCursorPos);
          // Restore scroll position
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      }, 20);
      
      // Additional restore after longer delay
      setTimeout(() => {
        const textareaEl = contentTextareaRef.current;
        if (textareaEl) {
          textareaEl.scrollTop = currentScrollTop;
          textareaEl.scrollLeft = currentScrollLeft;
        }
      }, 100);
      
      // Final restore using requestAnimationFrame
      requestAnimationFrame(() => {
        setTimeout(() => {
          const textareaEl = contentTextareaRef.current;
          if (textareaEl) {
            textareaEl.scrollTop = currentScrollTop;
            textareaEl.scrollLeft = currentScrollLeft;
          }
        }, 0);
      });
    }
  };

  const formatBold = () => insertTextAtCursor('**', '**');
  const formatItalic = () => insertTextAtCursor('*', '*');
  const formatUnderline = () => insertTextAtCursor('<u>', '</u>');
  const formatStrikethrough = () => insertTextAtCursor('~~', '~~');
  const formatCode = () => insertTextAtCursor('`', '`');
  const formatSubscript = () => insertTextAtCursor('<sub>', '</sub>');
  const formatSuperscript = () => insertTextAtCursor('<sup>', '</sup>');
  
  // Font size formatting functions - Word style (just number, adds px)
  const formatFontSize = (size: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    // Save current scroll position to maintain view
    const currentScrollTop = textarea.scrollTop;
    const currentScrollLeft = textarea.scrollLeft;
    
    const fontSize = size + 'px'; // Convert number to px value
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    const textBefore = newPost.content.substring(0, start);
    const textAfter = newPost.content.substring(end);
    
    if (selectedText) {
      // Wrap selected text with font size tag
      const spanTag = `<span style="font-size: ${fontSize};">`;
      const newText = textBefore + spanTag + selectedText + '</span>' + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      setTimeout(() => {
        setTimeout(() => {
          textarea.focus();
          const newStart = start + spanTag.length;
          const newEnd = end + spanTag.length;
          textarea.setSelectionRange(newStart, newEnd);
          // Restore scroll position to keep view exactly where it was
          textarea.scrollTop = currentScrollTop;
          textarea.scrollLeft = currentScrollLeft;
          // Then scroll selection into view if needed (but don't jump)
          const selectionTop = textarea.scrollTop;
          const selectionBottom = selectionTop + textarea.clientHeight;
          const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
          const textBeforeSelection = newText.substring(0, newStart);
          const linesBefore = textBeforeSelection.split('\n').length;
          const selectionLineTop = linesBefore * lineHeight;
          const selectionLineBottom = selectionLineTop + lineHeight;
          
          // Only adjust scroll if selection is out of view
          if (selectionLineTop < selectionTop) {
            textarea.scrollTop = Math.max(0, selectionLineTop - 20); // Small margin
          } else if (selectionLineBottom > selectionBottom) {
            textarea.scrollTop = selectionLineBottom - textarea.clientHeight + 20; // Small margin
          }
        }, 10);
      }, 0);
    } else {
      // Insert font size tag at cursor
      const spanTag = `<span style="font-size: ${fontSize};">`;
      const newText = textBefore + spanTag + '</span>' + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      setTimeout(() => {
        setTimeout(() => {
          textarea.focus();
          const newCursorPos = start + spanTag.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          // Restore scroll position to keep view exactly where it was
          textarea.scrollTop = currentScrollTop;
          textarea.scrollLeft = currentScrollLeft;
          // Then scroll cursor into view if needed (but don't jump)
          const scrollTop = textarea.scrollTop;
          const scrollBottom = scrollTop + textarea.clientHeight;
          const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
          const textBeforeCursor = newText.substring(0, newCursorPos);
          const linesBefore = textBeforeCursor.split('\n').length;
          const cursorLineTop = linesBefore * lineHeight;
          const cursorLineBottom = cursorLineTop + lineHeight;
          
          // Only adjust scroll if cursor is out of view
          if (cursorLineTop < scrollTop) {
            textarea.scrollTop = Math.max(0, cursorLineTop - 20); // Small margin
          } else if (cursorLineBottom > scrollBottom) {
            textarea.scrollTop = cursorLineBottom - textarea.clientHeight + 20; // Small margin
          }
        }, 10);
      }, 0);
    }
  };
  const formatCodeBlock = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    const textBefore = newPost.content.substring(0, start);
    const textAfter = newPost.content.substring(end);
    
    if (selectedText) {
      const newText = textBefore + '```\n' + selectedText + '\n```' + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, end + 4);
      }, 0);
    } else {
      const newText = textBefore + '```\n\n```' + textAfter;
      setNewPost(prev => ({ ...prev, content: newText }));
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, start + 4);
      }, 0);
    }
  };
  const formatBlockquote = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = newPost.content.indexOf('\n', start);
    const line = lineEnd === -1 
      ? newPost.content.substring(lineStart)
      : newPost.content.substring(lineStart, lineEnd);
    
    const newLine = '> ' + line.trim();
    const before = newPost.content.substring(0, lineStart);
    const after = lineEnd === -1 ? '' : newPost.content.substring(lineEnd);
    
    setNewPost(prev => ({ ...prev, content: before + newLine + after }));
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = lineStart + newLine.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  const formatHorizontalRule = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const textBefore = newPost.content.substring(0, start);
    const textAfter = newPost.content.substring(start);
    const newText = textBefore + (textBefore.endsWith('\n') ? '' : '\n') + '---\n' + textAfter;
    
    setNewPost(prev => ({ ...prev, content: newText }));
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + (textBefore.endsWith('\n') ? 0 : 1) + 5;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  const formatHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertTextAtCursor(prefix, '');
  };
  const formatLink = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    
    if (selectedText) {
      insertTextAtCursor('[', `](${selectedText})`);
    } else {
      insertTextAtCursor('[Link Text](', ')');
    }
  };
  const formatImage = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    
    if (selectedText) {
      insertTextAtCursor('![', `](${selectedText})`);
    } else {
      insertTextAtCursor('![Alt Text](', ')');
    }
  };
  // Helper function to find the last numbered list item number before a position
  const findLastNumberedListItem = (text: string, beforePosition: number): number => {
    const textBefore = text.substring(0, beforePosition);
    const lines = textBefore.split('\n');
    let lastNumber = 0;
    
    // Check lines from bottom to top to find the last numbered list item
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      // Match numbered list pattern: "1. ", "2. ", "10. ", etc.
      const match = line.match(/^(\d+)\.\s/);
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > lastNumber) {
          lastNumber = number;
        }
        // If we find a numbered item, check if the previous line is also numbered
        // If not, we've found the end of the list sequence
        if (i > 0) {
          const prevLine = lines[i - 1].trim();
          const prevMatch = prevLine.match(/^(\d+)\.\s/);
          if (!prevMatch) {
            break; // Found the start of the current list sequence
          }
        }
      } else if (line.trim() !== '' && lastNumber > 0) {
        // If we hit a non-empty line that's not a numbered list, stop
        break;
      }
    }
    
    return lastNumber;
  };

  const formatList = (ordered: boolean = false) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    // Save current scroll position
    const currentScrollTop = textarea.scrollTop;
    const currentScrollLeft = textarea.scrollLeft;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    
    // If ordered list, find the starting number
    let startNumber = 1;
    if (ordered) {
      startNumber = findLastNumberedListItem(newPost.content, start) + 1;
    }
    
    // If text is selected, convert each line to list item
    if (selectedText && selectedText.includes('\n')) {
      const lines = selectedText.split('\n');
      const listItems = lines
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          if (ordered) {
            return `${startNumber + index}. ${line.trim()}`;
          } else {
            return `- ${line.trim()}`;
          }
        })
        .join('\n');
      
      const textBefore = newPost.content.substring(0, start);
      const textAfter = newPost.content.substring(end);
      const newText = textBefore + listItems + textAfter;
      
      setNewPost(prev => ({ ...prev, content: newText }));
      
      // Use double setTimeout to ensure DOM is updated
      setTimeout(() => {
        setTimeout(() => {
          textarea.focus();
          // Restore scroll position
          textarea.scrollTop = currentScrollTop;
          textarea.scrollLeft = currentScrollLeft;
          // Set selection first
          textarea.setSelectionRange(start, start + listItems.length);
        }, 10);
      }, 0);
    } else if (selectedText && selectedText.trim() !== '') {
      // Single selected text - convert to list item
      const listItem = ordered 
        ? `${startNumber}. ${selectedText.trim()}`
        : `- ${selectedText.trim()}`;
      const textBefore = newPost.content.substring(0, start);
      const textAfter = newPost.content.substring(end);
      const newText = textBefore + listItem + textAfter;
      
      setNewPost(prev => ({ ...prev, content: newText }));
      
      // Use double setTimeout to ensure DOM is updated
      setTimeout(() => {
        setTimeout(() => {
          textarea.focus();
          // Restore scroll position
          textarea.scrollTop = currentScrollTop;
          textarea.scrollLeft = currentScrollLeft;
          // Set selection to the formatted text
          const newStart = start;
          const newEnd = start + listItem.length;
          textarea.setSelectionRange(newStart, newEnd);
        }, 10);
      }, 0);
    } else {
      // Single line - convert current line to list item
      const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = newPost.content.indexOf('\n', start);
      const line = lineEnd === -1 
        ? newPost.content.substring(lineStart)
        : newPost.content.substring(lineStart, lineEnd);
      
      const newLine = ordered 
        ? `${startNumber}. ${line.trim()}`
        : `- ${line.trim()}`;
      const before = newPost.content.substring(0, lineStart);
      const after = lineEnd === -1 ? '' : newPost.content.substring(lineEnd);
      
      setNewPost(prev => ({ ...prev, content: before + newLine + after }));
      
      // Use double setTimeout to ensure DOM is updated
      setTimeout(() => {
        setTimeout(() => {
          textarea.focus();
          // Restore scroll position
          textarea.scrollTop = currentScrollTop;
          textarea.scrollLeft = currentScrollLeft;
          // Set cursor position
          const newCursorPos = lineStart + newLine.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 10);
      }, 0);
    }
  };
  const insertTable = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const textBefore = newPost.content.substring(0, start);
    const textAfter = newPost.content.substring(start);
    const table = '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n';
    const newText = textBefore + table + textAfter;
    
    setNewPost(prev => ({ ...prev, content: newText }));
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + table.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Helper function to parse bold markdown (**text**) and render it
  const parseBoldText = (text: string): React.ReactNode[] => {
    if (!text.includes('**')) {
      return [text];
    }
    const parts = text.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? (
        <strong key={index} className="font-bold">{part}</strong>
      ) : (
        part
      )
    );
  };

  // Helper function to parse all formatting (bold, italic, underline, strikethrough, code, sub, sup)
  const parseFormattedText = (text: string): React.ReactNode => {
    if (!text) return text;
    
    // Process all formats recursively with depth limit to prevent infinite recursion
    const processText = (input: string, keyPrefix: string = '', depth: number = 0): React.ReactNode => {
      if (!input) return input;
      
      // Prevent infinite recursion - max depth of 10
      if (depth > 10) {
        console.warn('Max recursion depth reached in parseFormattedText');
        return input;
      }
      
      // Parse font size span tags (<span style="font-size: XXpx;">text</span>) FIRST
      // Check for font-size spans - must be checked first before other formatting
      if (input.includes('font-size')) {
        // Match font-size spans - exact pattern we generate: <span style="font-size: XXpx;">text</span>
        // Try the exact pattern first (most common)
        const exactRegex = /<span style="font-size:\s*([^"]+);">([\s\S]*?)<\/span>/g;
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let keyIndex = 0;
        
        // Find all matches - try exact pattern first
        const allMatches: Array<{index: number, fullMatch: string, fontSize: string, content: string}> = [];
        let tempMatch;
        
        exactRegex.lastIndex = 0;
        while ((tempMatch = exactRegex.exec(input)) !== null) {
          allMatches.push({ 
            index: tempMatch.index, 
            fullMatch: tempMatch[0],
            fontSize: tempMatch[1].trim(),
            content: tempMatch[2]
          });
        }
        
        // If no matches with exact pattern, try flexible pattern
        if (allMatches.length === 0) {
          const flexibleRegex = /<span\s+style\s*=\s*["']font-size:\s*([^"';]+)["'];?\s*["']?\s*>([\s\S]*?)<\/span>/gi;
          flexibleRegex.lastIndex = 0;
          while ((tempMatch = flexibleRegex.exec(input)) !== null) {
            allMatches.push({ 
              index: tempMatch.index, 
              fullMatch: tempMatch[0],
              fontSize: tempMatch[1].trim(),
              content: tempMatch[2]
            });
          }
        }
        
        // Process each match
        for (const match of allMatches) {
          // Add text before this span
          if (match.index > lastIndex) {
            const beforeText = input.substring(lastIndex, match.index);
            if (beforeText.trim()) {
              parts.push(processText(beforeText, `${keyPrefix}-before-${keyIndex}`, depth + 1));
            }
          }
          
          // Extract and normalize font size
          let fontSize = match.fontSize;
          // Ensure it has 'px' if it's just a number
          if (fontSize && !fontSize.includes('px') && !fontSize.includes('em') && !fontSize.includes('%') && !isNaN(Number(fontSize))) {
            fontSize = fontSize + 'px';
          }
          
          // Create the styled span
          parts.push(
            <span key={`${keyPrefix}-font-${keyIndex}`} style={{ fontSize }}>
              {processText(match.content, `${keyPrefix}-font-${keyIndex}`, depth + 1)}
            </span>
          );
          
          // Update lastIndex to after this match
          lastIndex = match.index + match.fullMatch.length;
          keyIndex++;
        }
        
        // Add remaining text after all spans
        if (lastIndex < input.length) {
          const afterText = input.substring(lastIndex);
          if (afterText.trim()) {
            parts.push(processText(afterText, `${keyPrefix}-after-${keyIndex}`, depth + 1));
          }
        }
        
        // Return parsed parts if we found any matches
        if (parts.length > 0) {
          return parts;
        }
      }
      
      // Parse bold (**text**) - most important after font size
      if (input.includes('**')) {
        const parts = input.split('**');
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            // This is bold text
            return <strong key={`${keyPrefix}-bold-${index}`} className="font-bold text-white">{processText(part, `${keyPrefix}-bold-${index}`, depth + 1)}</strong>;
          } else {
            // Regular text - continue processing
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // Parse strikethrough (~~text~~)
      if (input.includes('~~')) {
        const parts = input.split('~~');
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <del key={`${keyPrefix}-del-${index}`} className="line-through">{processText(part, `${keyPrefix}-del-${index}`, depth + 1)}</del>;
          } else {
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // Parse inline code (`text`)
      if (input.includes('`')) {
        const parts = input.split('`');
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <code key={`${keyPrefix}-code-${index}`} className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{part}</code>;
          } else {
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // Parse underline (<u>text</u>)
      if (input.includes('<u>')) {
        const parts = input.split(/<u>(.*?)<\/u>/);
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <u key={`${keyPrefix}-u-${index}`}>{processText(part, `${keyPrefix}-u-${index}`, depth + 1)}</u>;
          } else {
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // Parse italic (*text*) - but not **text** (already handled)
      if (input.includes('*')) {
        const parts = input.split(/(?<!\*)\*(?!\*)/);
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <em key={`${keyPrefix}-em-${index}`}>{part}</em>;
          } else {
            return part;
          }
        });
      }
      
      // Parse subscript (<sub>text</sub>)
      if (input.includes('<sub>')) {
        const parts = input.split(/<sub>(.*?)<\/sub>/);
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <sub key={`${keyPrefix}-sub-${index}`}>{part}</sub>;
          } else {
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // Parse superscript (<sup>text</sup>)
      if (input.includes('<sup>')) {
        const parts = input.split(/<sup>(.*?)<\/sup>/);
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            return <sup key={`${keyPrefix}-sup-${index}`}>{part}</sup>;
          } else {
            return processText(part, `${keyPrefix}-text-${index}`, depth + 1);
          }
        });
      }
      
      // No formatting found, return as is
      return input;
    };
    
    return processText(text, 'format', 0);
  };

  // Helper function to render text with font-size placeholder replacement
  const renderTextWithFontSizes = (text: string, placeholders: { [key: string]: { fontSize: string, content: string } }): React.ReactNode => {
    if (!text) return text;
    
    // Check if text contains any placeholders
    let hasPlaceholder = false;
    for (const placeholder of Object.keys(placeholders)) {
      if (text.includes(placeholder)) {
        hasPlaceholder = true;
        break;
      }
    }
    
    if (!hasPlaceholder) {
      // No placeholders, just parse normally
      return parseFormattedText(text);
    }
    
    // Find all placeholder positions in order
    const placeholderPositions: Array<{index: number, placeholder: string, data: { fontSize: string, content: string }}> = [];
    for (const [placeholder, data] of Object.entries(placeholders)) {
      let searchIndex = 0;
      while (true) {
        const index = text.indexOf(placeholder, searchIndex);
        if (index === -1) break;
        placeholderPositions.push({ index, placeholder, data });
        searchIndex = index + 1;
      }
    }
    
    // Sort by position
    placeholderPositions.sort((a, b) => a.index - b.index);
    
    // Build the result by replacing placeholders with styled spans
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    for (let i = 0; i < placeholderPositions.length; i++) {
      const { index, placeholder, data } = placeholderPositions[i];
      
      // Add text before this placeholder
      if (index > lastIndex) {
        const beforeText = text.substring(lastIndex, index);
        if (beforeText) {
          parts.push(parseFormattedText(beforeText));
        }
      }
      
      // Add the styled span
      let fontSize = data.fontSize;
      if (fontSize && !fontSize.includes('px') && !fontSize.includes('em') && !fontSize.includes('%') && !isNaN(Number(fontSize))) {
        fontSize = fontSize + 'px';
      }
      parts.push(
        <span key={`font-${i}`} style={{ fontSize }}>
          {parseFormattedText(data.content)}
        </span>
      );
      
      lastIndex = index + placeholder.length;
    }
    
    // Add any remaining text after all placeholders
    if (lastIndex < text.length) {
      const afterText = text.substring(lastIndex);
      if (afterText) {
        parts.push(parseFormattedText(afterText));
      }
    }
    
    return parts.length > 0 ? parts : parseFormattedText(text);
  };

  const formatContent = (content: string, images?: string[]) => {
    // Extract and replace font-size spans with placeholders (handles multi-line spans)
    let contentToProcess = content;
    const fontSizePlaceholders: { [key: string]: { fontSize: string, content: string } } = {};
    let placeholderIndex = 0;
    
    // Match all font-size spans (including multi-line) - use non-greedy to handle nested spans
    const fontSizeRegex = /<span style="font-size:\s*([^"]+);">([\s\S]*?)<\/span>/g;
    let match;
    const matches: Array<{index: number, full: string, fontSize: string, content: string}> = [];
    
    // Collect all matches first with their positions
    while ((match = fontSizeRegex.exec(content)) !== null) {
      matches.push({
        index: match.index,
        full: match[0],
        fontSize: match[1].trim(),
        content: match[2]
      });
    }
    
    // Replace matches with placeholders (in reverse order to preserve indices)
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const placeholder = `__FONTSIZE_${placeholderIndex}__`;
      fontSizePlaceholders[placeholder] = {
        fontSize: match.fontSize,
        content: match.content
      };
      // Replace at the exact position
      contentToProcess = contentToProcess.substring(0, match.index) + 
                         placeholder + 
                         contentToProcess.substring(match.index + match.full.length);
      placeholderIndex++;
    }
    
    // Now split into lines and process
    const contentLines = contentToProcess.split('\n');
    const imageArray = images || [];
    let imageIndex = 0;
    let paragraphCount = 0;
    const elements: React.ReactNode[] = [];
    
    // Calculate where to place images (distribute evenly)
    const totalParagraphs = contentLines.filter(line => 
      line.trim() !== '' && 
      !line.startsWith('## ') && 
      !line.startsWith('### ') && 
      !line.startsWith('- ') && 
      !line.match(/^\d+\.\s/)
    ).length;
    
    const imageSpacing = totalParagraphs > 0 && imageArray.length > 0 
      ? Math.max(2, Math.floor(totalParagraphs / (imageArray.length + 1)))
      : 3;
    
    // Group consecutive numbered list items together
    let i = 0;
    while (i < contentLines.length) {
      const line = contentLines[i];
      const lineIndex = i;
      const isParagraph = line.trim() !== '' && 
        !line.startsWith('## ') && 
        !line.startsWith('### ') && 
        !line.startsWith('- ') && 
        !line.match(/^\d+\.\s/);
      
      // Insert images at natural break points
      if (isParagraph) {
        paragraphCount++;
        
        // Insert first image after first paragraph
        if (paragraphCount === 1 && imageIndex < imageArray.length) {
          const imageUrl = imageArray[imageIndex];
          elements.push(
            <div key={`img-${imageIndex}`} className="my-10 rounded-2xl shadow-2xl border border-gray-700/50 bg-gray-900/50 flex items-center justify-center p-4">
              <img
                src={imageUrl}
                alt={`${selectedPost?.title || 'Blog'} - Image ${imageIndex + 1}`}
                className="w-full h-auto max-h-[800px] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => {
                  console.log('✅ Image loaded:', imageUrl);
                }}
              />
            </div>
          );
          imageIndex++;
        }
        // Insert additional images at calculated intervals
        else if (paragraphCount > 1 && paragraphCount % imageSpacing === 0 && imageIndex < imageArray.length) {
          const imageUrl = imageArray[imageIndex];
          elements.push(
            <div key={`img-${imageIndex}`} className="my-10 rounded-2xl shadow-2xl border border-gray-700/50 bg-gray-900/50 flex items-center justify-center p-4">
              <img
                src={imageUrl}
                alt={`${selectedPost?.title || 'Blog'} - Image ${imageIndex + 1}`}
                className="w-full h-auto max-h-[800px] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => {
                  console.log('✅ Image loaded:', imageUrl);
                }}
              />
            </div>
          );
          imageIndex++;
        }
      }
      
      // Format text content
      if (line.startsWith('## ')) {
        const headingText = line.replace('## ', '');
        elements.push(
          <h2 key={lineIndex} className="text-3xl font-bold text-white mt-10 mb-6">
            {parseBoldText(headingText)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const headingText = line.replace('### ', '');
        elements.push(
          <h3 key={lineIndex} className="text-2xl font-semibold text-white mt-8 mb-4">
            {parseBoldText(headingText)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        const listContent = line.replace('- ', '');
        elements.push(
          <li key={lineIndex} className="text-gray-300 mb-3 ml-6 list-disc">
            {renderTextWithFontSizes(listContent, fontSizePlaceholders)}
          </li>
        );
      } else if (line.match(/^\d+\.\s/)) {
        // Numbered list items - group consecutive items into <ol>
        const numberedListItems: React.ReactNode[] = [];
        let j = i;
        
        // Collect all consecutive numbered list items
        while (j < contentLines.length && contentLines[j].match(/^\d+\.\s/)) {
          const numberedLine = contentLines[j];
          const numberMatch = numberedLine.match(/^(\d+)\.\s/);
          const number = numberMatch ? parseInt(numberMatch[1], 10) : 1;
          const listContent = numberedLine.replace(/^\d+\.\s/, '');
          
          if (listContent.trim().endsWith(':')) {
            // It's a heading-style list item (e.g., "1. Forward Pass:")
            // Don't include in the list, break and render as heading
            break;
          } else {
            // Regular list item - use the actual number from markdown
            numberedListItems.push(
              <li key={j} value={number} className="text-gray-300 mb-2 pl-2" style={{ listStylePosition: 'outside' }}>
                {renderTextWithFontSizes(listContent, fontSizePlaceholders)}
              </li>
            );
          }
          j++;
        }
        
        // If we collected numbered items, wrap them in <ol>
        if (numberedListItems.length > 0) {
          // Wrap in <ol> with start=1 to ensure fresh numbering
          // Each <li> has value attribute set to the actual number from markdown
          elements.push(
            <ol key={`ol-${i}`} className="list-decimal ml-8 mb-6 space-y-3 pl-4" style={{ listStylePosition: 'outside' }}>
              {numberedListItems}
            </ol>
          );
          i = j - 1; // Skip the lines we just processed
        } else {
          // Single heading-style numbered item
          const listContent = line.replace(/^\d+\.\s/, '');
          elements.push(
            <h4 key={lineIndex} className="text-xl font-bold text-white mt-6 mb-3">
              {renderTextWithFontSizes(listContent, fontSizePlaceholders)}
            </h4>
          );
        }
      } else if (line.startsWith('> ')) {
        // Blockquote
        const quoteText = line.replace('> ', '');
        elements.push(
          <blockquote key={lineIndex} className="border-l-4 border-purple-500 pl-4 my-6 italic text-gray-400">
            {renderTextWithFontSizes(quoteText, fontSizePlaceholders)}
          </blockquote>
        );
      } else if (line.trim().startsWith('```')) {
        // Code block start/end - skip for now, handled separately if needed
        // This is a placeholder for code block handling
        elements.push(<br key={lineIndex} />);
      } else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        // Horizontal rule
        elements.push(<hr key={lineIndex} className="my-8 border-gray-700" />);
      } else if (line.trim() === '') {
        elements.push(<br key={lineIndex} />);
      } else {
        // Detect headings: lines that end with colon and are relatively short (likely headings)
        const trimmedLine = line.trim();
        const isLikelyHeading = trimmedLine.endsWith(':') && 
                                trimmedLine.length < 100 && 
                                trimmedLine.length > 0 &&
                                !trimmedLine.startsWith('http') &&
                                !trimmedLine.match(/^https?:\/\//) && // Avoid URLs
                                trimmedLine.split(' ').length < 15; // Not too many words
        
        // Also detect lines that are all caps or start with capital and are short (common heading patterns)
        const isShortStandalone = trimmedLine.length > 0 && 
                                  trimmedLine.length < 80 &&
                                  trimmedLine.split(' ').length < 10 &&
                                  /^[A-Z]/.test(trimmedLine) && // Starts with capital
                                  !trimmedLine.includes('.') && // Not a sentence
                                  !trimmedLine.includes('?') &&
                                  !trimmedLine.includes('!');
        
        if (isLikelyHeading) {
          // It's a heading (ends with colon, short)
          elements.push(
            <h4 key={lineIndex} className="text-xl font-bold text-white mt-6 mb-3">
              {parseBoldText(trimmedLine)}
            </h4>
          );
        } else if (isShortStandalone && lineIndex > 0) {
          // Check if previous line was empty (standalone heading)
          const prevLine = contentLines[lineIndex - 1]?.trim();
          const nextLine = contentLines[lineIndex + 1]?.trim();
          if ((prevLine === '' || prevLine === undefined) && nextLine !== '' && nextLine !== undefined) {
            // Standalone heading pattern
            elements.push(
              <h4 key={lineIndex} className="text-xl font-bold text-white mt-6 mb-3">
                {parseBoldText(trimmedLine)}
              </h4>
            );
          } else {
            // Regular paragraph with formatting
            elements.push(
              <p key={lineIndex} className="text-gray-300 mb-6 leading-relaxed text-lg">
                {renderTextWithFontSizes(line, fontSizePlaceholders)}
          </p>
        );
          }
      } else {
          // Regular paragraph with formatting
          elements.push(
            <p key={lineIndex} className="text-gray-300 mb-6 leading-relaxed text-lg">
              {renderTextWithFontSizes(line, fontSizePlaceholders)}
            </p>
          );
        }
      }
      
      i++; // Move to next line
    }
    
    // Add remaining images at the end if any
    while (imageIndex < imageArray.length) {
      const imageUrl = imageArray[imageIndex];
      elements.push(
        <div key={`img-${imageIndex}`} className="my-10 rounded-2xl shadow-2xl border border-gray-700/50 bg-gray-900/50 flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={`${selectedPost?.title || 'Blog'} - Image ${imageIndex + 1}`}
            className="w-full h-auto max-h-[800px] object-contain rounded-lg"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('✅ Image loaded:', imageUrl);
            }}
          />
        </div>
      );
      imageIndex++;
    }
    
    return elements;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            {/* Floating background elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -top-5 -right-10 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 relative z-10">
              AI Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 animate-pulse">Technology Blog</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stay updated with the latest trends, insights, and innovations in artificial intelligence and technology.
          </p>
          
          {/* Write New Post or Upload Document Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => {
                setIsWritingMode(!isWritingMode);
                setIsUploadMode(false);
              }}
              className="group relative bg-gradient-to-r from-white to-gray-100 text-black px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{isWritingMode ? 'Cancel Writing' : 'Write New Post'}</span>
              </span>
              <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>

            <span className="text-gray-500 text-lg">OR</span>

            <button
              onClick={() => {
                setIsUploadMode(!isUploadMode);
                setIsWritingMode(false);
                if (!isUploadMode && documentInputRef.current) {
                  documentInputRef.current.click();
                }
              }}
              className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Document</span>
              </span>
              <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
          
          {/* Hidden document input */}
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleDocumentUpload}
            className="hidden"
            id="document-upload-main"
          />
        </div>

        {/* Write New Post Form */}
        {isWritingMode && (
          <div className={`mb-16 transition-all duration-1000 transform ${
            animatedElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                {isEditing && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Title */}
                <div className="group">
                  <label className="block text-white text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog post title"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>

                {/* Excerpt */}
                <div className="group">
                  <label className="block text-white text-sm font-medium mb-2">Excerpt (Optional)</label>
                  <input
                    type="text"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>

                {/* Tags */}
                <div className="group">
                  <label className="block text-white text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-white hover:text-gray-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <button
                      onClick={handleAddTag}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="group">
                  <label className="block text-white text-sm font-medium mb-2">Images </label>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 cursor-pointer transition-all duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Click to upload images or drag and drop</span>
                    </label>
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group bg-gray-800 rounded-lg border border-gray-700 p-2">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-auto max-h-64 object-contain rounded-lg"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {uploadingImages && (
                      <div className="text-center py-2">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        <p className="text-gray-400 text-sm mt-2">Uploading images...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="group">
                  <label className="block text-white text-sm font-medium mb-2">Content</label>
                  
                  {/* Rich Text Toolbar - Professional Blogger Style */}
                  <div className="mb-2 bg-gray-800 border border-gray-700 rounded-t-lg">
                    {/* Main Toolbar Row */}
                    <div className="p-2 flex items-center gap-1 flex-wrap border-b border-gray-700">
                      {/* Text Formatting Section */}
                      <div className="flex items-center gap-1">
                        {/* Bold */}
                        <button
                          type="button"
                          onClick={formatBold}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Bold (Ctrl+B)"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                          </svg>
                        </button>
                        
                        {/* Italic */}
                        <button
                          type="button"
                          onClick={formatItalic}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Italic (Ctrl+I)"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
                          </svg>
                        </button>
                        
                        {/* Underline */}
                        <button
                          type="button"
                          onClick={formatUnderline}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Underline (Ctrl+U)"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18h18" />
                          </svg>
                        </button>
                        
                        {/* Strikethrough */}
                        <button
                          type="button"
                          onClick={formatStrikethrough}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Strikethrough"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px h-6 bg-gray-600 mx-1"></div>
                      
                      {/* Font Size Section - Word Style */}
                      <div className="flex items-center gap-1">
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                formatFontSize(e.target.value);
                                e.target.value = '16'; // Reset to default
                              }
                            }}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium cursor-pointer border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors duration-200 appearance-none pr-8 min-w-[60px] text-center"
                            title="Font Size"
                            defaultValue="16"
                          >
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                            <option value="24">24</option>
                            <option value="28">28</option>
                            <option value="30">30</option>
                            <option value="36">36</option>
                            <option value="48">48</option>
                            <option value="60">60</option>
                            <option value="72">72</option>
                            <option value="96">96</option>
                          </select>
                          <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px h-6 bg-gray-600 mx-1"></div>
                      
                      {/* Headings Section */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => formatHeading(1)}
                          className="px-2.5 py-1.5 hover:bg-gray-700 rounded transition-colors duration-200 text-gray-300 hover:text-white text-xs font-bold"
                          title="Heading 1"
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          onClick={() => formatHeading(2)}
                          className="px-2.5 py-1.5 hover:bg-gray-700 rounded transition-colors duration-200 text-gray-300 hover:text-white text-xs font-bold"
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => formatHeading(3)}
                          className="px-2.5 py-1.5 hover:bg-gray-700 rounded transition-colors duration-200 text-gray-300 hover:text-white text-xs font-bold"
                          title="Heading 3"
                        >
                          H3
                        </button>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px h-6 bg-gray-600 mx-1"></div>
                      
                      {/* Lists Section */}
                      <div className="flex items-center gap-1">
                        {/* Bullet List */}
                        <button
                          type="button"
                          onClick={() => formatList(false)}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Bullet List"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        
                        {/* Numbered List */}
                        <button
                          type="button"
                          onClick={() => formatList(true)}
                          className="p-2 hover:bg-gray-700 rounded transition-colors duration-200 group"
                          title="Numbered List"
                        >
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <textarea
                    ref={contentTextareaRef}
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your blog post content here... Use the toolbar above to format your text."
                    rows={15}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 border-t-0 rounded-b-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none font-mono text-sm"
                  />
                  
                  {/* Formatting Help Text */}
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Tip: Select text and click formatting buttons, or use Markdown syntax: **bold**, *italic*, # Heading
                  </p>
                </div>

                {/* Publish Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handlePublishPost}
                    disabled={!newPost.title || !newPost.content || savingPost}
                    className="group relative bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 group-hover:text-gray-800 transition-colors duration-300 flex items-center gap-2">
                      {savingPost ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                          <span>{isEditing ? 'Updating...' : 'Publishing...'}</span>
                        </>
                      ) : (
                        <span>{isEditing ? 'Update Post' : 'Publish Post'}</span>
                      )}
                    </span>
                    <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-4">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden ${
                animatedElements.includes(index + 1) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{
                transitionDelay: `${(index + 1) * 150}ms`
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 group-hover:animate-ping" style={{ animationDelay: '1s' }}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Featured Image */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-800/50 flex items-center justify-center min-h-[192px]">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-auto max-h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Title */}
                <h2 className="text-white text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500 line-clamp-2 leading-tight">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">AT</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{post.author}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">{post.readTime}</p>
                    </div>
                    
                    {/* Edit and Delete Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                        className="w-7 h-7 bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-sm text-blue-300 hover:text-blue-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/30"
                        title="Edit this post"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id);
                        }}
                        className="w-7 h-7 bg-red-600/20 hover:bg-red-600/40 backdrop-blur-sm text-red-300 hover:text-red-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30"
                        title="Delete this post"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <button 
                  onClick={() => handleReadMore(post)}
                  className="group/btn w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Read More</span>
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </article>
            ))}
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-700/50 relative shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 duration-300">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/3 to-teal-600/5 rounded-3xl pointer-events-none"></div>
            
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-50">
              <button
                onClick={() => {
                  console.log('Cross button clicked!');
                  setSelectedPost(null);
                }}
                className="w-12 h-12 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                aria-label="Close modal"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-10 relative z-10">
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {selectedPost.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-gray-400 mb-10 pb-8 border-b border-gray-700/50">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AT</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">By {selectedPost.author}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(selectedPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{selectedPost.readTime}</p>
                </div>
              </div>

              {/* Content with Inline Images */}
              <div className="prose prose-invert max-w-none text-lg leading-relaxed">
                {formatContent(selectedPost.content, selectedPost.images)}
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">AT</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Akeno Tech Team</p>
                      <p className="text-gray-400">AI Solutions & Technology Experts</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      console.log('Close Article button clicked!');
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseModal();
                    }}
                    className="group bg-gradient-to-r from-white to-gray-100 text-black px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-white/20 relative overflow-hidden"
                    aria-label="Close article"
                    type="button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                      Close Article
                    </span>
                    <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

