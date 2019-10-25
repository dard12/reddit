export interface UserDoc {
  id: string;
  user_name: string;
  email: string;
  salt_password: string;
  full_name?: string;
  photo_link?: string;
  summary?: string;
  created_at: Date;
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
  up_vote: number;
  down_vote: number;
  created_at: Date;
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
  up_vote: number;
  down_vote: number;
}

export interface VoteDoc {
  id: string;
  user_id: string;
  action: 'up_vote' | 'down_vote';
  subject_id: string;
  subject_type: 'comments' | 'questions';
}
