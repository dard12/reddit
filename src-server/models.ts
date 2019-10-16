export interface UserDoc {
  id: number;
}

export interface QuestionDoc {
  id: number;
  title: string;
  description: string;
  tags: string[];
  response_count: number;
  meta_count: number;
  vote: number;
}

export interface CommentDoc {
  id: number;
  content: string;
  type: 'response' | 'meta';
  author_id: number;
  question_id: number;
  parent_id?: number;
  created_at: Date;
  vote: number;
}
