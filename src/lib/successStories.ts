export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  city: string;
  title: string;
  summary: string;
  paragraphs: string[];
  image: string;
  tag: string;
}

export const successStories: SuccessStory[] = [
  {
    id: 'maja',
    name: 'Maja',
    age: 14,
    city: 'Kraków',
    title: 'From silent corners to speaking up',
    summary: 'After moving schools mid-year, Maja barely spoke in class. A public speaking workshop changed that.',
    paragraphs: [
      "When Maja's family moved to Kraków, she started a new school in the middle of the year. The classrooms were full, the friendships were already formed, and for months she said almost nothing during lessons.",
      'Through the Foundation she joined a small speaking workshop run by a volunteer psychologist. The first exercises were tiny: introducing herself to a group of four, then reading a poem aloud. Each week the group got a little bigger and the tasks a little braver.',
      'Today Maja presents her own short talks at school and volunteers as a peer guide for new students. "I used to think my voice did not matter," she says. "Now I know it does, and I want other kids to feel that too."',
    ],
    image: 'https://images.pexels.com/photos/8926555/pexels-photo-8926555.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Confidence',
  },
  {
    id: 'kuba',
    name: 'Kuba',
    age: 16,
    city: 'Zamość',
    title: 'The laptop that changed his plans',
    summary: 'Kuba wanted to build games but had no computer at home. A mentor and a donated laptop opened the door.',
    paragraphs: [
      'Kuba had spent years sketching game levels on scrap paper. At home there was no computer that could run a programming environment, so the ideas stayed on paper.',
      'A business partner donated a refurbished laptop through the Foundation, and Kuba was matched with a software mentor who met him every Thursday online. Together they built a small maze game, then a simple platformer with sound effects he composed himself.',
      'Kuba now plans to study computer science and has started teaching the basics of coding to younger students in his neighbourhood. "The laptop was the easy part," he says. "Having someone who believed I could finish a project was the real gift."',
    ],
    image: 'https://images.pexels.com/photos/5905519/pexels-photo-5905519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Technology',
  },
  {
    id: 'zosia',
    name: 'Zosia',
    age: 11,
    city: 'Wrocław',
    title: 'Reading her first chapter book',
    summary: 'Zosia had fallen two grade levels behind in reading. Weekly tutoring turned books into her favourite place.',
    paragraphs: [
      'By the end of third grade, Zosia avoided reading aloud. Letters blurred on the page, and she had quietly decided that books were not for her.',
      'Her volunteer tutor, a retired teacher, started with picture books and short comics. Sessions were built around Zosia\'s interests, which were animals and the ocean. After three months she read her first chapter book from start to finish.',
      'Zosia now reads every night and runs a "book of the week" corner in her classroom. "I thought reading was homework," she says. "Now it is my favourite adventure."',
    ],
    image: 'https://images.pexels.com/photos/8363091/pexels-photo-8363091.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Education',
  },
  {
    id: 'oskar',
    name: 'Oskar',
    age: 15,
    city: 'Lublin',
    title: 'Two hours a week, a clear direction',
    summary: 'Oskar drifted through his first year of high school. A weekly career workshop gave him a goal to work toward.',
    paragraphs: [
      'Oskar was bright but unfocused. He skipped classes when he felt bored and had no idea what he wanted to do after school.',
      'The Foundation paired him with a group of volunteers from a local engineering firm. Every week they ran a two-hour workshop where students tackled a real problem, such as designing a rain-water collector for the school garden.',
      'Oskar led his team\'s final presentation and was offered a summer placement at the firm. He now attends every class and is preparing for a technical high school entrance exam. "For the first time I know why I am learning," he says.',
    ],
    image: 'https://images.pexels.com/photos/8499604/pexels-photo-8499604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Career',
  },
  {
    id: 'lena',
    name: 'Lena',
    age: 17,
    city: 'Gdańsk',
    title: 'A mentor who believed first',
    summary: 'Lena did not think university was for someone like her. A mentor helped her see what was already possible.',
    paragraphs: [
      'Lena grew up in a home where nobody had finished higher education. When her teachers mentioned university, she assumed it was meant for other people.',
      'A volunteer mentor from the Foundation, who had also been the first in her family to study, met Lena once a month for a year. They worked on applications, scholarship forms, and the uncomfortable task of writing about herself.',
      'Lena was accepted to a university in Gdańsk with a partial scholarship. She now mentors first-year students in the same program. "My mentor did not give me the answers," she says. "She showed me I already had them."',
    ],
    image: 'https://images.pexels.com/photos/4143799/pexels-photo-4143799.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Mentorship',
  },
  {
    id: 'amira',
    name: 'Amira',
    age: 10,
    city: 'Warsaw',
    title: 'Maths without the fear',
    summary: 'Amira froze at every test. Playful maths sessions taught her that mistakes are part of learning.',
    paragraphs: [
      'Amira had decided she was "bad at maths" before she turned ten. Every test brought tears, and she avoided the board in class.',
      'Her tutor from the Foundation\'s maths club replaced worksheets with games: shop-keeping with play money, puzzles, and team challenges where a wrong answer simply became a clue for the next try.',
      'Amira now joins the club\'s weekend competitions and encourages classmates who are struggling. "I used to hide when I got something wrong," she says. "Now I just ask, what can I try next?"',
    ],
    image: 'https://images.pexels.com/photos/11273201/pexels-photo-11273201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tag: 'Mathematics',
  },
];
