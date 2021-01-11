const core = require('@actions/core')
const github = require('@actions/github')
const tgbot = require('node-telegram-bot-api')

// https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md
// https://core.telegram.org/bots/api#sendmessage

async function sendMessage(token, to, message, format) {
  const bot = new tgbot(token, {})
  const options = {}
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
      format: core.getInput('format')
    }

    core.info(`github: ${JSON.stringify(github)}`)

    let format
    switch (options.format) {
      case 'markdown':
        format = 'MarkdownV2'
        break
      case 'html':
        format = 'HTML'
        break
    }

    // options.message = encodeURIComponent(options.message)
    options.message = options.message.replaceAll(".", "\\.")

    await sendMessage(options.token, options.to, options.message, format)

    core.info(`Message successfully sent`)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
