export interface UserDoc {
  id: string;
  user_name: string;
  email: string;
  salt_password: string;
  full_name?: string;
  photo_link?: string;
  summary?: string;
  created_at: Date;
  updated_at: Date;
  reputation: number;
}

export interface QuestionDoc {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author_id: string;
  response_count: number;
  meta_count: number;
  up_votes: number;
  down_votes: number;
  last_comment_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CommentDoc {
  id: string;
  content: string;
  type: 'response' | 'meta';
  author_id: string;
  author_name: string;
  question_id: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
  up_votes: number;
  down_votes: number;
  is_edited: boolean;
  is_answer: boolean;
}

export interface CommentVoteDoc {
  id: string;
  user_id: string;
  vote_type: 'up_vote' | 'down_vote';
  comment_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface QuestionVoteDoc {
  id: string;
  user_id: string;
  vote_type: 'up_vote' | 'down_vote';
  question_id: string;
  created_at: Date;
  updated_at: Date;
}
