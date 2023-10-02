import ffmpeg from 'fluent-ffmpeg'

type Params = {
  source: string
  timestamps: string[]
}

export function genImages({ source, timestamps }: Params) {
  for (const timestamp of timestamps) {
    const filename = timestamp.replace(/:/g, '-')

    ffmpeg()
      .input(source)
      .seekInput(timestamp)
      .frames(1)
      .videoFilters('scale=1024:-1')
      .output(`images/${filename}.jpg`)
      .on('end', () => {
        console.log(`Generated image for timestamp ${timestamp}`)
      })
      .run()
  }
}
