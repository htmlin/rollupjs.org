import fs from 'fs';
import path from 'path';
import marked from 'marked';
import hljs from 'highlight.js';

// Register dummy language for plain text code blocks.
hljs.registerLanguage('text', () => ({}));

export default function createGuide() {
	const languages = Object.create(null);
	for (const lang of fs.readdirSync('guide')) {
		if (fs.statSync(`guide/${lang}`).isDirectory()) {
			languages[lang] = JSON.stringify(create_guide(lang));
		}
	}
	return languages;
}

function create_guide(lang) {
	const files = fs.readdirSync(`guide/${lang}`).filter(file => {
		return file[0] !== '.' && path.extname(file) === '.md';
	});

	return files.map(file => {
		const markdown = fs.readFileSync(`guide/${lang}/${file}`, 'utf-8');

		let match = /---\n([\s\S]+?)\n---/.exec(markdown);
		const front_matter = match[1];
		let content = markdown.slice(match[0].length);

		const metadata = {};
		front_matter.split('\n').forEach(pair => {
			const colon_index = pair.indexOf(':');
			metadata[pair.slice(0, colon_index).trim()] = pair.slice(colon_index + 1).trim();
		});

		// syntax highlighting
		let uid = 0;
		const highlighted = {};

		content = content.replace(/```([\w-]+)?\n([\s\S]+?)```/g, (match, lang, code) => {
			// TODO add bash everywhere and change default to text
			const { value } = hljs.highlight(code, { language: lang || 'bash' });
			highlighted[++uid] = value;

			return `@@${uid}`;
		});

		const renderer = new marked.Renderer();
		const tocItems = [];
		renderer.heading = (text, level, raw, slugger) => {
			const id = slugger.slug(raw);

			if (level === 3) {
				tocItems.push({ id, text, subSubSections: [] });
			} else if (level === 4 && tocItems.length > 0) {
				const previousTocItem = tocItems[tocItems.length - 1];
				previousTocItem.subSubSections.push({ id, text });
			}

			return `<h${level} id="${id}"><a class="anchor" href="guide/${lang}/#${id}"><img src="/images/anchor.svg" alt=""></a>${text}</h${level}>`;
		};

		const html = marked(content, { renderer })
			.replace(/<p>(<a class='open-in-repl'[\s\S]+?)<\/p>/g, '$1')
			.replace(/<p>@@(\d+)<\/p>/g, (match, id) => {
				return `<pre><code>${highlighted[id]}</code></pre>`;
			})
			.replace(/^\t+/gm, match => match.split('\t').join('  '));

		const subsections = [];
		const pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g;
		while ((match = pattern.exec(html))) {
			const slug = match[1];
			const title = match[2]
				// Remove <code> tags
				.replace(/<\/?code>/g, '')
				// Remove first HTML tag
				.replace(/<(\w+).*>.*<\/\1>/, '')
				// Unescape quotes
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
				// Remove parts in parentheses: foo (bar) -> foo
				.replace(/\((\w+).*\)/, '');

			subsections.push({ slug, title });
		}

		return {
			html,
			metadata,
			subsections,
			tocItems,
			slug: file.replace(/^\d+-/, '').replace(/\.md$/, '')
		};
	});
}
