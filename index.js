const core = require('@actions/core')
const github = require('@actions/github')
const tgbot = require('node-telegram-bot-api')

// https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions
// https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md
// https://core.telegram.org/bots/api#sendmessage

async function sendMessage(token, to, message, format, disable_web_page_preview) {
  const bot = new tgbot(token, {})
  const options = {
    disable_web_page_preview,
  }
  if (format) {
    options.parse_mode = format
  }
  await bot.sendMessage(to, message, options)
}

async function run() {
  // core.debug() // if you set the secret `ACTIONS_RUNNER_DEBUG` to true

  try {
    const options = {
      token: core.getInput('token'),
      to: core.getInput('to'),
      message: core.getInput('message'),
      format: core.getInput('format'),
      disable_web_page_preview: core.getInput('disable_web_page_preview')
    }

    core.info(`github: ${JSON.stringify(github)}`)


    if (!options.message) {
      options.format = 'markdown'
      options.message = `
[${github.context.actor}](https://github.com/${github.context.actor}): *${github.context.eventName}* >> [${github.context.payload.repository.full_name}](${github.context.payload.repository.url})
commit: [${github.context.sha}](https://github.com/${github.repository}/commit/${github.context.sha})
\`\`\`
${github.context.payload.head_commit.message}
\`\`\`
actor: [${github.context.actor}](https://github.com/${github.context.actor})
pusher: [${github.context.payload.pusher.name} <${github.context.payload.pusher.email}>](https://github.com/${github.context.payload.pusher.name})
sender: [${github.context.payload.sender.login}](${github.context.payload.sender.html_url})
author: [${github.context.payload.head_commit.author.name} <${github.context.payload.head_commit.author.email}>](https://github.com/${github.context.payload.head_commit.author.username})
committer: [${github.context.payload.head_commit.committer.name} <${github.context.payload.head_commit.committer.email}>](https://github.com/${github.context.payload.head_commit.committer.username})
      `
    }

    const escapeMD = [
      // '_', '*','~', '[', ']', '(', ')', '`',
      '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']


    let format
    switch (options.format) {
      case 'markdown':
        format = 'MarkdownV2'

        escapeMD.forEach((ch) => {
          options.message = options.message.split(ch).join(`\\${ch}`)
        })

        // format = 'HTML'
        // options.message = marked(options.message)

        break
      case 'html':
        format = 'HTML'
        break
    }

    // options.message = encodeURIComponent(options.message)


    core.info(`Sending message: ${format}\n\n${options.message}\n\n\n`)

    await sendMessage(options.token, options.to, options.message, format, options.disable_web_page_preview)

    core.info(`Message successfully sent`)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
