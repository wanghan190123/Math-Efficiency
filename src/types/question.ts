export type QuestionType = 'choice' | 'fill' | 'answer'

export interface Question {
  id: string
  year: number
  number: number
  type: QuestionType
  chapter: string
  knowledgePoints: string[]
  formulas: string[]
  methods: string[]
  content: string
  options?: string[]
  answer: string
  analysis: string
  difficulty?: 1 | 2 | 3 | 4 | 5
}

export interface QuestionSet {
  id: string
  name: string
  year: number
  source?: string
  questions: Question[]
}

export interface QuestionFilter {
  year?: number
  chapter?: string
  knowledgePoint?: string
  formula?: string
  method?: string
  type?: QuestionType
  searchText?: string
}

export interface QuestionIndex {
  years: number[]
  chapters: string[]
  knowledgePoints: string[]
  formulas: string[]
  methods: string[]
}
