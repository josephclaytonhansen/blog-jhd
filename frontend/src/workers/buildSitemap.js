import {
    SitemapStream,
    streamToPromise,
} from 'sitemap'
import { createGzip } from 'zlib'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const getPosts = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/blog/`)
    return response.json()
}

const filterPosts = (posts) => {
    let filteredPosts = posts.filter(post => post.published === true)
    let thisSite = process.env.SITE_PREFIX
    filteredPosts = posts.filter(post => post.site === thisSite)
    return filteredPosts
}

const createSitemap = async (smStream) => {
    const staticRoutes = [
        '/contact',
        '/home',
        '/login',
        '/me',
    ]
    staticRoutes.forEach((route) => {
        const url = `https://${process.env.SITE_PREFIX}${route}`
        console.log('Adding static route:', url)
        smStream.write({
            url,
            changefreq: 'monthly',
            priority: 0.7,
        })
    })

    const posts = await getPosts()
    const filteredPosts = filterPosts(posts)
    filteredPosts.forEach((post) => {
        const url = `https://${process.env.SITE_PREFIX}/p/${post.slug}`
        console.log('Adding post:', url)
        smStream.write({
            url,
            changefreq: 'daily',
            priority: 0.7,
        })
    })
}

const generateAndSaveSitemap = async () => {
    const smStream = new SitemapStream({ hostname: `https://${process.env.SITE_PREFIX}` })

    smStream.pipe(fs.createWriteStream(path.resolve('./public/sitemap.xml')))

    await createSitemap(smStream)
    smStream.end()

    console.log('Sitemap has been generated and saved.')
}

generateAndSaveSitemap()