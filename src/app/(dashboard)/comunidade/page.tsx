'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageCircle, Send, ImagePlus, Loader2 } from 'lucide-react'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import type { PostWithAuthor, CommentWithAuthor } from '@/types/database'

export default function ComunidadePage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState<Record<string, string>>({})
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, CommentWithAuthor[]>>({})
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      // Check which posts the user liked
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userLikes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)

        const likedPostIds = new Set(userLikes?.map((l) => l.post_id) || [])
        const postsWithLikeStatus = data.map((post) => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id),
        }))
        setPosts(postsWithLikeStatus as PostWithAuthor[])
      } else {
        setPosts(data as PostWithAuthor[])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const handlePost = async () => {
    if (!newPost.trim() || !userId) return
    setPosting(true)

    await supabase.from('posts').insert({
      author_id: userId,
      content: newPost.trim(),
    })

    setNewPost('')
    setPosting(false)
    fetchPosts()
  }

  const handleLike = async (postId: string) => {
    if (!userId) return

    const post = posts.find((p) => p.id === postId)
    if (!post) return

    if (post.user_has_liked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              user_has_liked: !p.user_has_liked,
              likes: [{ count: (p.likes[0]?.count || 0) + (p.user_has_liked ? -1 : 1) }],
            }
          : p
      )
    )
  }

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
      // Fetch comments
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (data) {
        setComments((prev) => ({ ...prev, [postId]: data as CommentWithAuthor[] }))
      }
    }
    setExpandedComments(newExpanded)
  }

  const handleComment = async (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim() || !userId) return

    await supabase.from('comments').insert({
      post_id: postId,
      author_id: userId,
      content: text.trim(),
    })

    setCommentText((prev) => ({ ...prev, [postId]: '' }))

    // Refresh comments
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (data) {
      setComments((prev) => ({ ...prev, [postId]: data as CommentWithAuthor[] }))
    }

    // Update comment count
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [{ count: (p.comments[0]?.count || 0) + 1 }] }
          : p
      )
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
        <p className="text-white/40">Compartilhe ideias e conecte-se com outros membros</p>
      </div>

      {/* Create Post */}
      <div className="card-glass p-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Compartilhe algo com a comunidade..."
          className="input-dark resize-none min-h-[100px] mb-4"
          id="create-post-input"
        />
        <div className="flex items-center justify-between">
          <button className="btn-ghost text-sm text-white/30" type="button">
            <ImagePlus className="w-5 h-5" />
          </button>
          <button
            onClick={handlePost}
            disabled={!newPost.trim() || posting}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            id="create-post-btn"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publicar
          </button>
        </div>
      </div>

      {/* Posts feed */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-glass p-6 animate-shimmer h-40 rounded-2xl" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card-glass p-6">
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-wine-gold flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(post.profiles?.full_name || null)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {post.profiles?.full_name || 'Membro'}
                  </p>
                  <p className="text-white/30 text-xs">{formatRelativeTime(post.created_at)}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-white/70 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  className="w-full rounded-xl mb-4 max-h-96 object-cover"
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    post.user_has_liked
                      ? 'text-wine-400'
                      : 'text-white/30 hover:text-wine-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
                  {post.likes[0]?.count || 0}
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments[0]?.count || 0}
                </button>
              </div>

              {/* Comments */}
              {expandedComments.has(post.id) && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full gradient-wine flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(comment.profiles?.full_name || null)}
                      </div>
                      <div className="flex-1 bg-white/[0.03] rounded-xl p-3">
                        <p className="text-white text-sm font-medium mb-1">
                          {comment.profiles?.full_name || 'Membro'}
                        </p>
                        <p className="text-white/50 text-sm">{comment.content}</p>
                        <p className="text-white/20 text-xs mt-1">
                          {formatRelativeTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Comment input */}
                  <div className="flex gap-3 mt-3">
                    <input
                      value={commentText[post.id] || ''}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleComment(post.id)
                        }
                      }}
                      placeholder="Escreva um comentário..."
                      className="input-dark text-sm flex-1"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="btn-primary p-2"
                      disabled={!commentText[post.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass p-12 text-center">
          <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg mb-2">Nenhum post ainda</p>
          <p className="text-white/20 text-sm">Seja o primeiro a compartilhar algo!</p>
        </div>
      )}
    </div>
  )
}
