import { QuestionDoc } from '../src-server/models';

export function getQuestions(): QuestionDoc[] {
  return [
    {
      id: 1,
      title: 'How often do you read about new technologies and paradigms?',
      description:
        'What are some specific technologies you’ve read about and how production-ready do you think they are?',
      tags: ['technical'],
    },
    {
      id: 2,
      title: 'How do you like to handle technical debt?',
      description: 'How do you keep yourself productive?',
      tags: ['technical'],
    },
    {
      id: 3,
      title: 'What is your favorite programming language?',
      description: 'Pick your favorite language, explain why you love it!',
      tags: ['technical'],
    },
    {
      id: 4,
      title: 'How important is consistent code style to you?',
      description:
        'Would you invest in linting tools? Would you block code merges because of style issues?',
      tags: ['coordination'],
    },
    {
      id: 5,
      title:
        "Take some time to read up on Kotlin's built in nullabilty operators, !! and ?.",
      description:
        'When should you use !! and ?. Give some interesting edge cases',
      tags: ['technical'],
    },
  ] as QuestionDoc[];
}
