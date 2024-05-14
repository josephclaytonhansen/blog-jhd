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

const createSitemap = async () => {
    const smStream = new SitemapStream({
        hostname: `https://${process.env.SITE_PREFIX}`,
    })

    const pipeline = smStream.pipe(createGzip())

    const staticRoutes = [
        '/',
        '/about',
        '/contact',
        '/home',
        '/login',
        '/me',
    ]
    staticRoutes.forEach((route) => {
        smStream.write({
            url: route,
            changefreq: 'monthly',
            priority: 0.7,
        })
    })

    const posts = await getPosts()
    const filteredPosts = filterPosts(posts)
    filteredPosts.forEach((post) => {
        smStream.write({
            url: `/p/${post.slug}`,
            changefreq: 'daily',
            priority: 0.7,
        })
    })

    smStream.end()

    return streamToPromise(pipeline)
}

const generateAndSaveSitemap = async () => {
    const sitemap = await createSitemap()
    sitemap.pipe(fs.createWriteStream(path.resolve('./public/sitemap.xml')))
}

generateAndSaveSitemap()