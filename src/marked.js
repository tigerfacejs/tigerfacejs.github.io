const hljs = require('highlight.js');

const { $ } = global;
// Create reference instance
const myMarked = require('marked');

// Get reference
const renderer = new myMarked.Renderer();

renderer.link = function (href, title, text) {
    const prefix = 'tigerface-embed:';
    if (title && title.startsWith(prefix)) {
        const name = title.substr(prefix.length);
        return `<div>${text}</div><div id="${name}" style="border:1px solid rgba(0,0,0,0.3);background-color:rgba(0,0,0,0.7);float:left"></div><div style="clear:both"></div><script src="${href.replace(/html/g, 'js')}?_t=${+new Date()}"></script>`;
    } else if (href && href.indexOf('#') === -1 && href.endsWith('md')) {
        return `<a title="${title || text}" href="#${href}">${text}</a>`;
    }
    return `<a href="${href}" title="${title || text}">${text}</a>`;
};

myMarked.setOptions({
    highlight(code, lang) {
        const hljsCode = (hljs.highlight(lang, code, false)).value;
        return `<div class="hljs">${hljsCode}</div>`;
    },
});

function openmd(url, id, callback) {
    $(`#${id}`).html('正在读取...');
    $.get(`${url}?_t=${+new Date()}`, (md) => {
        const result = myMarked(md, { renderer });
        $(`#${id}`).html(result);
        if (callback) callback();
    });
}

global.openmd = openmd;
