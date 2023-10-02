function getSeconds(timestamp: string) {
  const timeParts = timestamp.split(':')

  if (timeParts.length !== 3) {
    return 0
  }

  const [hours, minutes, seconds] = timeParts
  const hoursInt = parseInt(hours, 10)
  const minutesInt = parseInt(minutes, 10)
  const secondsInt = parseFloat(seconds)

  return hoursInt * 3600 + minutesInt * 60 + secondsInt
}

export function json(data: string) {
  const lines = data
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const cues = new Set()
  const ref = new (class VttRef {
    timestamp = '00:00:00.000'
    timestampSeen = false
    lastTextLine = ''
  })()

  for (const line of lines) {
    if (!ref.timestampSeen) {
      if (line.match(/^\d\d:\d\d/)) {
        ref.timestampSeen = true
      } else {
        continue
      }
    }

    if (line.match(/<\/c>$/)) {
      continue
    }

    const timestampMatch = line.match(
      /(\d\d:\d\d:\d\d\.\d\d\d) --> (\d\d:\d\d:\d\d\.\d\d\d).*$/
    )

    if (timestampMatch) {
      ref.timestamp = timestampMatch[1]
      continue
    }

    if (line === ref.lastTextLine) {
      continue
    }

    ref.lastTextLine = line

    cues.add({
      seconds: getSeconds(ref.timestamp),
      timestamp: ref.timestamp,
      text: line,
    })
  }

  return cues
}
