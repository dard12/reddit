import re

tagText = """
Technical
Misc
Fun
Team Coordination
Personal Motivation
Team Process
Culture
Behavioral
Algorithms
Programming
Interviewing
Tech Stack
Mentorship
Leadership
Work/Life Balance
Meetings
Goals
Outside Work
Management
System Design
"""
tagStrings = tagText.split('\n')
tags = []
for ts in tagStrings:
  if ts:
    tagId = re.sub('\W+', '', ts.replace(' ', '_').lower())
    tags.append((tagId, ts))


