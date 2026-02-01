import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Filter, BookOpen, Calendar, Users, GraduationCap, Stethoscope, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Post {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  category: string;
  location: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  comments?: Comment[];
  user_has_liked?: boolean;
}

interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface PostFeedProps {
  currentUserId: string;
  currentUserName: string;
  isReadOnly?: boolean;
}

const CATEGORIES = [
  { value: 'all', label: 'All Posts', icon: Filter },
  { value: 'education_math', label: 'Math Education', icon: GraduationCap },
  { value: 'education_english', label: 'English Education', icon: BookOpen },
  { value: 'education_polish', label: 'Polish Education', icon: BookOpen },
  { value: 'health', label: 'Health & Wellness', icon: Stethoscope },
  { value: 'events', label: 'Events', icon: Calendar },
  { value: 'community_service', label: 'Community Service', icon: Users }
];

const CATEGORY_COLORS: Record<string, string> = {
  education_math: 'bg-blue-100 text-blue-700 border-blue-300',
  education_english: 'bg-green-100 text-green-700 border-green-300',
  education_polish: 'bg-purple-100 text-purple-700 border-purple-300',
  health: 'bg-red-100 text-red-700 border-red-300',
  events: 'bg-orange-100 text-orange-700 border-orange-300',
  community_service: 'bg-teal-100 text-teal-700 border-teal-300'
};

export const PostFeed = ({ currentUserId, currentUserName, isReadOnly = false }: PostFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('education_math');
  const [newPostLocation, setNewPostLocation] = useState('Warsaw, Poland');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, locationFilter]);

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsData) {
      const postsWithComments = await Promise.all(
        postsData.map(async (post) => {
          const { data: comments } = await supabase
            .from('post_comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          const { data: userLike } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', currentUserId)
            .maybeSingle();

          return {
            ...post,
            comments: comments || [],
            user_has_liked: !!userLike
          };
        })
      );

      setPosts(postsWithComments);
    }
    setLoading(false);
  };

  const filterPosts = () => {
    let filtered = posts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (locationFilter) {
      filtered = filtered.filter(post =>
        post.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isReadOnly) return;

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        author_id: currentUserId,
        author_name: currentUserName,
        content: newPostContent,
        category: newPostCategory,
        location: newPostLocation,
        likes_count: 0,
        comments_count: 0
      }])
      .select()
      .single();

    if (data && !error) {
      setPosts([{ ...data, comments: [], user_has_liked: false }, ...posts]);
      setNewPostContent('');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (isReadOnly) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user_has_liked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUserId);

      await supabase
        .from('posts')
        .update({ likes_count: Math.max(0, post.likes_count - 1) })
        .eq('id', postId);

      setPosts(posts.map(p => p.id === postId
        ? { ...p, likes_count: Math.max(0, p.likes_count - 1), user_has_liked: false }
        : p
      ));
    } else {
      await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: currentUserId }]);

      await supabase
        .from('posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      setPosts(posts.map(p => p.id === postId
        ? { ...p, likes_count: p.likes_count + 1, user_has_liked: true }
        : p
      ));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (isReadOnly) return;
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    const { data, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        user_id: currentUserId,
        user_name: currentUserName,
        content: commentText
      }])
      .select()
      .single();

    if (data && !error) {
      await supabase
        .from('posts')
        .update({ comments_count: (posts.find(p => p.id === postId)?.comments_count || 0) + 1 })
        .eq('id', postId);

      setPosts(posts.map(p => p.id === postId
        ? {
            ...p,
            comments: [...(p.comments || []), data],
            comments_count: p.comments_count + 1
          }
        : p
      ));

      setCommentTexts({ ...commentTexts, [postId]: '' });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your volunteer experience or ask for help..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              >
                {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={newPostLocation}
                onChange={(e) => setNewPostLocation(e.target.value)}
                placeholder="Location"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedCategory === category.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold text-lg">
                    {post.author_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{post.author_name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.location} • {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                    </span>
                  </div>

                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center gap-6 py-3 border-t border-gray-200">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      disabled={isReadOnly}
                      className={`flex items-center gap-2 transition-colors ${
                        isReadOnly ? 'text-gray-400 cursor-not-allowed' :
                        post.user_has_liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes_count}</span>
                    </button>

                    <button
                      onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>
                  </div>

                  {showComments[post.id] && (
                    <div className="mt-4 space-y-3">
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-bold text-xs">
                              {comment.user_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm text-gray-900">{comment.user_name}</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}

                      {!isReadOnly && (
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={commentTexts[post.id] || ''}
                            onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
