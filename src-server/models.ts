export interface UserDoc {
  id: number;
  user_name: string;
  full_name: string;
  photo_link: string;
  summary: string;
}

export interface QuestionDoc {
  id: number;
  title: string;
  description: string;
  tags: string[];
  response_count: number;
  meta_count: number;
  up_vote: number;
  down_vote: number;
}
export interface CommentDoc {
  id: number;
  content: string;
  type: 'response' | 'meta';
  author_id: number;
  question_id: number;
  parent_id?: number;
  created_at: Date;
  up_vote: number;
  down_vote: number;
}
