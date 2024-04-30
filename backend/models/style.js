import mongoose from 'mongoose'

const styleSchema = new mongoose.Schema({
    site: String,
    name: String,
    font: String,
    fontWeight: String,
    fontStyle: String,
    fontSize: String,

    useHeaderFont: Boolean,
    headerFont: String,
    headerUppercase: Boolean,
    headerFontWeight: String,
    headerFontItalic: Boolean,
    headerFontSize: String,
    headerFontColor: String,

    accentColor: String,
    accentColor2: String,
    backgroundColor: String,
    textColor: String,

    animation: Boolean,
    duration: String,

    linkUnderline: Boolean,
    linkUnderlineHover: Boolean,
    linkWeight: String,
    linkHoverWeight: String,
    linkHoverColor: Boolean,
    linkHoverColorColor: String,

    roundedCorners: Boolean,
    roundedCornersAmount: String,
    shadows: Boolean,

    buttonUppercase: Boolean,
    buttonFontWeight: String,
    buttonHoverColor: Boolean,
    buttonHoverBackgroundColor: String,
    buttonHoverFontColorColor: String,
    buttonHoverFontColor: Boolean,
    buttonHoverGrow: Boolean,
    buttonRoundedCorners: Boolean,

    backgroundGradient: Boolean,
    backgroundGradientColor: String,
    backgroundGradientDirection: String,
    backgroundGradientSize: String,

    blogSidebar: Boolean,
    articleSidebar: Boolean,
    blogSidebarPosition: String,
    articleSidebarPosition: String,
    blogSidebarWidth: String,
    articleSidebarWidth: String,
    blogSidebarSticky: Boolean,
    articleSidebarSticky: Boolean,
    blogSidebarBackgroundColor: String,
    articleSidebarBackgroundColor: String,
    blogSidebarFontColor: String,
    articleSidebarFontColor: String,

    blogPostWidth: String,
    articlePostWidth: String,

    coloredHeadings: Boolean,

    blogPostScrollToTop: Boolean,
    blogPostAuthorPosition: String,

    articleScrollToTop: Boolean,
    readingProgress: Boolean,
    articleAuthorPosition: String,

    authorAvatar: Boolean,
    authorName: Boolean,
    authorShortBio: Boolean,
    authorLongBio: Boolean,
    authorBioLayout: String,
    authorAvatarRound: Boolean,
    authorAvatarBorder: Boolean,
    authorAvatarBorderWidth: String,

    readingProgressHeight: String,

    blogPostCommentsPosition: String,
    blogPostTagsPosition: String,
    blogPostCategoriesPosition: String,
    blogPostSharePosition: String,
    blogPostShareButtons: Boolean,

    headerHeight: String,
    headerBorder: Boolean,
    headerBorderWidth: String,
    headerColor: String,
    headerOnArticles: Boolean,

    footerBackgroundColor: String,
    footerBorder: Boolean,
    footerBorderColor: String,
    footerBorderWidth: String,

    absoluteFooter: Boolean,
    absoluteFooterSticky: Boolean,
    absoluteFooterLayout: String,

    compiledCss: String,
})

const compileCss = (style) => {
        let body = `body {
        font-family: ${style.font};
        font-weight: ${style.fontWeight};
        font-style: ${style.fontStyle};
        font-size: ${style.fontSize};
        background-color: ${style.backgroundColor};
        color: ${style.textColor};
        `
        if (style.backgroundGradient) {
            body += `background: linear-gradient(${style.backgroundGradientDirection}, ${style.backgroundGradientColor} 0%, ${style.backgroundColor}, ${style.backgroundGradientSize});`
        }
        if (style.animation) {
            css += `transition: all ${style.duration};`
        } else {
            css += `transition: none;`
        }
        if (style.roundedCorners) {
            css += `border-radius: ${style.roundedCornersAmount};`
        } else {
            css += `border-radius: 0;`
        }
        css += `}`
        let button = `button {
        background-color: ${style.accentColor};
        color: ${style.textColor};
        
        text-transform: ${style.buttonUppercase ? 'uppercase' : 'none'};
        font-weight: ${style.buttonFontWeight};
        `
        if (style.buttonRoundedCorners) {
            button += `border-radius: ${style.roundedCornersAmount};`
        }
        button += `}`

        let buttonHover = `button:hover {
        `
        if (style.buttonHoverColor) {
            buttonHover += `background-color: ${style.buttonHoverBackgroundColor};`
        }
        if (style.buttonHoverFontColor) {
            buttonHover += `color: ${style.buttonHoverFontColorColor};`
        }
        if (style.buttonHoverGrow) {
            buttonHover += `transform: scale(1.1);`
        }
        buttonHover += `}`

        let link = `a {
        text-decoration: ${style.linkUnderline ? 'underline' : 'none'};
        font-weight: ${style.linkWeight};
        color: ${style.accentColor};
        `
        link += `}`

        let linkHover = `a:hover {
            `
        if (style.linkUnderlineHover) {
            linkHover += `text-decoration: underline;`
        }
        if (style.linkHoverWeight) {
            linkHover += `font-weight: ${style.linkHoverWeight};`
        }
        if (style.linkHoverColor) {
            linkHover += `color: ${style.linkHoverColorColor};`
        }

        linkHover += `}`

        let absoluteFooter = `#absolute-footer {
                width: 100vw;
                overflow: hidden;`
        if (style.absoluteFooterSticky) {
            absoluteFooter += `position: fixed;`
        } else {
            absoluteFooter += `position: absolute;`
            absoluteFooter += `bottom: 0;`
        }
        if (!style.absoluteFooter) {
            absoluteFooter += `display: none;`
        } else {
            absoluteFooter += `display: block;`
        }
        absoluteFooter += `}`

        let blogScrollToTop = `#blog-scroll-to-top {`
        if (style.blogPostScrollToTop) {
            blogScrollToTop += `display: block;`
            blogScrollToTop += `position: fixed;`
            blogScrollToTop += `bottom: 20px;`
            blogScrollToTop += `right: 20px;`
            blogScrollToTop += `z-index: 1000;`
        } else {
            blogScrollToTop += `display: none;`
        }
        blogScrollToTop += `}`

        let articleScrollToTop = `#article-scroll-to-top {`
        if (style.articleScrollToTop) {
            articleScrollToTop += `display: block;`
            articleScrollToTop += `position: fixed;`
            articleScrollToTop += `bottom: 20px;`
            articleScrollToTop += `right: 20px;`
            articleScrollToTop += `z-index: 1000;`
        } else {
            articleScrollToTop += `display: none;`
        }
        articleScrollToTop += `}`

        let readingProgress = `#reading-progress {`
        if (style.readingProgress) {
            readingProgress += `display: block;`
            readingProgress += `position: fixed;`
            readingProgress += `top: 0;`
            readingProgress += `left: 0;`
            readingProgress += `width: 100%;`
            readingProgress += `height: ${style.readingProgressHeight};`
            readingProgress += `z-index: 1000;`

        }

        readingProgress += `}`

        let header = `header {
                background-color: ${style.headerColor};
                color: ${style.textColor};
                `
        if (style.headerBorder) {
            header += `border-bottom: ${style.headerBorderWidth} solid ${style.headerBorderColor};`
        }

        header += `}`

        let footer = `footer {
                    background-color: ${style.footerBackgroundColor};
                    color: ${style.textColor};
                    `
        if (style.footerBorder) {
            footer += `border-top: ${style.footerBorderWidth} solid ${style.footerBorderColor};`
        }
        footer += `}`

        let blogSidebar = `.blog-sidebar {
                        background-color: ${style.blogSidebarBackgroundColor};
                        color: ${style.blogSidebarFontColor};
                        `
        if (style.blogSidebarSticky) {
            sidebar += `position: sticky;`
        }
        if (!style.blogSidebar) {
            sidebar += `display: none;`
        }
        sidebar += `}`

        let articleSidebar = `.article-sidebar {
                            background-color: ${style.articleSidebarBackgroundColor};
                            color: ${style.articleSidebarFontColor};
                            `
        if (style.articleSidebarSticky) {
            sidebar += `position: sticky;`
        }
        if (!style.articleSidebar) {
            sidebar += `display: none;`
        }
        sidebar += `}`

        let authorName = `.author-name {
                                `
        if (style.authorName) {
            authorName += `display: block;`
        } else {
            authorName += `display: none;`
        }
        authorName += `}`

        let authorShortBio = `.author-short-bio {
                                    `
        if (style.authorShortBio) {
            authorShortBio += `display: block;`
        } else {
            authorShortBio += `display: none;`
        }
        authorShortBio += `}`

        let authorLongBio = `.author-long-bio {
                                        `
        if (style.authorLongBio) {
            authorLongBio += `display: block;`
        } else {
            authorLongBio += `display: none;`
        }
        authorLongBio += `}`

        let authorAvatar = `.author-avatar {`
            if (style.authorAvatarRound) {
                authorAvatar += `border-radius: 100%;`}
            if (style.authorAvatarBorder) {
                authorAvatar += `border: ${style.authorAvatarBorderWidth} solid ${style.accentColor};`
            }
            if (!style.authorAvatar) {
                authorAvatar += `display: none;`
            }
            authorAvatar += `}`
        let css = body + button + buttonHover + link + linkHover + absoluteFooter + blogScrollToTop + articleScrollToTop + readingProgress + header + footer + blogSidebar + articleSidebar + authorName + authorShortBio + authorLongBio + authorAvatar

        css = css.replace(/\n/g, '')
        css = css.replace(/\s\s+/g, ' ')
        css = css.replace(/;/g, '!important;')

        return css

}

styleSchema.pre('save', function(next) {
    if (this.compiledCss.length === 0) {
        this.compiledCss = compileCss(this)
    }
    next()
})