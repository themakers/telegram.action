# Create a JavaScript Action

Fully functional example action:
```yaml
name: notify organization telegram
on: [push, pull_request, create, issues, issue_comment, watch]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: themakers/telegram-action@master
        with:
          token: ${{ secrets.TELEGRAM_TOKEN }} # your bot token
          to: ${{ secrets.TELEGRAM_TO }} # your room id
```

To obtain your telegram room ID you could use this command:
```bash
curl https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates | python -m json.tool
```

`TODO`

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>
