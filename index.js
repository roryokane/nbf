const wrapper = content => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks Menu</H1>
<DL><p>
${content}
</DL><p>`;

const sanitize_html = str => 
	(str + "")
		.replace(/&/g,"&amp;")
		.replace(/</g,"&lt;")
		.replace(/>/g,"&gt;")
		.replace(/"/g,"&quot;")
		.replace(/'/g,"&#x27;");

// Format the JSON object for the bookmark item into a HTML fragment
const bookmark_to_html = item => {
	let tags = Array.isArray(item.tags) ? item.tags.join(',') : item.tags;
	let date = toDate(item.dateAdded);
	return `<DT><A HREF="${item.uri}" ${date ? `ADD_DATE="${date}"`: ''} ${ tags ? `TAGS="${tags}"` : ''}>${sanitize_html(item.title) || '[no title]'}</A>
${item.description ? `<DD>${sanitize_html(item.description)}` : ''}
	`;
};

// Transform the Javascript timestamp (in milliseconds from Jan 1, 1970) to the 
// Epoch time (in seconds from Jan 1, 1970) used in Netscape format
const toDate = date => date ? Math.round(new Date(date).getTime() / 1000) : '';

const render = obj => {
	if (Array.isArray(obj)) {
		return obj.map(render).join('\n');
	}
	if (Array.isArray(obj.children)) {
		// folder
		return `<DT><H3 FOLDED ${obj.dateAdded ? `ADD_DATE="${toDate(obj.dateAdded)}"` : ''}>${sanitize_html(obj.title)}</H3>
    <DL><p>
${render(obj.children)}
    </DL><p>`;
	} else if (obj.uri) {
		// item
		return bookmark_to_html(obj);
	}
};

module.exports = {
	toNBF: obj => {
		return wrapper(render(obj));
	}
};