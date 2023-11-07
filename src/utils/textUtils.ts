export const truncateLongWord = (word: string, maxLength: number) => {
  if (word.length < maxLength) return word
  return `${word.slice(0, maxLength)}...`
}

export const getProcessedCastContent = (text: string, embeds: []): string => {

  let processedContent = text

  processedContent = processedContent.replace(/\n/g, '<br/>');

  embeds.forEach((embed) => {
    processedContent = processedContent.replace(embed.url, '')
  })

  const mentionPattern = /@(\w+)(?:\.eth)?/g;

  const mentions = processedContent.match(mentionPattern);

  mentions?.forEach((mention) => {
    processedContent = processedContent.replace(mention, `<a href='/${mention.slice(1)}' class='truncate text-blue-500 hover:underline'>${mention}</a>`)
  })

  const urlPattern = /https?:\/\/\S+?(?=<br\/>)/g

  const urls = processedContent.match(urlPattern);

  urls?.forEach((url) => {
    processedContent = processedContent.replace(url, `<a href='${url}' target='_blank' class='truncate text-blue-500 hover:underline'>${truncateLongWord(url, 48)}</a>`)
  })

  const proceedingLinebreakPattern = /^(<br\/>)+/;
  const followingLinebreakPattern = /(<br\/> ?)+$/;

  processedContent = processedContent.replace(proceedingLinebreakPattern, "");
  processedContent = processedContent.replace(followingLinebreakPattern, "");

  return processedContent
}

export const truncateEthAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-3)}`
}


export const getTimeSinceTimestamp = (timestamp: number, short?: boolean): string => {
  // get difference in seconds between now and timestamp
  const dateTimestamp = new Date(timestamp);
  const now: Date = new Date();
  const seconds: number = Math.floor((now.getTime() - dateTimestamp.getTime()) / 1000);


  // years
  let interval = seconds / 31536000;
  if (Math.floor(interval) > 1) {
    if (short) {
      return Math.floor(interval) + "y";
    } else {
      Math.floor(interval) + " years ago";
    }
  }
  if (Math.floor(interval) == 1) {
    if (short) {
      return "1y";
    } else {
      return "a year ago";
    }
  }

  // months
  interval = seconds / 2592000;
  if (Math.floor(interval) > 1) {
    if (short) {
      return Math.floor(interval) + "m";
    } else {
      return Math.floor(interval) + " months ago";
    }
  }
  if (Math.floor(interval) == 1) {
    if (short) {
      return "1m";
    } else {
      return "a month ago";
    }
  }

  // days
  interval = seconds / 86400;
  if (Math.floor(interval) > 1) {
    if (short) {
      return Math.floor(interval) + "d";
    } else {
      return Math.floor(interval) + " days ago";
    }
  }
  if (Math.floor(interval) == 1) {
    if (short) {
      return "1d";
    } else {
      return "a day ago";
    }
  }

  // hours
  interval = seconds / 3600;
  if (Math.floor(interval) > 1) {
    if (short) {
      return Math.floor(interval) + "h";
    } else {
      return Math.floor(interval) + " hours ago";
    }
  }
  if (Math.floor(interval) == 1) {
    if (short) {
      return "1h";
    } else {
      return "an hour ago";
    }
  }

  // minutes
  interval = seconds / 60;
  if (Math.floor(interval) > 1) {
    if (short) {
      return Math.floor(interval) + "m";
    } else {
      return Math.floor(interval) + " minutes ago";
    }
  }
  if (Math.floor(interval) == 1) {
    if (short) {
      return "1m";
    } else {
      return "a minute ago";
    }
  }
  if (short) {
    return Math.floor(seconds) + "s";
  } else {
    return Math.floor(seconds) + " seconds ago";
  }
}
