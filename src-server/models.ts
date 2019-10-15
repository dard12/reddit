export interface UserDoc {
  id: number;
}

export interface QuestionDoc {
  id: number;
  title: string;
  description: string;
  tags: string[];
}
