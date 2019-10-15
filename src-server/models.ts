export interface UserDoc {
  id: string;
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  facebook_id?: string;
  google_id?: string;
  photo?: string;
  summary?: string;
}

export interface ResponseDoc {
  id: string;
  question: string;
  description: string;
  videoUrl?: string;
  tag: string;
}

export interface QuestionDoc {
  id: string;
  question: string;
  description: string;
  tag: string;
}
