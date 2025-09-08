export type Category = {
  id: string
  name: string
}

export type Prompt = {
  id: string
  title: string
  content: string
  categoryId?: string | null
}

