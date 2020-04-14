addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  
  const NAME = 'project'
  const url = 'http://cfw-takehome.developers.workers.dev/api/variants'
  var result
  var addr = [ ]
  await fetch(url).then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    // console.log(data)
    result = data['variants']
    // console.log(result)
    addr.push(result[0])
    addr.push(result[1])
    console.log(addr)
  })
  const TEST_RESPONSE = new Response('Hello worker1!', {
      headers: { 'content-type': 'text/plain' },
    })
  const CONTROL_RESPONSE = new Response('Hello worker2!', {
      headers: { 'content-type': 'text/plain' },
    })
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
    response.headers.append('Set-Cookie', `${NAME}=${group}; path=/`)
    return response
  }

  
}