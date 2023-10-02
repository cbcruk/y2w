import { exec as _exec } from 'child_process'
import { parse } from 'tinyargs'
import { promisify } from 'util'
import fg from 'fast-glob'
import { json as vtt2json } from './vtt'

const exec = promisify(_exec)

async function main() {
  const args = Bun.argv.slice(2)
  const options = [{ name: 'url', type: String }]
  const { url } = parse(args, options)

  if (!url || !url.match(/^https:\/\/www\.youtube\.com/)) {
    console.error('Usage:')
    console.error(
      'node script.ts project-name "https://www.youtube.com/watch?v=jNQXAC9IVRw"'
    )
    process.exit(1)
  }

  await exec(
    `yt-dlp --console-title  --write-auto-subs --write-subs --print filename --no-simulate --output "${process.env.PWD}/src/%(title)s-%(id)s.%(ext)s" ${url}`
  )

  const [vtt] = fg.globSync('./src/*.vtt')
  const input = Bun.file(vtt)
  const data = await input.text()
  const json = vtt2json(data)

  console.log(json)
}
main()
