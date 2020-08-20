# slackbot-k

## usage

```bash
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=yyy
export SLACK_SIGNING_SECRET=zzz
export SLACK_BOT_TOKEN=aaa

docker run -it --rm \
  -v "$PWD":/var/task \
  -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  -e SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET} \
  -e SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN} \
  -w /var/task \
  lambci/lambda:build-nodejs12.x \
  /bin/bash -c " \
    npm install -g yarn && \
    yarn && yarn deploy:all"
```