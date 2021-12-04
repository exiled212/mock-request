export type Request = {
  id: number
  id_md5: string
  url: string
  method: string
  headers: {
    [n: string]: string
  }[]
}
