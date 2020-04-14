addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * 
 * @param {Request} request
 */

//HTMLRewriter for Site#1
const REWRITER1 = new HTMLRewriter()
.on('title', { element:  e => e.setInnerContent('Site #1')} )
.on('h1#title', { element:  e => e.setInnerContent('Hello World! (SITE #1)')} )
.on('p#description', { element:  e => e.setInnerContent('Stay home, stay safe during the COVID-19 pandemic')} )
.on('a#url', { element:  e => e.setInnerContent('Head over to my project GitHub repo')} )
.on('a', { element:  e => e.setAttribute('href','https://github.com/sanjay1999/cloudflare-project')} )

//HTMLRewriter for Site#2
const REWRITER2 = new HTMLRewriter()
.on('title', { element:  e => e.setInnerContent('Site #2')} )
.on('h1#title', { element:  e => e.setInnerContent('Hello World! (SITE #2)')} )
.on('p#description', { element:  e => e.setInnerContent('Stay home, stay safe during the COVID-19 pandemic')} )
.on('a#url', { element:  e => e.setInnerContent('Head over to my project GitHub repo')} )
.on('a', { element:  e => e.setAttribute('href','https://github.com/sanjay1999/cloudflare-project')} )

const NAME = 'project'
const url = 'http://cfw-takehome.developers.workers.dev/api/variants'

async function handleRequest(request) {

  var result
  var addrs = [ ]

  //Fetch URL and store in addrs array
  await fetch(url).then((resp) => resp.json()).then(function(data) {
    result = data['variants']
    // console.log(result)
    addrs.push(result[0])
    addrs.push(result[1])
  })


  //Fetch Variant1 and Variant2
  const TEST_RESPONSE = REWRITER1.transform(await fetch(addrs[0]))
  const CONTROL_RESPONSE = REWRITER2.transform(await fetch(addrs[1]))

  //Request distribution and cookie storage implementation
  const cookie = request.headers.get('cookie')
  if (cookie && cookie.includes(`${NAME}=control`)) {
    return CONTROL_RESPONSE
  } 
  else if (cookie && cookie.includes(`${NAME}=test`)) {
    return TEST_RESPONSE
  } 
  else {
    let group = Math.random() < 0.5 ? 'test' : 'control' 
    let response = group === 'control' ? CONTROL_RESPONSE : TEST_RESPONSE
    const init = {
      headers: { 'Set-Cookie': `${NAME}=${group}; path=/; max-age=31536000` },
    }
    return new Response(response.body,init)
  }
}
