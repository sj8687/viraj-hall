export function getUrl() {
  if (typeof window === 'undefined') {
    //for ssr url
    if(process.env.DOCKER == "true"){
      return process.env.DOCKER_BACKEND_URL;
    }else{
      return process.env.NEXT_PUBLIC_Backend_URL;
    }
  } else {
    // client url
    return process.env.NEXT_PUBLIC_Backend_URL;
  }
}