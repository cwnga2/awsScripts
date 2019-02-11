const defaultSlackPath = '/services/xxxxxx/xxxxxx/xxxxx'
exports.handler = async (event) => {

  const {detail} = event;

  const {
    pipeline,
    stage,
    action,
    state
  } = detail
  const title = `[${state}] ${pipeline} ${stage} ${action}`

  const showGreen = (state === 'SUCCEEDED' || state === 'STARTED' ) ? true : false

  const text =  `
  state: ${state}
  `

  const attachment = {
    color: showGreen ? "good" : "danger",
    title: `${title}`,
    //   text: text
  }
  const attachments = [attachment]

  await sentToSlack({attachments})

  return ;
};

const https = require('https')

async function sentToSlack (
  { attachments },
  slackPath = defaultSlackPath
) {
  return new Promise(function(resolve, reject){
    const postData = JSON.stringify({
      attachments
    })

    const options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: slackPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, res => {
      res.setEncoding('utf8')
      res.on('data', chunk => {
        console.log(`BODY: ${chunk}`)
      })
      res.on('end', () => {
        console.log('No more data in response.')
        resolve()
      })
    })

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
      resolve()
    })

    req.write(postData)
    req.end()
  });
}
