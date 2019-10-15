import { ResponseDoc, UserDoc, QuestionDoc } from '../src-server/models';

const userToResponses: any = {
  'lihsing-lung': [
    {
      id: 'question-0',
      question: 'What is your preferred method of documenting code?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      videoUrl: '',
      tag: 'technical',
    },
    {
      id: 'question-1',
      question: 'How often do you read about new technologies and paradigms?',
      description:
        'What are some specific technologies you’ve read about and how production-ready do you think they are?',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/interview-new-tech.mp4',
      tag: 'technical',
    },
    {
      id: 'question-2',
      question: 'How do you like to handle technical debt?',
      description: 'How do you keep yourself productive?',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/interview-productivity.mp4',
      tag: 'coordination',
    },
    {
      id: 'question-3',
      question: 'What is your preferred method of documenting code?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/commenting_code.mp4',
      tag: 'coordination',
    },
  ],
  'michael-duplessis': [],
  'tito-mbagwu': [
    {
      id: 'question-1',
      question: 'What is your favorite programming language?',
      description: 'Pick your favorite language, explain why you love it!',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/fav_programming_lang.mp4',
      tag: 'coordination',
    },
    {
      id: 'question-2',
      question: 'How important is consistent code style to you?',
      description:
        'Would you invest in linting tools? Would you block code merges because of style issues?',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/linting.mp4',
      tag: 'coordination',
    },
    {
      id: 'question-3',
      question:
        "Take some time to read up on Kotlin's built in nullabilty operators, !! and ?.",
      description: 'When should you use !! and ?. Always? Never?',
      videoUrl:
        'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/kotlin_nul lability.mp4',
      tag: 'technical',
    },
  ],
  coverstory: [],
};

const userToDoc: any = {
  'lihsing-lung': {
    username: 'Li-Hsing Lung',
    photo:
      'https://media.licdn.com/dms/image/C4E03AQFZuKnltRJvLw/profile-displayphoto-shrink_200_200/0?e=1575504000&v=beta&t=emev1QeLoHJMtRaJAijqS1VKIhcBC0QlUptC0Ks6psM',
    summary: `Hey, my name is Li-Hsing Lung. I love building products and doing impactful work.
      
      Below are some of my views on team culture and how I've found myself to be most productive on a team. I hope we're a good match for working together!`,
  },
  'michael-duplessis': {
    username: 'Michael Duplessis',
    photo: '',
    summary: '',
  },
  'tito-mbagwu': {
    username: 'Tito Mbagwu',
    photo: '',
    summary: '',
  },
  coverstory: {
    username: 'CoverStory',
    photo: '',
    summary: '',
  },
};

export function getUserResponses(user: string): ResponseDoc[] {
  return userToResponses[user];
}

export function getUserDoc(user: string): UserDoc {
  return userToDoc[user];
}

export function getQuestions(): QuestionDoc[] {
  return [
    {
      id: 'question-1',
      question:
        'Would you rather have not enough meetings or too much meetings?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'coordination',
    },
    {
      id: 'question-2',
      question: 'What makes a good manager?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'coordination',
    },
    {
      id: 'question-3',
      question: 'How often do you read about new tech?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'technical',
    },
    {
      id: 'question-4',
      question: 'What’s your favorite programming language and why?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'technical',
    },
    {
      id: 'question-5',
      question: 'What value does a PM/TPM add?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'process',
    },
    {
      id: 'question-6',
      question: 'What is your preferred method of documenting code?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'process',
    },
    {
      id: 'question-7',
      question: 'What amount of positive reinforcement is best for you?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'motivation',
    },
    {
      id: 'question-8',
      question:
        'How often would you like to hang out with coworkers after hours?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'motivation',
    },
    {
      id: 'question-9',
      question: 'Tell me about your favorite movie or book',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'fun',
    },

    {
      id: 'question-10',
      question: 'What do you think about elon musk?',
      description:
        'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
      tag: 'fun',
    },
  ];
}
