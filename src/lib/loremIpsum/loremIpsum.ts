const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function buildSentence(): string {
  const length = randomInt(6, 14)
  const words = Array.from({ length }, () => WORDS[randomInt(0, WORDS.length - 1)])
  return capitalize(words.join(' ')) + '.'
}

function buildParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, buildSentence).join(' ')
}

export function generateLoremIpsum(
  count: number,
  unit: 'words' | 'sentences' | 'paragraphs',
  startWithLorem = true,
): string {
  if (count < 1) throw new Error('Count must be at least 1')

  if (unit === 'words') {
    const words = Array.from({ length: count }, () => WORDS[randomInt(0, WORDS.length - 1)])
    if (startWithLorem) {
      const prefix = ['lorem', 'ipsum'].slice(0, count)
      words.splice(0, prefix.length, ...prefix)
    }
    return capitalize(words.join(' ')) + '.'
  }

  if (unit === 'sentences') {
    const sentences = Array.from({ length: count }, buildSentence)
    if (startWithLorem) {
      sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
    return sentences.join(' ')
  }

  const paragraphs = Array.from({ length: count }, () => buildParagraph(randomInt(3, 6)))
  if (startWithLorem) {
    paragraphs[0] =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0]
  }
  return paragraphs.join('\n\n')
}
