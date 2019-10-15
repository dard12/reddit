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
