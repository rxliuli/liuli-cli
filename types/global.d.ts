import download from 'download-git-repo'

declare function download(
  repository: string,
  destination: string,
  callback: (err?: Error) => void,
): void

declare function download(
  repository: string,
  destination: string,
  options: {
    clone?: boolean
    proxy: any
    headers: any
    filter: any
  },
  callback: (err?: Error) => void,
): void
