import {
    SitemapStream,
    streamToPromise,
} from 'sitemap'

import { createGzip } from 'zlib'
import fetch from 'node-fetch'
import 'fs'
import 'path'

import router from '../router.js'
const getPosts = async () => {
    const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`)
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
        hostname: process.env.SITE_PREFIX,
    })

    const pipeline = smStream.pipe(createGzip())

    router.getRoutes().forEach((route) => {
        if (route.path === '/sitemap.xml' || route.path === '/NotFound') return
        if (":" in route.path) return
        smStream.write({
            url: route.path,
            changefreq: 'daily',
            priority: 0.8,
        })
    })

    const posts = await filterPosts(await getPosts())
    posts.forEach((post) => {
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