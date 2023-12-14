import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req) {
    const cookie = req.cookies.get('user')?.value
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = url.pathname

    if (!cookie && page != '/Login') {
        console.log('NO cookie')
        return NextResponse.redirect(new URL('/Login', req.url))
    } else {
        if (cookie && page == '/Login') {
            return NextResponse.redirect(new URL('/Feed', req.url))
        } else {
            const regex = /^[A-Z][a-z]+$/
            if (page != '/' && !regex.test(page.slice(1))) {
                const formatted = "/" + page.charAt(1).toUpperCase() + page.slice(2).toLowerCase();

                console.log(`http://${url.host + formatted}`, formatted)
                return NextResponse.redirect(
                    new URL(`http://${url.host + formatted}`, req.url)
                )
            } else {
                return NextResponse.next()
            }
        }

    }

    /*return await fetch(`${process.env.API_URL}/user/verifyToken`, {
          method: 'GET',
          headers: { cookie: token }
      }).then(response => response.json())
          .then(data => {
              decoded = JSON.parse(data.payload);
  
              if (decoded.role != 'admin' && AdminPage(req.url)) {
                  return NextResponse.redirect(new URL('/notfound', req.url))
              } else {
                  return NextResponse.next();
              }
  
          }).catch(error => console.error(error)) */
}

export const config = {
    matcher: [
        '/index/:path*',
        '/Home/:path*',
        '/home/:path*',
        '/Login/:path*',
        '/login/:path*',
        '/Editarusuario/:path*',
        
        
        '/profile/:path*',
        '/Profile/:path*',
        '/feed/:path*',
        '/Feed/:path*',
        '/friends/:path*',
        '/Friends/:path*',
        
      
    ]
}
