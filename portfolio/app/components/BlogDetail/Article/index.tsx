import React from 'react';
import './css/Article.css';

interface BlogArticleProps {
    content: string;
}

const BlogArticle: React.FC<BlogArticleProps> = ({ content }) => {
    const processContent = (html: string) => {
        let h2Counter = 0;
        let h3Counter = 0;
        let h4Counter = 0;

        return html
            .replace(/<h2(.*?)>(.*?)<\/h2>/gi, (match, attrs, text) => {
                if (attrs.includes('id=')) return match;
                const id = `toc-h2-${++h2Counter}`;
                return `<h2${attrs} id="${id}" class="bd-article__h2">${text}</h2>`;
            })
            .replace(/<h3(.*?)>(.*?)<\/h3>/gi, (match, attrs, text) => {
                if (attrs.includes('id=')) return match;
                const id = `toc-h3-${++h3Counter}`;
                return `<h3${attrs} id="${id}" class="bd-article__h3">${text}</h3>`;
            })
            .replace(/<h4(.*?)>(.*?)<\/h4>/gi, (match, attrs, text) => {
                if (attrs.includes('id=')) return match;
                const id = `toc-h4-${++h4Counter}`;
                return `<h4${attrs} id="${id}" class="bd-article__h4">${text}</h4>`;
            })
            .replace(/<blockquote>(.*?)<\/blockquote>/gi, (match, text) => {
                return `<blockquote class="bd-blockquote">${text}</blockquote>`;
            })
            .replace(/<pre(.*?)>(.*?)<\/pre>/gi, (match, attrs, text) => {
                return `<pre${attrs} class="bd-code-block">${text}</pre>`;
            });
    };

    const processedContent = processContent(content);

    return (
        <article className="bd-article" id="blog-article" itemScope itemType="https://schema.org/BlogPosting">
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </article>
    );
};

export default BlogArticle;
